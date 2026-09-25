// Server-only helpers for the /admin pages themselves (the route handlers
// have lib/adminApi.js). A page needs the staff token from the session
// cookie and sends the visitor to sign in when there is none, or when the
// backend says the token is no longer good.
if (typeof window !== 'undefined') {
  throw new Error('lib/adminPage.js must only be used on the server.');
}

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { ApiError } from '@/lib/api/client';
import { ACCESS_TOKEN_COOKIE } from '@/lib/adminSession';

export async function requireAdminToken() {
  const token = (await cookies()).get(ACCESS_TOKEN_COOKIE)?.value;
  if (!token) {
    redirect('/admin/login');
  }
  return token;
}

// A 401 or 403 from the backend means the session, not the request, is
// the problem: the token expired (15 minutes) or was signed out.
export function isSessionError(err) {
  return err instanceof ApiError && (err.status === 401 || err.status === 403);
}
