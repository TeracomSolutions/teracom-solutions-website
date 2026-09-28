import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE, clearAdminSessionCookies } from '@/lib/adminSession';
import { revokeStaffSession } from '@/lib/api/adminAuth';

// Sign out: the refresh token is revoked on the server (so the session
// cannot be revived from a copied cookie), then the cookies are cleared.
// The revoke is best effort: the cookies go whatever the backend says.
export async function POST() {
  const jar = await cookies();
  const access = jar.get(ACCESS_TOKEN_COOKIE)?.value;
  const refresh = jar.get(REFRESH_TOKEN_COOKIE)?.value;
  if (access && refresh) {
    try {
      await revokeStaffSession(access, refresh);
    } catch {
      // already expired or the backend is unreachable: nothing more to revoke here
    }
  }
  return clearAdminSessionCookies(NextResponse.json({ ok: true }));
}
