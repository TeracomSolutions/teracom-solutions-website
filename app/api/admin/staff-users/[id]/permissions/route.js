import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { setStaffPermissions } from '@/lib/api/adminStaffUsers';

export const PUT = withAdminSession(async ({ req, token, params }) => {
  const body = await req.json().catch(() => ({}));
  const staffRole = typeof body.staff_role === 'string' ? body.staff_role : '';
  const permissions = body.permissions && typeof body.permissions === 'object' ? body.permissions : {};
  const profileId = typeof body.permission_profile_id === 'string' && /^[0-9a-f-]{36}$/i.test(body.permission_profile_id) ? body.permission_profile_id : null;
  return NextResponse.json(await setStaffPermissions(token, params.id, { staff_role: staffRole, permissions, permission_profile_id: profileId }));
});
