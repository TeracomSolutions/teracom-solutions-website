import { NextResponse } from 'next/server';

import {
  ACCESS_TOKEN_COOKIE,
  IDLE_COOKIE,
  REFRESH_TOKEN_COOKIE,
  cookieOptions,
  decodeJwtPayload,
  needsRefresh,
  replaceCookie,
  signOutReason,
} from './lib/adminIdle.js';
import { TIMEOUT_MS, createRedirectCache, isConsolePath, lookup } from './lib/seoRedirects.js';

// Keeps a staff console session alive while it is being used. On any
// console page or console API call, and on Ask Tera's calls (Tera answers
// anyone signed in to the console), when the access token is more than a
// minute old (or about to expire), it is refreshed with the refresh token:
// that records activity on the backend, which refuses the refresh once the
// staff member has been inactive for their chosen time. Then the person is
// sent to the sign-in page (pages) or given a 401 (API calls).
// A backend that cannot be reached never signs anyone out.
//
// Every other page: an old address that Google still shows (the old Zoho
// shop's) is sent to the page that replaced it with a permanent redirect.
// The list comes from the backend (Search on the console) and is kept for
// five minutes; when the backend cannot be reached the last list is used.
export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
    '/api/tera/:path*',
    '/((?!_next/|api/|assets/|store-images/|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
};

const SKIP = [/^\/admin\/login(\/|$)/, /^\/api\/admin\/login(\/|$)/, /^\/api\/admin\/logout(\/|$)/];
const REFRESH_TIMEOUT_MS = 5000;

function backendBase() {
  return (process.env.BACKEND_API_URL || 'http://localhost:8002').replace(/\/+$/, '');
}

async function loadRedirects() {
  const token = process.env.WEBSITE_FRONTEND_SERVICE_TOKEN || '';
  if (!token) return [];
  const answer = await fetch(`${backendBase()}/internal/seo/redirects`, {
    headers: { 'X-Internal-Service-Token': token, Accept: 'application/json' },
    signal: AbortSignal.timeout(TIMEOUT_MS),
    cache: 'no-store',
  });
  if (!answer.ok) throw new Error(`redirects ${answer.status}`);
  return (await answer.json()).redirects;
}

const redirects = createRedirectCache({ load: loadRedirects });

function clearCookies(response, options) {
  response.cookies.set(ACCESS_TOKEN_COOKIE, '', { ...options, maxAge: 0 });
  response.cookies.set(REFRESH_TOKEN_COOKIE, '', { ...options, maxAge: 0 });
  response.cookies.set(IDLE_COOKIE, '', { ...options, httpOnly: false, maxAge: 0 });
  return response;
}

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  if (!isConsolePath(pathname)) {
    const target = lookup(await redirects(), pathname);
    return target ? NextResponse.redirect(new URL(target, req.url), 308) : NextResponse.next();
  }
  if (SKIP.some((re) => re.test(pathname))) return NextResponse.next();

  const refresh = req.cookies.get(REFRESH_TOKEN_COOKIE)?.value;
  if (!refresh) return NextResponse.next();

  const access = req.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  if (!needsRefresh(decodeJwtPayload(access), Math.floor(Date.now() / 1000))) return NextResponse.next();

  let answer;
  try {
    answer = await fetch(`${backendBase()}/staff/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ refresh_token: refresh }),
      signal: AbortSignal.timeout(REFRESH_TIMEOUT_MS),
      cache: 'no-store',
    });
  } catch {
    return NextResponse.next();
  }

  const options = cookieOptions(process.env.NODE_ENV === 'production');

  if (answer.status === 401) {
    const data = await answer.json().catch(() => ({}));
    const reason = signOutReason(data.detail);
    // Ask Tera also serves website customers: an ended console session is
    // dropped and the request carries on without it.
    if (pathname.startsWith('/api/tera/')) {
      const headers = new Headers(req.headers);
      headers.set('cookie', replaceCookie(req.headers.get('cookie'), ACCESS_TOKEN_COOKIE, ''));
      return clearCookies(NextResponse.next({ request: { headers } }), options);
    }
    if (pathname.startsWith('/api/')) {
      return clearCookies(NextResponse.json({ error: data.detail || 'Your session has ended. Please sign in again.', reason }, { status: 401 }), options);
    }
    return clearCookies(NextResponse.redirect(new URL(`/admin/login?reason=${reason}`, req.url)), options);
  }
  if (!answer.ok) return NextResponse.next();

  const data = await answer.json().catch(() => null);
  if (!data?.access_token) return NextResponse.next();

  // The new token for this same request (pages and route handlers read the
  // Cookie header), and for the browser.
  const headers = new Headers(req.headers);
  headers.set('cookie', replaceCookie(req.headers.get('cookie'), ACCESS_TOKEN_COOKIE, data.access_token));
  const response = NextResponse.next({ request: { headers } });
  response.cookies.set(ACCESS_TOKEN_COOKIE, data.access_token, { ...options, maxAge: Number(data.access_expires_in) || 900 });
  if (data.idle_minutes) {
    response.cookies.set(IDLE_COOKIE, String(data.idle_minutes), { ...options, httpOnly: false, maxAge: 30 * 24 * 60 * 60 });
  }
  return response;
}
