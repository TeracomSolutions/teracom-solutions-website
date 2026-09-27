import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { checkSocialAccount } from '@/lib/api/adminSocial';

export const POST = withAdminSession(async ({ token, params }) => {
  return NextResponse.json(await checkSocialAccount(token, params.network));
});
