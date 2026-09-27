import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { cancelSocialUpdate } from '@/lib/api/adminSocial';

export const POST = withAdminSession(async ({ token, params }) => {
  return NextResponse.json(await cancelSocialUpdate(token, params.id));
});
