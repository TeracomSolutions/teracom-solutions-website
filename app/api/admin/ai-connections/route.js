import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { listAiConnections } from '@/lib/api/adminAiConnections';

export const GET = withAdminSession(async ({ token }) => {
  return NextResponse.json(await listAiConnections(token));
});
