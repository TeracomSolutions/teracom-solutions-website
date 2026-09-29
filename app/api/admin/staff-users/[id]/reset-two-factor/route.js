import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { resetStaffTwoFactor } from '@/lib/api/adminStaffUsers';

export const POST = withAdminSession(async ({ token, params }) => {
  return NextResponse.json(await resetStaffTwoFactor(token, params.id));
});
