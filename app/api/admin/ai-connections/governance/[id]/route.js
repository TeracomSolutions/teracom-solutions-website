import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { deleteGovernanceRule, updateGovernanceRule } from '@/lib/api/adminAiConnections';

export const PUT = withAdminSession(async ({ req, token, params }) => {
  const body = await req.json();
  return NextResponse.json(await updateGovernanceRule(token, params.id, body));
});

export const DELETE = withAdminSession(async ({ token, params }) => {
  return NextResponse.json(await deleteGovernanceRule(token, params.id));
});
