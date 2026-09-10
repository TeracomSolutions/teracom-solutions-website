import { NextResponse } from 'next/server';
import { z } from 'zod';

import { staffLogin } from '@/lib/api/adminCatalog';
import { ApiError } from '@/lib/api/client';
import { setAdminSessionCookies } from '@/lib/adminSession';
import { checkRateLimit, clientIpFromRequest, rateLimitResponse } from '@/lib/rateLimit';

// Teracom Solutions Website Admin, Phase 1. Rate-limited at this
// layer too, same reasoning as ADMIN_IMPORT_RATE_LIMIT_* on the
// existing /api/admin/import-feed route (this repo's own copy of the
// "the real budget is small relative to real admin usage, tight
// relative to a brute-force attempt" comment there) -- on top of, not
// instead of, teracom-website-backend's own staff_login_rate_limiter,
// which independently rate-limits the same call by IP+email one
// process hop further in.
const ADMIN_LOGIN_RATE_LIMIT_MAX_ATTEMPTS = Number(process.env.ADMIN_LOGIN_RATE_LIMIT_MAX_ATTEMPTS) || 10;
const ADMIN_LOGIN_RATE_LIMIT_WINDOW_MS = (Number(process.env.ADMIN_LOGIN_RATE_LIMIT_WINDOW_SECONDS) || 900) * 1000;

const LoginRequest = z.object({
  email: z.string().min(1),
  password: z.string().min(1),
});

export async function POST(req) {
  const rateLimitKey = `admin-login:${clientIpFromRequest(req)}`;
  const rateLimit = checkRateLimit(rateLimitKey, {
    maxAttempts: ADMIN_LOGIN_RATE_LIMIT_MAX_ATTEMPTS,
    windowMs: ADMIN_LOGIN_RATE_LIMIT_WINDOW_MS,
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
    data = await staffLogin(parsed.data.email, parsed.data.password);
  } catch (err) {
    if (err instanceof ApiError) {
      return NextResponse.json({ error: err.message }, { status: err.status || 401 });
    }
    return NextResponse.json({ error: 'Unable to reach the login service.' }, { status: 502 });
  }

  // MFA-enabled staff accounts get a challenge token instead of a
  // real session here -- this admin UI has no MFA-verify step built
  // yet (Phase 1 scope), so surface this plainly rather than treating
  // a challenge token as if it were a real access token.
  if (data.mfa_required) {
    return NextResponse.json(
      { error: 'This staff account has MFA enabled. MFA login is not yet supported in this admin UI.' },
      { status: 501 }
    );
  }

  return setAdminSessionCookies(NextResponse.json({ ok: true }), {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
  });
}
