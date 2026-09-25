import { NextResponse } from 'next/server';
import { z } from 'zod';

import { resetPassword } from '@/lib/api/customerAuth';
import { ApiError } from '@/lib/api/client';
import { checkRateLimit, clientIpFromRequest, rateLimitResponse } from '@/lib/rateLimit';

const CONFIRM_RATE_LIMIT_MAX_ATTEMPTS = Number(process.env.CUSTOMER_RESET_CONFIRM_MAX_ATTEMPTS) || 10;
const CONFIRM_RATE_LIMIT_WINDOW_SECONDS =
  (Number(process.env.CUSTOMER_RESET_CONFIRM_WINDOW_SECONDS) || 900) * 1000;

const ConfirmRequest = z.object({
  token: z.string().min(1),
  password: z.string().min(8, 'Password must be at least 8 characters long.'),
});

export async function POST(req) {
  // Rate limited as well as token-guarded: the token is 32 random bytes so
  // guessing is not the threat, but an unbounded endpoint that does a bcrypt
  // hash on every call is its own problem.
  const rateLimit = checkRateLimit(`customer-reset-confirm:${clientIpFromRequest(req)}`, {
    maxAttempts: CONFIRM_RATE_LIMIT_MAX_ATTEMPTS,
    windowMs: CONFIRM_RATE_LIMIT_WINDOW_SECONDS,
  });
  if (!rateLimit.allowed) {
    return rateLimitResponse(rateLimit.retryAfterSeconds, 'Too many attempts. Please try again later.');
  }

  const parsed = ConfirmRequest.safeParse(await req.json());
  if (!parsed.success) {
    const issue = parsed.error.issues.find((i) => i.path[0] === 'password');
    return NextResponse.json(
      { error: issue ? issue.message : 'That link is no longer valid. Please request a new one.' },
      { status: 400 }
    );
  }

  try {
    await resetPassword(parsed.data.token, parsed.data.password);
  } catch (err) {
    if (err instanceof ApiError) {
      // The backend already returns one message for every bad-token case
      // (expired, used, superseded, never existed) so that none of them can be
      // told apart. Pass it through rather than inventing a more specific one.
      return NextResponse.json(
        { error: err.details?.detail || 'That link is no longer valid. Please request a new one.' },
        { status: err.status === 422 ? 400 : err.status || 400 }
      );
    }
    return NextResponse.json({ error: 'Unable to reach the account service.' }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
