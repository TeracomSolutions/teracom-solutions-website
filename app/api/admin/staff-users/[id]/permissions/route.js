import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { setStaffPermissions } from '@/lib/api/adminStaffUsers';

export const PUT = withAdminSession(async ({ req, token, params }) => {
  const body = await req.json().catch(() => ({}));
  const staffRole = typeof body.staff_role === 'string' ? body.staff_role : '';
  const permissions = body.permissions && typeof body.permissions === 'object' ? body.permissions : {};
  return NextResponse.json(await setStaffPermissions(token, params.id, { staff_role: staffRole, permissions }));
});
