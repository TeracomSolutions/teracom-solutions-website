import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { cancelCodeRequest } from '@/lib/api/adminCodeRequests';

const ID = /^[0-9a-f-]{36}$/i;

export const POST = withAdminSession(async ({ token, params }) => {
  if (!ID.test(params.id || '')) {
    return NextResponse.json({ error: 'Unknown request.' }, { status: 400 });
  }
  return NextResponse.json(await cancelCodeRequest(token, params.id));
});
