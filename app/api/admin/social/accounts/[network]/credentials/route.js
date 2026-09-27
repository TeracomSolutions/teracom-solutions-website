import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { clearSocialCredentials } from '@/lib/api/adminSocial';

export const DELETE = withAdminSession(async ({ token, params }) => {
  return NextResponse.json(await clearSocialCredentials(token, params.network));
});
