import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { deleteSocialUpdate, getSocialUpdate } from '@/lib/api/adminSocial';

export const GET = withAdminSession(async ({ token, params }) => {
  return NextResponse.json(await getSocialUpdate(token, params.id));
});

export const DELETE = withAdminSession(async ({ token, params }) => {
  return NextResponse.json(await deleteSocialUpdate(token, params.id));
});
