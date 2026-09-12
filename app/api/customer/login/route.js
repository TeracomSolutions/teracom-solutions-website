import { NextResponse } from 'next/server';
import { z } from 'zod';

import { customerLogin } from '@/lib/api/customerAuth';
import { ApiError } from '@/lib/api/client';
import { setCustomerSessionCookies } from '@/lib/customerSession';
import { checkRateLimit, clientIpFromRequest, rateLimitResponse } from '@/lib/rateLimit';

// Teracom Solutions Website Customer Authentication, Phase 2.
const CUSTOMER_LOGIN_RATE_LIMIT_MAX_ATTEMPTS = Number(process.env.CUSTOMER_LOGIN_RATE_LIMIT_MAX_ATTEMPTS) || 10;
const CUSTOMER_LOGIN_RATE_LIMIT_WINDOW_SECONDS = (Number(process.env.CUSTOMER_LOGIN_RATE_LIMIT_WINDOW_SECONDS) || 900) * 1000;

const LoginRequest = z.object({
  email: z.string().min(1),
  password: z.string().min(1), // Not min(8) - existing accounts might predate future rule changes
});

export async function POST(req) {
  const rateLimitKey = `customer-login:${clientIpFromRequest(req)}`;
  const rateLimit = checkRateLimit(rateLimitKey, {
    maxAttempts: CUSTOMER_LOGIN_RATE_LIMIT_MAX_ATTEMPTS,
    windowMs: CUSTOMER_LOGIN_RATE_LIMIT_WINDOW_SECONDS,
  });
  if (!rateLimit.allowed) {
    return rateLimitResponse(rateLimit.retryAfterSeconds, 'Too many login attempts. Please try again later.');
  }

  const parsed = LoginRequest.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid login request' }, { status: 400 });
  }

  let data;
  try {
    data = await customerLogin(parsed.data.email, parsed.data.password);
  } catch (err) {
    if (err instanceof ApiError) {
      if (err.status === 401) {
        return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
      }
      return NextResponse.json({ error: err.message }, { status: err.status || 400 });
    }
    return NextResponse.json({ error: 'Unable to reach the login service.' }, { status: 502 });
  }

  return setCustomerSessionCookies(NextResponse.json({ ok: true }), data.access_token);
}