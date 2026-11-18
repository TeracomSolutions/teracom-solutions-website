import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { backendFetch } from '@/lib/api/client';

// System > Business profile (api/staff_business_profile.py in the backend).
export const GET = withAdminSession(async ({ token }) => {
  return NextResponse.json(await backendFetch('/staff/business-profile', { token }));
});

export const PUT = withAdminSession(async ({ req, token }) => {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return NextResponse.json({ error: 'Nothing to save.' }, { status: 400 });
  }
  return NextResponse.json(await backendFetch('/staff/business-profile', { method: 'PUT', token, body }));
});
