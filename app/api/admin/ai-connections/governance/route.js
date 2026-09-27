import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { createGovernanceRule, fetchGovernanceRules } from '@/lib/api/adminAiConnections';

export const GET = withAdminSession(async ({ token }) => {
  return NextResponse.json(await fetchGovernanceRules(token));
});

export const POST = withAdminSession(async ({ req, token }) => {
  const body = await req.json();
  return NextResponse.json(await createGovernanceRule(token, body), { status: 201 });
});
