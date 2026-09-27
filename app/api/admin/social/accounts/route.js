import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { listSocialAccounts } from '@/lib/api/adminSocial';

export const GET = withAdminSession(async ({ token }) => {
  return NextResponse.json(await listSocialAccounts(token));
});
