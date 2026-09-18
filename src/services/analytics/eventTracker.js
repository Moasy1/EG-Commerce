import { supabase } from '../../lib/supabase.js';
import { sessionTracker } from './sessionTracker.js';

const LOCAL_EVENTS_KEY = 'eg_user_events_v1';
const MAX_LOCAL_EVENTS = 500;
const FLUSH_INTERVAL_MS = 3000;

class EventTracker {
  constructor() {
    this.buffer = [];
    this.timer = null;
    this.subscribers = new Set();
    this.initFlushInterval();
  }

  initFlushInterval() {
    if (typeof window !== 'undefined') {
      this.timer = setInterval(() => this.flush(), FLUSH_INTERVAL_MS);
      window.addEventListener('beforeunload', () => this.flush(true));
    }
  }

  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  notifySubscribers(event) {
    for (const callback of this.subscribers) {
      try {
        callback(event);
      } catch (err) {
        console.warn('Error in event subscriber callback:', err);
      }
    }
  }

  /**
   * Core dispatch for all events across the application
   */
  async trackEvent(eventType, {
    userId = null,
    entityType = 'reel',
    entityId = null,
    reelId = null,
    productId = null,
    merchantId = null,
    creatorId = null,
    position = null,
    durationMs = null,
    metadata = {}
  } = {}) {
    const sessionContext = sessionTracker.getSessionContext();

    const eventRecord = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `ev-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      user_id: userId,
      anonymous_id: sessionContext.anonymousId,
      session_id: sessionContext.sessionId,
      event_type: eventType,
      entity_type: entityType,
      entity_id: entityId || reelId || productId,
      reel_id: reelId,
      product_id: productId,
      merchant_id: merchantId,
      creator_id: creatorId,
      position: position,
      duration_ms: durationMs,
      metadata: metadata || {},
      created_at: new Date().toISOString()
    };

    // 1. Immediately store in local events history for algorithm scoring
    this.saveToLocalCache(eventRecord);

    // 2. Buffer for asynchronous Supabase batching
    this.buffer.push(eventRecord);

    // 3. Inform subscribers (interest engine, analytics widgets)
    this.notifySubscribers(eventRecord);

    return eventRecord;
  }

  saveToLocalCache(event) {
    try {
      const raw = localStorage.getItem(LOCAL_EVENTS_KEY);
      const list = raw ? JSON.parse(raw) : [];
      list.unshift(event);
      if (list.length > MAX_LOCAL_EVENTS) {
        list.length = MAX_LOCAL_EVENTS;
      }
      localStorage.setItem(LOCAL_EVENTS_KEY, JSON.stringify(list));
    } catch (e) {}
  }

  getLocalEvents(filter = {}) {
    try {
      const raw = localStorage.getItem(LOCAL_EVENTS_KEY);
      let list = raw ? JSON.parse(raw) : [];
      if (filter.eventType) {
        list = list.filter(e => e.event_type === filter.eventType);
      }
      if (filter.userId) {
        list = list.filter(e => e.user_id === filter.userId);
      }
      if (filter.reelId) {
        list = list.filter(e => e.reel_id === filter.reelId);
      }
      return list;
    } catch (e) {
      return [];
    }
  }

  async flush(isImmediate = false) {
    if (this.buffer.length === 0) return;

    const eventsToFlush = [...this.buffer];
    this.buffer = [];

    try {
      const { error } = await supabase.from('user_events').insert(eventsToFlush);
      if (error) {
        // Re-buffer on transient network error if not unloading
        if (!isImmediate) {
          this.buffer = [...eventsToFlush, ...this.buffer].slice(-100);
        }
      }
    } catch (err) {
      if (!isImmediate) {
        this.buffer = [...eventsToFlush, ...this.buffer].slice(-100);
      }
    }
  }

  // Helper convenience methods for Reels video lifecycle
  trackReelImpression(reel, position) {
    return this.trackEvent('reel_impression', {
      entityType: 'reel',
      reelId: reel.id,
      creatorId: reel.creatorId || reel.creator_id,
      merchantId: reel.merchantId || reel.merchant_id,
      position,
      metadata: { caption: reel.caption?.substring(0, 80) }
    });
  }

  trackReelStart(reel) {
    return this.trackEvent('reel_start', {
      entityType: 'reel',
      reelId: reel.id,
      creatorId: reel.creatorId || reel.creator_id,
      merchantId: reel.merchantId || reel.merchant_id
    });
  }

  trackReelProgress(reel, percentage, watchMs) {
    const eventType = `reel_${percentage}_percent`;
    return this.trackEvent(eventType, {
      entityType: 'reel',
      reelId: reel.id,
      creatorId: reel.creatorId || reel.creator_id,
      merchantId: reel.merchantId || reel.merchant_id,
      durationMs: watchMs,
      metadata: { completion_rate: percentage / 100 }
    });
  }

  trackReelComplete(reel, watchMs) {
    return this.trackEvent('reel_complete', {
      entityType: 'reel',
      reelId: reel.id,
      creatorId: reel.creatorId || reel.creator_id,
      merchantId: reel.merchantId || reel.merchant_id,
      durationMs: watchMs,
      metadata: { completion_rate: 1.0 }
    });
  }

  trackReelRewatch(reel, rewatchCount) {
    return this.trackEvent('reel_rewatch', {
      entityType: 'reel',
      reelId: reel.id,
      creatorId: reel.creatorId || reel.creator_id,
      metadata: { rewatch_count: rewatchCount }
    });
  }

  trackReelSkip(reel, watchMs) {
    return this.trackEvent('reel_skip', {
      entityType: 'reel',
      reelId: reel.id,
      creatorId: reel.creatorId || reel.creator_id,
      durationMs: watchMs,
      metadata: { reason: 'fast_swipe' }
    });
  }

  // Negative Signals
  trackNotInterested(reel) {
    return this.trackEvent('reel_not_interested', {
      entityType: 'reel',
      reelId: reel.id,
      creatorId: reel.creatorId || reel.creator_id,
      merchantId: reel.merchantId || reel.merchant_id
    });
  }

  trackReportContent(reel, reason) {
    return this.trackEvent('report_content', {
      entityType: 'reel',
      reelId: reel.id,
      creatorId: reel.creatorId || reel.creator_id,
      metadata: { reason }
    });
  }

  // Commerce Signals
  trackProductClick(product, reel = null) {
    return this.trackEvent('product_click', {
      entityType: 'product',
      productId: product.id,
      reelId: reel?.id || null,
      creatorId: reel?.creatorId || reel?.creator_id || null,
      merchantId: product.merchant_id || product.merchantId || reel?.merchantId || null,
      metadata: { price: product.price, title: product.title }
    });
  }

  trackQuickBuyOpen(product, reel = null) {
    return this.trackEvent('quick_buy_open', {
      entityType: 'product',
      productId: product.id,
      reelId: reel?.id || null,
      creatorId: reel?.creatorId || reel?.creator_id || null,
      merchantId: product.merchant_id || product.merchantId || null,
      metadata: { price: product.price }
    });
  }

  trackAddToCart(product, reelId = null) {
    return this.trackEvent('add_to_cart', {
      entityType: 'product',
      productId: product.id,
      reelId: reelId,
      merchantId: product.merchant_id || product.merchantId || null,
      metadata: { price: product.price, quantity: 1 }
    });
  }

  trackPurchase(order, orderItems = []) {
    return this.trackEvent('purchase', {
      entityType: 'order',
      entityId: order.id,
      metadata: {
        total: order.total_amount || order.total,
        itemCount: orderItems.length,
        orderId: order.id
      }
    });
  }
}

export const eventTracker = new EventTracker();
