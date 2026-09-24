-- ====================================================================
-- PHASE 6: MULTI-TENANT SECURITY HARDENING & ROW-LEVEL ISOLATION
-- ====================================================================

-- 1. HARDEN PRODUCTS ROW-LEVEL SECURITY
ALTER TABLE IF EXISTS products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read active products" ON products;
DROP POLICY IF EXISTS "Merchants can insert own products" ON products;
DROP POLICY IF EXISTS "Merchants can update own products" ON products;
DROP POLICY IF EXISTS "Merchants can delete own products" ON products;
DROP POLICY IF EXISTS "Admins have full access to products" ON products;

-- Anyone can view active products in the marketplace or storefront
CREATE POLICY "Public read active products"
  ON products FOR SELECT
  USING (status IN ('active', 'draft') OR status IS NULL);

-- Merchants can insert products ONLY for their own verified store
CREATE POLICY "Merchants can insert own products"
  ON products FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM merchants 
      WHERE merchants.id = products.merchant_id 
      AND merchants.user_id = auth.uid()
    ) OR
    (auth.jwt() ->> 'role' IN ('admin', 'superadmin'))
  );

-- Merchants can update ONLY their own store products
CREATE POLICY "Merchants can update own products"
  ON products FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM merchants 
      WHERE merchants.id = products.merchant_id 
      AND merchants.user_id = auth.uid()
    ) OR
    (auth.jwt() ->> 'role' IN ('admin', 'superadmin'))
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM merchants 
      WHERE merchants.id = products.merchant_id 
      AND merchants.user_id = auth.uid()
    ) OR
    (auth.jwt() ->> 'role' IN ('admin', 'superadmin'))
  );

-- Merchants can delete ONLY their own store products
CREATE POLICY "Merchants can delete own products"
  ON products FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM merchants 
      WHERE merchants.id = products.merchant_id 
      AND merchants.user_id = auth.uid()
    ) OR
    (auth.jwt() ->> 'role' IN ('admin', 'superadmin'))
  );


-- 2. HARDEN MERCHANTS (STORES) ROW-LEVEL SECURITY
ALTER TABLE IF EXISTS merchants ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read merchants" ON merchants;
DROP POLICY IF EXISTS "Merchants can update own store profile" ON merchants;
DROP POLICY IF EXISTS "Admins can manage all merchants" ON merchants;

-- Anyone can view registered stores
CREATE POLICY "Public read merchants"
  ON merchants FOR SELECT
  USING (true);

-- Merchants can only update their own store settings
CREATE POLICY "Merchants can update own store profile"
  ON merchants FOR UPDATE
  USING (
    user_id = auth.uid() OR
    (auth.jwt() ->> 'role' IN ('admin', 'superadmin'))
  )
  WITH CHECK (
    user_id = auth.uid() OR
    (auth.jwt() ->> 'role' IN ('admin', 'superadmin'))
  );

-- Superadmins can insert or delete merchants
CREATE POLICY "Admins can manage all merchants"
  ON merchants FOR ALL
  USING (
    (auth.jwt() ->> 'role' IN ('admin', 'superadmin')) OR
    (current_user = 'service_role')
  );


-- 3. HARDEN PLATFORM ORDERS & PREVENT PII LEAKS
ALTER TABLE IF EXISTS platform_orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Platform orders are readable by dashboard clients." ON platform_orders;
DROP POLICY IF EXISTS "Platform orders can be created by checkout clients." ON platform_orders;
DROP POLICY IF EXISTS "Platform orders can update shipping state." ON platform_orders;
DROP POLICY IF EXISTS "Isolated platform orders select" ON platform_orders;
DROP POLICY IF EXISTS "Isolated platform orders insert" ON platform_orders;
DROP POLICY IF EXISTS "Isolated platform orders update" ON platform_orders;

-- Select is scoped strictly:
-- 1. Admins / Superadmins see all orders
-- 2. Merchants see ONLY orders where merchant_id belongs to their store
-- 3. Buyers see ONLY orders where order_data contains their userId
CREATE POLICY "Isolated platform orders select"
  ON platform_orders FOR SELECT
  USING (
    -- Superadmin / Admin access
    (auth.jwt() ->> 'role' IN ('admin', 'superadmin')) OR
    -- Merchant access to their own store orders
    EXISTS (
      SELECT 1 FROM merchants 
      WHERE merchants.id::text = platform_orders.merchant_id 
      AND merchants.user_id = auth.uid()
    ) OR
    -- Buyer access to their own orders
    (
      auth.uid() IS NOT NULL AND 
      (platform_orders.order_data->>'userId' = auth.uid()::text)
    ) OR
    -- Guest checkout with matching session header
    (
      auth.uid() IS NULL AND
      current_setting('request.headers', true)::json->>'x-session-token' IS NOT NULL AND
      platform_orders.order_data->>'sessionToken' = current_setting('request.headers', true)::json->>'x-session-token'
    )
  );

-- Insert: allowed during checkout
CREATE POLICY "Isolated platform orders insert"
  ON platform_orders FOR INSERT
  WITH CHECK (true);

-- Update: only the owning merchant or platform admin can update fulfillment / shipping
CREATE POLICY "Isolated platform orders update"
  ON platform_orders FOR UPDATE
  USING (
    (auth.jwt() ->> 'role' IN ('admin', 'superadmin')) OR
    EXISTS (
      SELECT 1 FROM merchants 
      WHERE merchants.id::text = platform_orders.merchant_id 
      AND merchants.user_id = auth.uid()
    )
  )
  WITH CHECK (
    (auth.jwt() ->> 'role' IN ('admin', 'superadmin')) OR
    EXISTS (
      SELECT 1 FROM merchants 
      WHERE merchants.id::text = platform_orders.merchant_id 
      AND merchants.user_id = auth.uid()
    )
  );


-- 4. HARDEN RELATIONAL ORDERS AND ORDER ITEMS
ALTER TABLE IF EXISTS orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Orders select isolation" ON orders;
DROP POLICY IF EXISTS "Order items select isolation" ON order_items;

CREATE POLICY "Orders select isolation"
  ON orders FOR SELECT
  USING (
    (auth.jwt() ->> 'role' IN ('admin', 'superadmin')) OR
    (auth.uid() IS NOT NULL AND user_id = auth.uid()) OR
    EXISTS (
      SELECT 1 FROM order_items 
      JOIN merchants ON merchants.id = order_items.merchant_id
      WHERE order_items.order_id = orders.id 
      AND merchants.user_id = auth.uid()
    )
  );

CREATE POLICY "Order items select isolation"
  ON order_items FOR SELECT
  USING (
    (auth.jwt() ->> 'role' IN ('admin', 'superadmin')) OR
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM merchants 
      WHERE merchants.id = order_items.merchant_id 
      AND merchants.user_id = auth.uid()
    )
  );
