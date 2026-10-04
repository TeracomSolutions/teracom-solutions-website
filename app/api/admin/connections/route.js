import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { listConnections } from '@/lib/api/adminConnections';
import { websiteConnections } from '@/lib/websiteConnections';

export const GET = withAdminSession(async ({ token }) => {
  const backend = await listConnections(token);
  return NextResponse.json([...backend, ...websiteConnections()]);
});
