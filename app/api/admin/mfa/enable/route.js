import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { staffMfaEnable } from '@/lib/api/adminAuth';

export const POST = withAdminSession(async ({ req, token }) => {
  const { code } = await req.json().catch(() => ({}));
  if (typeof code !== 'string' || code.trim().length < 6 || code.length > 12) {
    return NextResponse.json({ error: 'Enter the six-digit code.' }, { status: 400 });
  }
  return NextResponse.json(await staffMfaEnable(token, code.trim()));
});
