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
  }
};

export default apiConfig;
