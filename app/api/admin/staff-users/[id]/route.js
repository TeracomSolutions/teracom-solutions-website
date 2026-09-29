import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { updateStaffUser, deleteStaffUser } from '@/lib/api/adminStaffUsers';

export const PATCH = withAdminSession(async ({ req, token, params }) => {
  const body = await req.json();
  // Only pass the specified fields that are present in the body
  const filteredBody = {};
  if (body.email !== undefined) filteredBody.email = body.email;
  if (body.first_name !== undefined) filteredBody.first_name = body.first_name;
  if (body.last_name !== undefined) filteredBody.last_name = body.last_name;
  if (body.staff_role !== undefined) filteredBody.staff_role = body.staff_role;
  if (body.active !== undefined) filteredBody.active = body.active;
  return NextResponse.json(await updateStaffUser(token, params.id, filteredBody));
});

export const DELETE = withAdminSession(async ({ token, params }) => {
  return NextResponse.json(await deleteStaffUser(token, params.id));
});
