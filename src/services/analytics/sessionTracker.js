import { supabase } from '../../lib/supabase.js';

const ANON_STORAGE_KEY = 'eg_anonymous_id';
const SESSION_STORAGE_KEY = 'eg_current_session';

function generateUUID() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

class SessionTracker {
  constructor() {
    this.anonymousId = this.getOrCreateAnonymousId();
    this.sessionId = null;
    this.sessionData = null;
    this.initSession();
  }

  getOrCreateAnonymousId() {
    try {
      let anonId = localStorage.getItem(ANON_STORAGE_KEY);
      if (!anonId) {
        anonId = generateUUID();
        localStorage.setItem(ANON_STORAGE_KEY, anonId);
      }
      return anonId;
    } catch (e) {
      return generateUUID();
    }
  }

  detectDeviceType() {
    if (typeof window === 'undefined') return 'unknown';
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
      return 'tablet';
    }
    if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(ua)) {
      return 'mobile';
    }
    return 'desktop';
  }

  async initSession(userId = null) {
    try {
      const existingStr = sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (existingStr) {
        const parsed = JSON.parse(existingStr);
        this.sessionId = parsed.id;
        this.sessionData = parsed;
        return this.sessionData;
      }
    } catch (e) {}

    const newSession = {
      id: generateUUID(),
      user_id: userId,
      anonymous_id: this.anonymousId,
      device_type: this.detectDeviceType(),
      platform: typeof navigator !== 'undefined' ? navigator.platform : 'web',
      country: 'EG',
      language: typeof navigator !== 'undefined' && navigator.language?.startsWith('ar') ? 'ar' : 'en',
      started_at: new Date().toISOString()
    };

    this.sessionId = newSession.id;
    this.sessionData = newSession;

    try {
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(newSession));
    } catch (e) {}

    // Persist to Supabase if reachable
    try {
      await supabase.from('sessions').insert({
        id: newSession.id,
        user_id: newSession.user_id,
        anonymous_id: newSession.anonymous_id,
        device_type: newSession.device_type,
        platform: newSession.platform,
        country: newSession.country,
        language: newSession.language,
        started_at: newSession.started_at
      });
    } catch (err) {
      // Non-blocking fallback
    }

    return newSession;
  }

  async setAuthenticatedUser(userId) {
    if (this.sessionData) {
      this.sessionData.user_id = userId;
      try {
        sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(this.sessionData));
        await supabase.from('sessions').update({ user_id: userId }).eq('id', this.sessionId);
      } catch (e) {}
    }
  }

  getSessionContext() {
    return {
      anonymousId: this.anonymousId,
      sessionId: this.sessionId,
      deviceType: this.sessionData?.device_type || 'mobile'
    };
  }
}

export const sessionTracker = new SessionTracker();
