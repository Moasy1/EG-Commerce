-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

-- 1. Profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone."
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile."
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile."
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- 2. Merchants
ALTER TABLE merchants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Merchants are viewable by everyone."
  ON merchants FOR SELECT
  USING (true);

CREATE POLICY "Merchants can insert their own store."
  ON merchants FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Merchants can update own store."
  ON merchants FOR UPDATE
  USING (auth.uid() = user_id);

-- 3. Products
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Products are viewable by everyone."
  ON products FOR SELECT
  USING (true);

CREATE POLICY "Merchants can insert their own products."
  ON products FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM merchants WHERE merchants.id = products.merchant_id AND merchants.user_id = auth.uid())
  );

CREATE POLICY "Merchants can update own products."
  ON products FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM merchants WHERE merchants.id = products.merchant_id AND merchants.user_id = auth.uid())
  );

CREATE POLICY "Merchants can delete own products."
  ON products FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM merchants WHERE merchants.id = products.merchant_id AND merchants.user_id = auth.uid())
  );

-- 4. Reels
ALTER TABLE reels ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Active reels viewable by everyone."
  ON reels FOR SELECT
  USING (true);

CREATE POLICY "Creators can create reels."
  ON reels FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM creators WHERE creators.id = reels.creator_id AND creators.user_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM merchants WHERE merchants.id = reels.merchant_id AND merchants.user_id = auth.uid())
  );

-- 5. Carts & Cart Items
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own cart."
  ON carts FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert own cart."
  ON carts FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update own cart."
  ON carts FOR UPDATE
  USING (auth.uid() = user_id OR user_id IS NULL);

ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own cart items."
  ON cart_items FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM carts WHERE carts.id = cart_items.cart_id AND (carts.user_id = auth.uid() OR carts.user_id IS NULL))
  );

CREATE POLICY "Users can insert own cart items."
  ON cart_items FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM carts WHERE carts.id = cart_items.cart_id AND (carts.user_id = auth.uid() OR carts.user_id IS NULL))
  );

CREATE POLICY "Users can update own cart items."
  ON cart_items FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM carts WHERE carts.id = cart_items.cart_id AND (carts.user_id = auth.uid() OR carts.user_id IS NULL))
  );

-- 6. Orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own orders."
  ON orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own orders."
  ON orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own order items."
  ON order_items FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM merchants WHERE merchants.id = order_items.merchant_id AND merchants.user_id = auth.uid())
  );

CREATE POLICY "Users can insert own order items."
  ON order_items FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
  );

-- Note: In a production environment, order status updates would be constrained to Merchants/Admins
