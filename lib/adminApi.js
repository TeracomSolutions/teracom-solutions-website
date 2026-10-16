// Server-only. The one place the admin's own /api/admin/* route handlers
// resolve the staff session and turn a backend failure into a JSON
// response -- the same shape app/api/admin/catalog/products/route.js
// spells out by hand.
if (typeof window !== 'undefined') {
  throw new Error('lib/adminApi.js must only be used on the server.');
}

import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { ApiError } from '@/lib/api/client';
import { ACCESS_TOKEN_COOKIE } from '@/lib/adminSession';
import { staffMe } from '@/lib/api/adminAuth';

export async function adminSessionToken() {
  return (await cookies()).get(ACCESS_TOKEN_COOKIE)?.value || null;
}

// A cookie being present proves nothing: anyone can set one by hand. This asks
// the backend whether the staff token is a live session. A route that does not
// pass the token on to the backend (it uses the shared service token instead)
// must call this, or be wrapped with withAdminSession(handler, { verify: true }).
export async function staffSessionIsValid(token) {
  if (!token) return false;
  try {
    await staffMe(token);
    return true;
  } catch {
    return false;
  }
}

export function apiErrorResponse(err, fallback = 'Unable to reach the admin service.') {
  if (err instanceof ApiError) {
    const body = { error: err.message };
    const detail = err.details?.body?.detail;
    if (detail && typeof detail === 'object' && !Array.isArray(detail)) {
      if (typeof detail.message === 'string') body.error = detail.message;
      if (detail.problems && typeof detail.problems === 'object') body.problems = detail.problems;
    } else if (Array.isArray(detail) && typeof detail[0]?.msg === 'string') {
      body.error = detail[0].msg.replace(/^Value error, /, '');
    }
    return NextResponse.json(body, { status: err.status || 502 });
  }
  return NextResponse.json({ error: fallback }, { status: 502 });
}

/**
 * Wraps a route handler so it runs with the staff token from the session
 * cookie, answers 401 without one, and maps an ApiError to its status.
 * The handler receives { req, token, params } with `params` already
 * awaited (Next 15 hands route handlers a Promise).
 * Pass { verify: true } for a route that does not send the staff token on to the backend: it then checks the session with the backend first.
 */
export function withAdminSession(handler, { fallback, verify = false } = {}) {
  return async function adminRoute(req, ctx) {
    const token = await adminSessionToken();
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    if (verify && !(await staffSessionIsValid(token))) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    let params = {};
    if (ctx && ctx.params) {
      params = await ctx.params;
    }

    try {
      return await handler({ req, token, params });
    } catch (err) {
      return apiErrorResponse(err, fallback);
    }
  };
}
