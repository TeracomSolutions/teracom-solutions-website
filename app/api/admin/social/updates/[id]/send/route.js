import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { sendSocialUpdate } from '@/lib/api/adminSocial';

export const POST = withAdminSession(async ({ token, params }) => {
  return NextResponse.json(await sendSocialUpdate(token, params.id));
});
