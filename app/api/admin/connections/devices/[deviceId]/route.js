import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { removeDevice } from '@/lib/api/adminConnections';

export const DELETE = withAdminSession(async ({ token, params }) => {
  return NextResponse.json(await removeDevice(token, params.deviceId));
});
