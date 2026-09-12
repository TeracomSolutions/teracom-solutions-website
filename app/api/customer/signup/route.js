import { NextResponse } from 'next/server';
import { z } from 'zod';

import { customerSignup } from '@/lib/api/customerAuth';
import { ApiError } from '@/lib/api/client';
import { setCustomerSessionCookies } from '@/lib/customerSession';
import { checkRateLimit, clientIpFromRequest, rateLimitResponse } from '@/lib/rateLimit';

// Teracom Solutions Website Customer Authentication, Phase 2.
const CUSTOMER_SIGNUP_RATE_LIMIT_MAX_ATTEMPTS = Number(process.env.CUSTOMER_SIGNUP_RATE_LIMIT_MAX_ATTEMPTS) || 5;
const CUSTOMER_SIGNUP_RATE_LIMIT_WINDOW_SECONDS = (Number(process.env.CUSTOMER_SIGNUP_RATE_LIMIT_WINDOW_SECONDS) || 3600) * 1000;

const SignupRequest = z.object({
  email: z.string().min(1),
  password: z.string().min(8),
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  shipping_address_line1: z.string().min(1),
  shipping_address_line2: z.string().optional(),
  shipping_city: z.string().min(1),
  shipping_state: z.string().min(1),
  shipping_postcode: z.string().min(1),
  captcha_token: z.string().min(1),
  captcha_answer: z.string().min(1),
});

export async function POST(req) {
  const rateLimitKey = `customer-signup:${clientIpFromRequest(req)}`;
  const rateLimit = checkRateLimit(rateLimitKey, {
    maxAttempts: CUSTOMER_SIGNUP_RATE_LIMIT_MAX_ATTEMPTS,
    windowMs: CUSTOMER_SIGNUP_RATE_LIMIT_WINDOW_SECONDS,
  });
  if (!rateLimit.allowed) {
    return rateLimitResponse(rateLimit.retryAfterSeconds, 'Too many signup attempts. Please try again later.');
  }

  const parsed = SignupRequest.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid signup request' }, { status: 400 });
  }

  let data;
  try {
    data = await customerSignup(parsed.data);
  } catch (err) {
    if (err instanceof ApiError) {
      if (err.status === 409) {
        return NextResponse.json({ error: err.message }, { status: 409 });
      }
      return NextResponse.json({ error: err.message }, { status: err.status || 400 });
    }
    return NextResponse.json({ error: 'Unable to reach the signup service.' }, { status: 502 });
  }

  return setCustomerSessionCookies(NextResponse.json({ ok: true, customer: data.customer }), data.access_token);
}