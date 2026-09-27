import { NextResponse } from 'next/server';
import { z } from 'zod';

import { staffMfaVerify } from '@/lib/api/adminAuth';
import { setAdminSessionCookies } from '@/lib/adminSession';
import { checkRateLimit, clientIpFromRequest, rateLimitResponse } from '@/lib/rateLimit';

// Per-IP rate limit for MFA login attempts, same as the login route
const ADMIN_LOGIN_MFA_RATE_LIMIT_MAX_ATTEMPTS = Number(process.env.ADMIN_LOGIN_MFA_RATE_LIMIT_MAX_ATTEMPTS) || 10;
const ADMIN_LOGIN_MFA_RATE_LIMIT_WINDOW_MS = (Number(process.env.ADMIN_LOGIN_MFA_RATE_LIMIT_WINDOW_SECONDS) || 900) * 1000;

const MfaLoginRequest = z.object({
  challengeToken: z.string().min(1),
  code: z.string().min(6).max(12), // 6 to 12 characters (backup codes are longer)
});

export async function POST(req) {
  const rateLimitKey = `admin-login-mfa:${clientIpFromRequest(req)}`;
  const rateLimit = checkRateLimit(rateLimitKey, {
    maxAttempts: ADMIN_LOGIN_MFA_RATE_LIMIT_MAX_ATTEMPTS,
    windowMs: ADMIN_LOGIN_MFA_RATE_LIMIT_WINDOW_MS,
  });
  if (!rateLimit.allowed) {
    return rateLimitResponse(rateLimit.retryAfterSeconds, 'Too many MFA attempts. Please try again later.');
  }

  const parsed = MfaLoginRequest.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid MFA request' }, { status: 400 });
  }

  let data;
  try {
    data = await staffMfaVerify(parsed.data.challengeToken, parsed.data.code, clientIpFromRequest(req));
  } catch (err) {
    if (err.status === 401) {
      // This is a common case - wrong code
      return NextResponse.json({ error: 'Invalid code. Please try again.' }, { status: 401 });
    }
    // For other errors, pass through the backend status
    if (err.status) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    return NextResponse.json({ error: 'Unable to verify MFA code.' }, { status: 502 });
  }

  // Success - set session cookies and redirect
  return setAdminSessionCookies(NextResponse.json({ ok: true }), {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
  });
}