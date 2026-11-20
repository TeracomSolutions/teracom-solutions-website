// Server-only helpers shared by the Estimator's API routes (app/api/tools/estimator/*).
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { ApiError } from './api/client.js';
import { getCurrentCustomer } from './api/customerAuth.js';
import { CUSTOMER_ACCESS_TOKEN_COOKIE } from './customerSession.js';

export const SIGN_IN_AGAIN = 'Your sign-in has timed out. Sign in again: your work is kept in this browser.';

export function sameOrigin(req) {
  const origin = req.headers.get('origin');
  if (!origin) return true;
  try {
    return new URL(origin).host === req.headers.get('host');
  } catch {
    return false;
  }
}

/** { token, customer, pricing } for the signed-in customer, or { error } as a response. */
export async function signedInCustomer() {
  const token = (await cookies()).get(CUSTOMER_ACCESS_TOKEN_COOKIE)?.value;
  if (!token) return { error: NextResponse.json({ error: SIGN_IN_AGAIN, signIn: true }, { status: 401 }) };
  try {
    const customer = await getCurrentCustomer(token);
    return { token, customer, pricing: { id: customer.id, tier: customer.pricing_tier || null } };
  } catch {
    return { error: NextResponse.json({ error: SIGN_IN_AGAIN, signIn: true }, { status: 401 }) };
  }
}

export function backendError(err, fallback) {
  if (err instanceof ApiError) {
    if (err.status === 401) return NextResponse.json({ error: SIGN_IN_AGAIN, signIn: true }, { status: 401 });
    const detail = typeof err.body?.detail === 'string' ? err.body.detail : fallback;
    return NextResponse.json({ error: detail }, { status: err.status === 404 ? 404 : 400 });
  }
  return NextResponse.json({ error: fallback }, { status: 502 });
}

export const noStore = { 'Cache-Control': 'private, no-store' };
