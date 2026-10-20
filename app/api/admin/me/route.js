import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { staffMe } from '@/lib/api/adminAuth';

export const GET = withAdminSession(async ({ token }) => {
  const me = await staffMe(token);
  return NextResponse.json({ staff_role: me.staff_role || '', permissions: me.permissions || null });
});
