-- PHASE 5: CROSS-DOMAIN PLATFORM ORDER SYNC
-- Stores the dashboard-ready order payload so vendor subdomains and the main
-- platform can see the same demo/early-production orders.

CREATE TABLE IF NOT EXISTS platform_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    display_id TEXT UNIQUE NOT NULL,
    merchant_id TEXT NOT NULL,
    customer_name TEXT,
    phone TEXT,
    order_data JSONB NOT NULL,
    shipping_status TEXT DEFAULT 'ready_for_pickup',
    payment_status TEXT DEFAULT 'pending',
    total_amount DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_platform_orders_created ON platform_orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_platform_orders_merchant ON platform_orders(merchant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_platform_orders_display ON platform_orders(display_id);

ALTER TABLE platform_orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Platform orders are readable by dashboard clients." ON platform_orders;
DROP POLICY IF EXISTS "Platform orders can be created by checkout clients." ON platform_orders;
DROP POLICY IF EXISTS "Platform orders can update shipping state." ON platform_orders;

CREATE POLICY "Platform orders are readable by dashboard clients."
  ON platform_orders FOR SELECT
  USING (true);

CREATE POLICY "Platform orders can be created by checkout clients."
  ON platform_orders FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Platform orders can update shipping state."
  ON platform_orders FOR UPDATE
  USING (true)
  WITH CHECK (true);
