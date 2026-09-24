import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { z } from 'zod';

import { validateCoupon } from '@/lib/api/coupons';
import { ApiError } from '@/lib/api/client';
import { getCurrentCustomer } from '@/lib/api/customerAuth';
import { CUSTOMER_ACCESS_TOKEN_COOKIE } from '@/lib/customerSession';
import { resolveLines, subtotalCents } from '@/lib/cartPricing';
import { checkRateLimit, clientIpFromRequest, rateLimitResponse } from '@/lib/rateLimit';

// Tells the cart what a code is worth, so the customer sees the discount
// before committing. The checkout route asks again and recomputes from
// scratch -- this answer is a preview, never the authority.

const COUPON_RATE_LIMIT_MAX_ATTEMPTS = Number(process.env.COUPON_RATE_LIMIT_MAX_ATTEMPTS) || 20;
const COUPON_RATE_LIMIT_WINDOW_MS = (Number(process.env.COUPON_RATE_LIMIT_WINDOW_SECONDS) || 600) * 1000;

const CouponRequest = z.object({
  code: z.string().min(1).max(40),
  items: z
    .array(z.object({ productId: z.string(), quantity: z.number().int().positive().max(20) }))
    .min(1)
    .max(20),
});

export async function POST(req) {
  const ip = clientIpFromRequest(req);
  const rateLimit = checkRateLimit(`coupon:${ip}`, {
    maxAttempts: COUPON_RATE_LIMIT_MAX_ATTEMPTS,
    windowMs: COUPON_RATE_LIMIT_WINDOW_MS,
  });
  if (!rateLimit.allowed) {
    return rateLimitResponse(rateLimit.retryAfterSeconds, 'Too many attempts. Please try again shortly.');
  }

  const parsed = CouponRequest.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ valid: false, reason: 'Please enter a code.' }, { status: 400 });
  }

  // The subtotal is computed here from the catalogue, never taken from the
  // browser -- otherwise a customer could claim a $50,000 cart to clear the
  // minimum spend on a code.
  const { lines } = resolveLines(parsed.data.items);
  if (lines.length === 0) {
    return NextResponse.json({ valid: false, reason: 'Your cart is empty.' }, { status: 400 });
  }
  const subtotal = subtotalCents(lines);

  // Who is asking, for codes issued to one customer or one trade tier.
  let customerId = null;
  const token = (await cookies()).get(CUSTOMER_ACCESS_TOKEN_COOKIE)?.value;
  if (token) {
    try {
      const customer = await getCurrentCustomer(token);
      customerId = customer?.id || null;
    } catch {
      // An expired session is not a coupon error. Carry on as a guest: a
      // code that needs an account will say so.
    }
  }

  try {
    const result = await validateCoupon({ code: parsed.data.code, subtotalCents: subtotal, customerId, clientIp: ip });
    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof ApiError && err.status === 429) {
      return NextResponse.json(
        { valid: false, reason: 'Too many attempts. Please try again shortly.' },
        { status: 429 }
      );
    }
    console.error('Coupon validation failed', err instanceof ApiError ? err.status : err);
    // Never imply the code was bad when it was our service that failed --
    // a customer who is told "invalid" stops trying and goes elsewhere.
    return NextResponse.json(
      { valid: false, reason: 'We could not check that code just now. Please try again in a moment.' },
      { status: 502 }
    );
  }
}
