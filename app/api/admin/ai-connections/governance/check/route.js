import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { testGovernanceFilter } from '@/lib/api/adminAiConnections';

export const POST = withAdminSession(async ({ req, token }) => {
  const body = await req.json();
  return NextResponse.json(await testGovernanceFilter(token, { text: String(body.text || '').slice(0, 20000), provider: body.provider || null }));
});
