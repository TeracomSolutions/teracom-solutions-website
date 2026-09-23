import { NextResponse } from 'next/server';
import { z } from 'zod';

import { requestPasswordReset } from '@/lib/api/customerAuth';
import { ApiError } from '@/lib/api/client';
import { checkRateLimit, clientIpFromRequest, rateLimitResponse } from '@/lib/rateLimit';
import { TURNSTILE_FAILED_MESSAGE, verifyTurnstile } from '@/lib/turnstile';

// Customers migrated from the old store have no password until they set one
// here, so this endpoint is the front door for 695 accounts as well as the
// ordinary forgot-password path.

const RESET_RATE_LIMIT_MAX_ATTEMPTS = Number(process.env.CUSTOMER_RESET_RATE_LIMIT_MAX_ATTEMPTS) || 5;
const RESET_RATE_LIMIT_WINDOW_SECONDS =
  (Number(process.env.CUSTOMER_RESET_RATE_LIMIT_WINDOW_SECONDS) || 900) * 1000;

const ResetRequest = z.object({
  email: z.string().min(1),
  turnstileToken: z.string().optional(),
});

// One reply for every outcome -- address known, unknown, rate limited upstream,
// mail server down. Anything that varies with whether the account exists turns
// this into a way to test an address list against our customer list.
const NEUTRAL = {
  message:
    'If that email address has an account with us, we have sent a link to set a password. The link is good for 24 hours.',
};

export async function POST(req) {
  const ip = clientIpFromRequest(req);

  const rateLimit = checkRateLimit(`customer-reset:${ip}`, {
    maxAttempts: RESET_RATE_LIMIT_MAX_ATTEMPTS,
    windowMs: RESET_RATE_LIMIT_WINDOW_SECONDS,
  });
  if (!rateLimit.allowed) {
    return rateLimitResponse(rateLimit.retryAfterSeconds, 'Too many requests. Please try again later.');
  }

  const parsed = ResetRequest.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: 'Please enter an email address.' }, { status: 400 });
  }

  const human = await verifyTurnstile(parsed.data.turnstileToken, ip);
  if (!human.ok) {
    return NextResponse.json({ error: TURNSTILE_FAILED_MESSAGE }, { status: 400 });
  }

  try {
    await requestPasswordReset(parsed.data.email);
  } catch (err) {
    // Deliberately swallowed. A backend outage must not produce a different
    // answer from "no such account" -- and the customer is told the same
    // thing either way, so there is nothing useful to report differently.
    if (!(err instanceof ApiError)) {
      console.error('Password reset request failed', err);
    } else {
      console.warn('Password reset request failed upstream', err.status);
    }
  }

  return NextResponse.json(NEUTRAL);
}
