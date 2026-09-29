import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { REFRESH_TOKEN_COOKIE } from '@/lib/adminSession';
import { changeStaffPassword } from '@/lib/api/adminAuth';

export const POST = withAdminSession(async ({ req, token }) => {
  const body = await req.json().catch(() => ({}));
  const { current_password, new_password, code } = body;

  if (!current_password || typeof current_password !== 'string') {
    return NextResponse.json({ error: 'Enter your current password.' }, { status: 400 });
  }

  if (!new_password || typeof new_password !== 'string') {
    return NextResponse.json({ error: 'Enter a new password.' }, { status: 400 });
  }

  const refresh = (await cookies()).get(REFRESH_TOKEN_COOKIE)?.value || null;

  return NextResponse.json(await changeStaffPassword(token, {
    current_password,
    new_password,
    code: code?.trim() || null,
    keep_refresh_token: refresh
  }));
});