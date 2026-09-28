import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import { withAdminSession } from '@/lib/adminApi';
import { IDLE_CHOICES, signOutReason } from '@/lib/adminIdle';
import { REFRESH_TOKEN_COOKIE, clearAdminSessionCookies, setAdminSessionCookies } from '@/lib/adminSession';
import { getStaffSession, refreshStaffSession, setStaffSession } from '@/lib/api/adminAuth';

// Automatic sign-out. GET: the signed-in person's setting. POST: "I am
// still here" from the browser timer, which refreshes the session so the
// server records the activity now. PUT {idle_minutes}: change the setting;
// it applies to this session straight away.
async function refreshInto(response) {
  const refresh = (await cookies()).get(REFRESH_TOKEN_COOKIE)?.value;
  if (!refresh) return clearAdminSessionCookies(NextResponse.json({ error: 'Your session has ended.', reason: 'expired' }, { status: 401 }));
  try {
    const data = await refreshStaffSession(refresh);
    return setAdminSessionCookies(response(data), {
      accessToken: data.access_token,
      accessMaxAge: data.access_expires_in,
      idleMinutes: data.idle_minutes,
    });
  } catch (err) {
    if (err.status === 401) {
      return clearAdminSessionCookies(NextResponse.json({ error: err.message, reason: signOutReason(err.message) }, { status: 401 }));
    }
    throw err;
  }
}

export const GET = withAdminSession(async ({ token }) => NextResponse.json(await getStaffSession(token)));

export const POST = withAdminSession(async () =>
  refreshInto((data) => NextResponse.json({ ok: true, idle_minutes: data.idle_minutes, touched_at: Date.now() })),
);

export const PUT = withAdminSession(async ({ req, token }) => {
  const body = await req.json().catch(() => ({}));
  const minutes = Number(body?.idle_minutes);
  if (!IDLE_CHOICES.includes(minutes)) {
    return NextResponse.json({ error: 'Choose one of the listed times.' }, { status: 400 });
  }
  const saved = await setStaffSession(token, minutes);
  return refreshInto(() => NextResponse.json({ ...saved, touched_at: Date.now() }));
});
