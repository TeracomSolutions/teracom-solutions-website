import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { snapchatAuthorize } from '@/lib/api/adminSocial';

// Connect Snapchat: the backend checks the Client ID and secret are saved and returns the Snap sign-in address.
export const POST = withAdminSession(async ({ token }) => {
  return NextResponse.json(await snapchatAuthorize(token));
});
