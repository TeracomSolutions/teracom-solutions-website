// Server-only. Teracom Solutions Website Admin, Phase 1 -- the admin
// session cookie this app sets after a successful staff login
// (app/api/admin/login/route.js) and reads everywhere else that
// needs to know "is someone logged in, and as whom" (the
// /admin/catalog page, app/api/admin/catalog/*/route.js). httpOnly so
// the token is never readable from browser JavaScript (this is a real
// bearer credential, the same reasoning every other secret in this
// codebase gets kept server-side only) -- the deliberate alternative
// to localStorage. See the Phase 1 report for why a refresh-token
// rotation flow was NOT built in this pass: ACCESS_TOKEN_COOKIE holds
// teracom-platform-backend's short-lived (15-minute default) staff
// access token as-is; when it expires the admin simply logs in again.
// REFRESH_TOKEN_COOKIE is stored (also httpOnly) so that follow-up
// work is a cookie-read away, not a second migration.
if (typeof window !== 'undefined') {
  throw new Error('lib/adminSession.js must only be used on the server.');
}

export const ACCESS_TOKEN_COOKIE = 'teracom_admin_session';
export const REFRESH_TOKEN_COOKIE = 'teracom_admin_refresh';

// Matches teracom-platform-backend's own ACCESS_TOKEN_EXPIRE_MINUTES/
// REFRESH_TOKEN_EXPIRE_DAYS defaults (config.py in that repo) -- a
// literal duplicate, not an import, since these are two entirely
// separate processes/repos with no shared config module.
const ACCESS_TOKEN_MAX_AGE_SECONDS = 15 * 60;
const REFRESH_TOKEN_MAX_AGE_SECONDS = 30 * 24 * 60 * 60;

function baseCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  };
}

export function setAdminSessionCookies(response, { accessToken, refreshToken }) {
  response.cookies.set(ACCESS_TOKEN_COOKIE, accessToken, {
    ...baseCookieOptions(),
    maxAge: ACCESS_TOKEN_MAX_AGE_SECONDS,
  });

  if (refreshToken) {
    response.cookies.set(REFRESH_TOKEN_COOKIE, refreshToken, {
      ...baseCookieOptions(),
      maxAge: REFRESH_TOKEN_MAX_AGE_SECONDS,
    });
  }

  return response;
}

export function clearAdminSessionCookies(response) {
  response.cookies.set(ACCESS_TOKEN_COOKIE, '', { ...baseCookieOptions(), maxAge: 0 });
  response.cookies.set(REFRESH_TOKEN_COOKIE, '', { ...baseCookieOptions(), maxAge: 0 });
  return response;
}
