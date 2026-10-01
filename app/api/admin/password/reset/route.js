import { NextResponse } from 'next/server';
import { z } from 'zod';

import { chooseStaffPassword } from '@/lib/api/adminPasswordReset';
import { ApiError } from '@/lib/api/client';
import { checkRateLimit, clientIpFromRequest, rateLimitResponse } from '@/lib/rateLimit';

// Public: the emailed link is the proof. The backend checks the link and
// the password rules and says what is wrong in plain words.
const ResetRequest = z.object({
  token: z.string().trim().min(10).max(200),
  new_password: z.string().min(1).max(200),
});

export async function POST(req) {
  const ip = clientIpFromRequest(req);
  const limit = checkRateLimit(`staff-reset:${ip}`, { maxAttempts: 10, windowMs: 15 * 60 * 1000 });
  if (!limit.allowed) {
    return rateLimitResponse(limit.retryAfterSeconds, 'Too many attempts. Please try again shortly.');
  }

  const parsed = ResetRequest.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'That link is not complete. Open it again from the email.' }, { status: 400 });
  }

  try {
    const data = await chooseStaffPassword(parsed.data.token, parsed.data.new_password, ip);
    return NextResponse.json({ message: data?.detail || 'Your password has been changed. Sign in with it now.' });
  } catch (error) {
    if (error instanceof ApiError && (error.status === 400 || error.status === 422 || error.status === 429)) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error('Staff password reset failed', error);
    return NextResponse.json({ error: 'We could not change the password just now. Please try again shortly.' }, { status: 502 });
  }
}