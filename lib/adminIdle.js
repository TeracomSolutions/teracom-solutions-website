// Automatic sign-out for the staff console: shared names and pure helpers,
// used by middleware.js (Edge), the route handlers and the browser timer.
// No Next or Node imports, so the plain Node test runner can load it.

export const ACCESS_TOKEN_COOKIE = 'teracom_admin_session';
export const REFRESH_TOKEN_COOKIE = 'teracom_admin_refresh';
// Not a secret: the chosen idle time in minutes, readable by the browser
// so the countdown knows how long it has.
export const IDLE_COOKIE = 'teracom_admin_idle';
// The last moment the server recorded activity, shared between tabs.
export const LAST_TOUCH_KEY = 'teracom_admin_last_touch';

export const IDLE_CHOICES = [5, 10, 15, 30, 60, 120, 240, 480];
export const DEFAULT_IDLE_MINUTES = 15;
// Refresh the access token (and so record activity on the server) at most
// this often, and always when it is this close to expiring.
export const REFRESH_AFTER_SECONDS = 60;
export const REFRESH_BEFORE_EXPIRY_SECONDS = 30;
export const WARN_BEFORE_MS = 60_000;

export function idleLabel(minutes) {
  const m = Number(minutes);
  if (!Number.isFinite(m) || m <= 0) return '';
  if (m < 60) return `${m} minute${m === 1 ? '' : 's'}`;
  const h = m / 60;
  if (Number.isInteger(h)) return `${h} hour${h === 1 ? '' : 's'}`;
  return `${m} minutes`;
}

export function parseIdleMinutes(value) {
  const m = Number(value);
  return IDLE_CHOICES.includes(m) ? m : DEFAULT_IDLE_MINUTES;
}

function base64UrlDecode(part) {
  const padded = part.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((part.length + 3) % 4);
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

// The claims of a JWT, unverified: only used to decide whether to refresh.
// The backend verifies every token it is given.
export function decodeJwtPayload(token) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  try {
    const payload = JSON.parse(base64UrlDecode(parts[1]));
    return payload && typeof payload === 'object' ? payload : null;
  } catch {
    return null;
  }
}

export function needsRefresh(payload, nowSeconds) {
  if (!payload || !Number.isFinite(payload.iat) || !Number.isFinite(payload.exp)) return true;
  if (nowSeconds - payload.iat >= REFRESH_AFTER_SECONDS) return true;
  return payload.exp - nowSeconds <= REFRESH_BEFORE_EXPIRY_SECONDS;
}

export function remainingMs({ lastTouch, idleMinutes, now }) {
  return lastTouch + parseIdleMinutes(idleMinutes) * 60_000 - now;
}

export function formatCountdown(ms) {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const ss = String(s).padStart(2, '0');
  return h > 0 ? `${h}:${String(m).padStart(2, '0')}:${ss}` : `${m}:${ss}`;
}

// Why the console sent someone back to the sign-in page, from the backend's answer.
export function signOutReason(detail) {
  return /without activity/i.test(String(detail || '')) ? 'idle' : 'expired';
}

export function cookieOptions(production) {
  return { httpOnly: true, secure: Boolean(production), sameSite: 'lax', path: '/' };
}

// A Cookie request header with one value replaced (or added).
export function replaceCookie(header, name, value) {
  const parts = String(header || '')
    .split(';')
    .map((p) => p.trim())
    .filter((p) => p && !p.startsWith(`${name}=`));
  parts.push(`${name}=${value}`);
  return parts.join('; ');
}
