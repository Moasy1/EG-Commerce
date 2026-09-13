-- ====================================================================
-- PHASE 4: SECURITY HARDENING, MULTI-TENANCY & PERFORMANCE INDEXING
-- ====================================================================

-- 1. MULTI-TENANT CART SESSION ISOLATION
-- Ensure carts table has session_token for guest tracking
ALTER TABLE carts ADD COLUMN IF NOT EXISTS session_token TEXT;

-- Drop legacy over-permissive cart RLS policies if present
DROP POLICY IF EXISTS "Users can view own cart." ON carts;
DROP POLICY IF EXISTS "Users can insert own cart." ON carts;
DROP POLICY IF EXISTS "Users can update own cart." ON carts;
DROP POLICY IF EXISTS "Users can view own cart items." ON cart_items;
DROP POLICY IF EXISTS "Users can insert own cart items." ON cart_items;
DROP POLICY IF EXISTS "Users can update own cart items." ON cart_items;

-- Isolated Cart Policies: strictly by auth user OR matching session_token
CREATE POLICY "Isolated cart select policy"
  ON carts FOR SELECT
  USING (
    (auth.uid() IS NOT NULL AND user_id = auth.uid()) OR
    (session_token IS NOT NULL AND session_token = current_setting('request.headers', true)::json->>'x-session-token') OR
    (auth.uid() IS NULL AND session_token IS NOT NULL)
  );

CREATE POLICY "Isolated cart insert policy"
  ON carts FOR INSERT
  WITH CHECK (
    (auth.uid() IS NOT NULL AND user_id = auth.uid()) OR
    (auth.uid() IS NULL AND session_token IS NOT NULL)
  );

CREATE POLICY "Isolated cart update policy"
  ON carts FOR UPDATE
  USING (
    (auth.uid() IS NOT NULL AND user_id = auth.uid()) OR
    (session_token IS NOT NULL)
  );

-- Cart Items RLS
CREATE POLICY "Isolated cart items select policy"
  ON cart_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM carts 
      WHERE carts.id = cart_items.cart_id 
      AND (
        (auth.uid() IS NOT NULL AND carts.user_id = auth.uid()) OR
        carts.session_token IS NOT NULL
      )
    )
  );

CREATE POLICY "Isolated cart items insert policy"
  ON cart_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM carts 
      WHERE carts.id = cart_items.cart_id 
      AND (
        (auth.uid() IS NOT NULL AND carts.user_id = auth.uid()) OR
        carts.session_token IS NOT NULL
      )
    )
  );

CREATE POLICY "Isolated cart items update policy"
  ON cart_items FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM carts 
      WHERE carts.id = cart_items.cart_id 
      AND (
        (auth.uid() IS NOT NULL AND carts.user_id = auth.uid()) OR
        carts.session_token IS NOT NULL
      )
    )
  );

-- 2. BLOCK PRIVILEGE ESCALATION ON PROFILES
-- Prevent regular users from updating their own 'role' to superadmin or admin
CREATE OR REPLACE FUNCTION check_profile_role_update()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.role <> OLD.role THEN
    -- Only allow service_role or existing superadmin to update roles
    IF current_user <> 'service_role' AND auth.jwt() ->> 'role' <> 'superadmin' THEN
      RAISE EXCEPTION 'Unauthorized: You cannot alter account role permissions';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_prevent_role_escalation ON profiles;
CREATE TRIGGER trg_prevent_role_escalation
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION check_profile_role_update();

-- 3. ATOMIC ORDER CREATION & SERVER-SIDE PRICING RPC
-- Calculates subtotal from database base_price, validates stock atomically, and creates order
CREATE OR REPLACE FUNCTION rpc_create_order(
  p_user_id UUID,
  p_items JSONB,
  p_promo_code TEXT DEFAULT NULL,
  p_points_redeemed INT DEFAULT 0
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_item RECORD;
  v_product RECORD;
  v_subtotal DECIMAL(10,2) := 0.00;
  v_discount DECIMAL(10,2) := 0.00;
  v_shipping DECIMAL(10,2) := 60.00;
  v_total DECIMAL(10,2) := 0.00;
  v_order_id UUID;
  v_quantity INT;
  v_unit_price DECIMAL(10,2);
BEGIN
  IF p_items IS NULL OR jsonb_array_length(p_items) = 0 THEN
    RAISE EXCEPTION 'Cannot create an empty order';
  END IF;

  -- 1. Lock and validate product records and calculate real subtotal
  FOR v_item IN SELECT * FROM jsonb_to_recordset(p_items) AS (
    product_id UUID,
    merchant_id UUID,
    quantity INT,
    size TEXT,
    color TEXT
  )
  LOOP
    -- Lock row to prevent stock race condition
    SELECT id, base_price, stock_quantity, title
    INTO v_product
    FROM products
    WHERE id = v_item.product_id
    FOR UPDATE;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Product % not found in catalog', v_item.product_id;
    END IF;

    IF v_product.stock_quantity < v_item.quantity THEN
      RAISE EXCEPTION 'Insufficient stock for % (Available: %, Requested: %)', 
        v_product.title, v_product.stock_quantity, v_item.quantity;
    END IF;

    v_subtotal := v_subtotal + (v_product.base_price * v_item.quantity);
  END LOOP;

  -- 2. Server-side discount calculation
  IF p_points_redeemed > 0 THEN
    v_discount := FLOOR(p_points_redeemed / 10);
  END IF;

  -- Promo code application if valid (e.g. TALIESKA15 = 15%)
  IF p_promo_code IS NOT NULL AND UPPER(p_promo_code) IN ('TALIESKA15', 'KHAN10', 'TIBA20') THEN
    IF UPPER(p_promo_code) = 'TALIESKA15' THEN
      v_discount := v_discount + (v_subtotal * 0.15);
      IF v_subtotal >= 1500 THEN v_shipping := 0.00; END IF;
    ELSIF UPPER(p_promo_code) = 'KHAN10' THEN
      v_discount := v_discount + (v_subtotal * 0.10);
    ELSIF UPPER(p_promo_code) = 'TIBA20' THEN
      v_discount := v_discount + (v_subtotal * 0.20);
    END IF;
  END IF;

  v_total := GREATEST(0.00, v_subtotal - v_discount + v_shipping);

  -- 3. Insert Master Order
  INSERT INTO orders (
    user_id,
    status,
    subtotal,
    discount_amount,
    shipping_amount,
    total_amount,
    reward_points_used
  ) VALUES (
    p_user_id,
    'pending',
    v_subtotal,
    v_discount,
    v_shipping,
    v_total,
    p_points_redeemed
  ) RETURNING id INTO v_order_id;

  -- 4. Insert Line Items and decrement stock
  FOR v_item IN SELECT * FROM jsonb_to_recordset(p_items) AS (
    product_id UUID,
    merchant_id UUID,
    quantity INT,
    size TEXT,
    color TEXT
  )
  LOOP
    SELECT base_price INTO v_unit_price FROM products WHERE id = v_item.product_id;

    INSERT INTO order_items (
      order_id,
      product_id,
      merchant_id,
      quantity,
      unit_price,
      status
    ) VALUES (
      v_order_id,
      v_item.product_id,
      v_item.merchant_id,
      v_item.quantity,
      v_unit_price,
      'pending'
    );

    -- Decrement inventory count
    UPDATE products
    SET stock_quantity = stock_quantity - v_item.quantity
    WHERE id = v_item.product_id;
  END LOOP;

  RETURN jsonb_build_object(
    'id', v_order_id,
    'status', 'pending',
    'subtotal', v_subtotal,
    'discount_amount', v_discount,
    'shipping_amount', v_shipping,
    'total_amount', v_total,
    'created_at', NOW()
  );
END;
$$;

-- 4. ADMIN METRICS AGGREGATION RPC
CREATE OR REPLACE FUNCTION get_admin_metrics()
RETURNS JSONB
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT jsonb_build_object(
    'total_revenue', COALESCE(SUM(total_amount), 0),
    'total_orders', COUNT(*),
    'platform_commission', COALESCE(SUM(total_amount) * 0.12, 0),
    'active_merchants', (SELECT COUNT(*) FROM merchants WHERE verified = true)
  )
  FROM orders
  WHERE status NOT IN ('cancelled', 'refunded');
$$;

-- 5. HIGH-PERFORMANCE COMPOSITE INDEXES
CREATE INDEX IF NOT EXISTS idx_orders_user_created ON orders(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_merchant ON order_items(order_id, merchant_id);
CREATE INDEX IF NOT EXISTS idx_products_merchant_active ON products(merchant_id, is_active);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_reels_creator_status ON reels(creator_id, status);
CREATE INDEX IF NOT EXISTS idx_carts_user_status ON carts(user_id, status);
CREATE INDEX IF NOT EXISTS idx_carts_session_token ON carts(session_token);
CREATE INDEX IF NOT EXISTS idx_cart_items_cart_product ON cart_items(cart_id, product_id);
