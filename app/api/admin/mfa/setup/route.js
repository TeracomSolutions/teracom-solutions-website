import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { staffMfaSetup } from '@/lib/api/adminAuth';

export const POST = withAdminSession(async ({ token }) => {
  return NextResponse.json(await staffMfaSetup(token));
});
