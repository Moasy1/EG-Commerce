import { supabase } from '../../lib/supabase.js';
import { sessionTracker } from './sessionTracker.js';

const ATTR_SESSION_KEY = 'eg_active_attributions';
const EXPIRY_DAYS = 7;

class AttributionService {
  constructor() {
    this.activeAttributions = this.loadLocalAttributions();
  }

  loadLocalAttributions() {
    try {
      const stored = localStorage.getItem(ATTR_SESSION_KEY);
      if (!stored) return {};
      const parsed = JSON.parse(stored);
      // Clean expired
      const now = Date.now();
      const valid = {};
      for (const [key, item] of Object.entries(parsed)) {
        if (new Date(item.expires_at).getTime() > now) {
          valid[key] = item;
        }
      }
      return valid;
    } catch (e) {
      return {};
    }
  }

  saveLocalAttributions() {
    try {
      localStorage.setItem(ATTR_SESSION_KEY, JSON.stringify(this.activeAttributions));
    } catch (e) {}
  }

  /**
   * Register a touchpoint when a user discovers/clicks a product from a Reel
   */
  async registerTouchpoint({ reelId, productId, creatorId = null, merchantId = null, userId = null }) {
    if (!productId || !reelId) return null;

    const sessionCtx = sessionTracker.getSessionContext();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + EXPIRY_DAYS * 24 * 60 * 60 * 1000);

    const attributionRecord = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `attr-${Date.now()}`,
      user_id: userId,
      anonymous_id: sessionCtx.anonymousId,
      reel_id: reelId,
      product_id: productId,
      creator_id: creatorId,
      merchant_id: merchantId,
      first_seen_at: now.toISOString(),
      last_seen_at: now.toISOString(),
      expires_at: expiresAt.toISOString()
    };

    // Store keyed by productId
    this.activeAttributions[productId] = attributionRecord;
    this.saveLocalAttributions();

    // Async sync to Supabase
    try {
      await supabase.from('attribution_sessions').insert(attributionRecord);
    } catch (err) {
      // Non-blocking
    }

    return attributionRecord;
  }

  getAttributionForProduct(productId) {
    const item = this.activeAttributions[productId];
    if (!item) return null;
    if (new Date(item.expires_at).getTime() < Date.now()) {
      delete this.activeAttributions[productId];
      this.saveLocalAttributions();
      return null;
    }
    return item;
  }

  /**
   * Record conversion upon purchase for attributed items
   */
  async recordOrderConversion(order, orderItems = []) {
    const conversions = [];

    for (const item of orderItems) {
      const prodId = item.productId || item.product_id || item.id;
      const attr = this.getAttributionForProduct(prodId);

      if (attr) {
        const itemTotal = (Number(item.price || item.unit_price) || 0) * (Number(item.quantity) || 1);
        const commissionRate = Number(item.commission_rate || item.affiliate_commission_rate || 0.10);
        const commissionAmount = Number((itemTotal * commissionRate).toFixed(2));

        const conversionRecord = {
          id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `conv-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          attribution_session_id: attr.id,
          order_id: order.id,
          order_item_id: item.order_item_id || item.id || null,
          reel_id: attr.reel_id,
          creator_id: attr.creator_id,
          merchant_id: attr.merchant_id,
          revenue_amount: itemTotal,
          commission_amount: commissionAmount,
          created_at: new Date().toISOString()
        };

        conversions.push(conversionRecord);

        // Async write to Supabase
        try {
          await supabase.from('reel_conversions').insert(conversionRecord);
        } catch (err) {}
      }
    }

    // Save locally for analytics / creator earnings preview
    try {
      const storedConvs = localStorage.getItem('eg_reel_conversions');
      const list = storedConvs ? JSON.parse(storedConvs) : [];
      localStorage.setItem('eg_reel_conversions', JSON.stringify([...conversions, ...list]));
    } catch (e) {}

    return conversions;
  }
}

export const attributionService = new AttributionService();
