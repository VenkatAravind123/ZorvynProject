const AUTH_TOKEN_COOKIE = 'finance_token';

const isSecureContext = () => {
  try {
    return globalThis.location?.protocol === 'https:';
  } catch {
    return false;
  }
};

export const setAuthToken = (token, { days = 1 } = {}) => {
  if (!token) return;

  const maxAgeSeconds = Math.max(1, Math.floor(days * 24 * 60 * 60));
  const parts = [
    `${AUTH_TOKEN_COOKIE}=${encodeURIComponent(token)}`,
    'Path=/',
    `Max-Age=${maxAgeSeconds}`,
    'SameSite=Lax'
  ];

  // Only add Secure when actually on https, otherwise the cookie won't be stored in dev.
  if (isSecureContext()) parts.push('Secure');

  document.cookie = parts.join('; ');
};

export const getAuthToken = () => {
  const cookieStr = typeof document !== 'undefined' ? document.cookie || '' : '';
  if (!cookieStr) return null;

  const cookies = cookieStr.split(';').map((c) => c.trim());
  const prefix = `${AUTH_TOKEN_COOKIE}=`;
  const hit = cookies.find((c) => c.startsWith(prefix));
  if (!hit) return null;

  const value = hit.slice(prefix.length);
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

export const clearAuthToken = () => {
  // Expire immediately
  const parts = [
    `${AUTH_TOKEN_COOKIE}=`,
    'Path=/',
    'Max-Age=0',
    'SameSite=Lax'
  ];

  if (isSecureContext()) parts.push('Secure');

  document.cookie = parts.join('; ');
};

export const getAuthHeader = () => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};
