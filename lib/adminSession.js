// Server-only. The staff console's session cookies: the short-lived access
// token, the refresh token (both httpOnly, never readable by browser
// JavaScript), and the chosen idle time (not a secret; the countdown reads
// it). The access token is refreshed by middleware.js while the console is
// in use; the backend refuses a refresh once the staff member has been
// inactive for their chosen time (Account, Automatic sign-out).
if (typeof window !== 'undefined') {
  throw new Error('lib/adminSession.js must only be used on the server.');
}

import { ACCESS_TOKEN_COOKIE, IDLE_COOKIE, REFRESH_TOKEN_COOKIE, cookieOptions } from './adminIdle.js';

export { ACCESS_TOKEN_COOKIE, IDLE_COOKIE, REFRESH_TOKEN_COOKIE };

// The backend's defaults: a 15-minute access token and a 30-day refresh
// token. The backend sends the actual access lifetime with every token.
const DEFAULT_ACCESS_MAX_AGE_SECONDS = 15 * 60;
const REFRESH_TOKEN_MAX_AGE_SECONDS = 30 * 24 * 60 * 60;

export function baseCookieOptions() {
  return cookieOptions(process.env.NODE_ENV === 'production');
}

export function setAdminSessionCookies(response, { accessToken, refreshToken, accessMaxAge, idleMinutes }) {
  response.cookies.set(ACCESS_TOKEN_COOKIE, accessToken, {
    ...baseCookieOptions(),
    maxAge: Number(accessMaxAge) > 0 ? Number(accessMaxAge) : DEFAULT_ACCESS_MAX_AGE_SECONDS,
  });

  if (refreshToken) {
    response.cookies.set(REFRESH_TOKEN_COOKIE, refreshToken, {
      ...baseCookieOptions(),
      maxAge: REFRESH_TOKEN_MAX_AGE_SECONDS,
    });
  }

  if (idleMinutes) {
    response.cookies.set(IDLE_COOKIE, String(idleMinutes), {
      ...baseCookieOptions(),
      httpOnly: false,
      maxAge: REFRESH_TOKEN_MAX_AGE_SECONDS,
    });
  }

  return response;
}

export function clearAdminSessionCookies(response) {
  response.cookies.set(ACCESS_TOKEN_COOKIE, '', { ...baseCookieOptions(), maxAge: 0 });
  response.cookies.set(REFRESH_TOKEN_COOKIE, '', { ...baseCookieOptions(), maxAge: 0 });
  response.cookies.set(IDLE_COOKIE, '', { ...baseCookieOptions(), httpOnly: false, maxAge: 0 });
  return response;
}
