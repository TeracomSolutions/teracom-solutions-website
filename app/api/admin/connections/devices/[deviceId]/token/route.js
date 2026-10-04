import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { replaceDeviceToken } from '@/lib/api/adminConnections';

// A new check-in address; the old one stops working straight away.
export const POST = withAdminSession(async ({ token, params }) => {
  return NextResponse.json(await replaceDeviceToken(token, params.deviceId));
});