import { NextResponse } from 'next/server';
import { z } from 'zod';

import { requestStaffPasswordLink } from '@/lib/api/adminPasswordReset';
import { ApiError } from '@/lib/api/client';
import { checkRateLimit, clientIpFromRequest, rateLimitResponse } from '@/lib/rateLimit';

// Public: the person asking has forgotten their password, so there is no
// session. The answer is the same whether or not the address is a staff
// account; the backend decides whether a link is sent.
const NEUTRAL =
  'If that address belongs to a staff account, we have emailed a link to choose a new password. The link works once and expires in one hour.';

const ForgotRequest = z.object({ email: z.string().trim().email().max(255) });

export async function POST(req) {
  const ip = clientIpFromRequest(req);
  const limit = checkRateLimit(`staff-forgot:${ip}`, { maxAttempts: 5, windowMs: 15 * 60 * 1000 });
  if (!limit.allowed) {
    return rateLimitResponse(limit.retryAfterSeconds, 'Too many requests. Please try again shortly.');
  }

  const parsed = ForgotRequest.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Enter your email address.' }, { status: 400 });
  }

  try {
    const data = await requestStaffPasswordLink(parsed.data.email, ip);
    return NextResponse.json({ message: data?.detail || NEUTRAL });
  } catch (error) {
    if (error instanceof ApiError && error.status === 429) {
      return NextResponse.json({ error: error.message }, { status: 429 });
    }
    console.error('Staff password link request failed', error);
    return NextResponse.json({ error: 'We could not send the link just now. Please try again shortly.' }, { status: 502 });
  }
}