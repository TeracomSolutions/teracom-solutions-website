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

export async function adminSessionToken() {
  return (await cookies()).get(ACCESS_TOKEN_COOKIE)?.value || null;
}

export function apiErrorResponse(err, fallback = 'Unable to reach the admin service.') {
  if (err instanceof ApiError) {
    return NextResponse.json({ error: err.message }, { status: err.status || 502 });
  }
  return NextResponse.json({ error: fallback }, { status: 502 });
}

/**
 * Wraps a route handler so it runs with the staff token from the session
 * cookie, answers 401 without one, and maps an ApiError to its status.
 * The handler receives { req, token, params } with `params` already
 * awaited (Next 15 hands route handlers a Promise).
 */
export function withAdminSession(handler, { fallback } = {}) {
  return async function adminRoute(req, ctx) {
    const token = await adminSessionToken();
    if (!token) {
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
