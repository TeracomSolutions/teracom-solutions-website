import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { staffMfaStatus } from '@/lib/api/adminAuth';

export const GET = withAdminSession(async ({ token }) => {
  return NextResponse.json(await staffMfaStatus(token));
});
