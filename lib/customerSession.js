// Server-only. Teracom Solutions Website Customer, Phase 2 -- the customer session cookie this app sets after a successful customer login
// (app/api/customer/login/route.js) and reads everywhere else that needs to know "is someone logged in, and as whom" (the
// /account page, app/api/customer/*/route.js). httpOnly so the token is never readable from browser JavaScript (this is a real
// bearer credential, the same reasoning every other secret in this codebase gets kept server-side only) -- the deliberate alternative
// to localStorage.
if (typeof window !== 'undefined') {
  throw new Error('lib/customerSession.js must only be used on the server.');
}

export const CUSTOMER_ACCESS_TOKEN_COOKIE = 'teracom_customer_session';

// Matches teracom-website-backend's own ACCESS_TOKEN_EXPIRE_MINUTES default (15 minutes)
const ACCESS_TOKEN_MAX_AGE_SECONDS = 15 * 60;

function baseCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  };
}

export function setCustomerSessionCookies(response, accessToken) {
  response.cookies.set(CUSTOMER_ACCESS_TOKEN_COOKIE, accessToken, {
    ...baseCookieOptions(),
    maxAge: ACCESS_TOKEN_MAX_AGE_SECONDS,
  });

  return response;
}

export function clearCustomerSessionCookies(response) {
  response.cookies.set(CUSTOMER_ACCESS_TOKEN_COOKIE, '', { ...baseCookieOptions(), maxAge: 0 });
  return response;
}