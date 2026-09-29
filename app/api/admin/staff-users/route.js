import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { listStaffUsers, createStaffUser } from '@/lib/api/adminStaffUsers';

export const GET = withAdminSession(async ({ token }) => {
  return NextResponse.json(await listStaffUsers(token));
});

export const POST = withAdminSession(async ({ req, token }) => {
  const body = await req.json();
  // Only pass the specified fields
  const filteredBody = {
    email: body.email,
    first_name: body.first_name,
    last_name: body.last_name,
    staff_role: body.staff_role
  };
  return NextResponse.json(await createStaffUser(token, filteredBody));
});
