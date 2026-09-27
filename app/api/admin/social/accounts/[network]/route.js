import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { updateSocialAccount } from '@/lib/api/adminSocial';

export const PUT = withAdminSession(async ({ req, token, params }) => {
  const body = await req.json();
  return NextResponse.json(await updateSocialAccount(token, params.network, body));
});
