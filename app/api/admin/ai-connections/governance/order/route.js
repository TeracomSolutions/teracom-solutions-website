import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { reorderGovernanceRules } from '@/lib/api/adminAiConnections';

export const PUT = withAdminSession(async ({ req, token }) => {
  const body = await req.json();
  return NextResponse.json(await reorderGovernanceRules(token, Array.isArray(body.ids) ? body.ids : []));
});
