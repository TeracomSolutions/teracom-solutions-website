import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { createSocialUpdate, listSocialUpdates } from '@/lib/api/adminSocial';

export const GET = withAdminSession(async ({ token }) => {
  return NextResponse.json(await listSocialUpdates(token));
});

export const POST = withAdminSession(async ({ req, token }) => {
  const body = await req.json();
  return NextResponse.json(await createSocialUpdate(token, body));
});
