import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { staffMfaDisable } from '@/lib/api/adminAuth';

export const POST = withAdminSession(async ({ req, token }) => {
  const { code } = await req.json().catch(() => ({}));
  if (typeof code !== 'string' || code.trim().length < 6 || code.length > 12) {
    return NextResponse.json({ error: 'Enter a current code or a backup code.' }, { status: 400 });
  }
  return NextResponse.json(await staffMfaDisable(token, code.trim()));
});
