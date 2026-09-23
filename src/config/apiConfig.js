/**
 * Hostinger Backend & Storage Configuration
 * 
 * Supports both:
 * 1. Same-domain hosting (Hostinger public_html where React & API are on the same domain: /api/...)
 * 2. Cross-domain hosting (e.g. React on Vercel/Netlify and Backend/Storage on Hostinger: https://api.yourdomain.com)
 */

const getHostingerApiBase = () => {
  // If explicitly defined in environment (e.g. https://api.yourdomain.com or https://yourdomain.com)
  const envApiUrl = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_HOSTINGER_API_URL) ||
                    (typeof process !== 'undefined' && process.env?.VITE_HOSTINGER_API_URL);
  if (envApiUrl && envApiUrl.trim()) {
    return envApiUrl.trim().replace(/\/+$/, '');
  }
  return '';
};

const getHostingerMediaBase = () => {
  const envMediaUrl = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_HOSTINGER_MEDIA_URL) ||
                      (typeof process !== 'undefined' && process.env?.VITE_HOSTINGER_MEDIA_URL);
  if (envMediaUrl && envMediaUrl.trim()) {
    return envMediaUrl.trim().replace(/\/+$/, '');
  }
  return getHostingerApiBase();
};

export const apiConfig = {
  apiBase: getHostingerApiBase(),
  mediaBase: getHostingerMediaBase(),

  /**
   * Resolves an API path (e.g. '/api/reels') against the Hostinger API host
   */
  getApiUrl(endpoint) {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const base = getHostingerApiBase();
    return base ? `${base}${cleanEndpoint}` : cleanEndpoint;
  },

  /**
   * Resolves a media URL (e.g. '/uploads/reels/video.mp4') against Hostinger Storage
   */
  getMediaUrl(mediaPath) {
    if (!mediaPath) return '';
    // If it's already an absolute URL (http:// or https://) or blob:, return as-is
    if (mediaPath.startsWith('http://') || mediaPath.startsWith('https://') || mediaPath.startsWith('blob:') || mediaPath.startsWith('data:')) {
      return mediaPath;
    }
    const cleanPath = mediaPath.startsWith('/') ? mediaPath : `/${mediaPath}`;
    const mediaBase = getHostingerMediaBase();
    return mediaBase ? `${mediaBase}${cleanPath}` : cleanPath;
  },

  /**
   * Safe fetch with timeout and JSON validation (safely ignores HTML SPA fallbacks)
   */
  async safeFetchJson(endpoint, options = {}, timeoutMs = 2500) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(new Error('Request timeout')), timeoutMs);
    try {
      const url = this.getApiUrl(endpoint);
      const res = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      clearTimeout(id);

      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        return { ok: false, status: res.status, data: null, isHtml: contentType.includes('text/html'), error: 'Non-JSON response' };
      }

      const data = await res.json();
      return { ok: res.ok, status: res.status, data, error: res.ok ? null : data?.error || 'Request failed' };
    } catch (err) {
      clearTimeout(id);
      return { ok: false, status: 0, data: null, error: err.message };
    }
  }
};

export default apiConfig;
