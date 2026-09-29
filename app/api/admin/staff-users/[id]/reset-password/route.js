import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { resetStaffPassword } from '@/lib/api/adminStaffUsers';

export const POST = withAdminSession(async ({ token, params }) => {
  return NextResponse.json(await resetStaffPassword(token, params.id));
});
