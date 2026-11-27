import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { fetchAccountingPlatform, saveAccountingPlatform } from '@/lib/api/adminConnections';

export const GET = withAdminSession(async ({ token }) => NextResponse.json(await fetchAccountingPlatform(token)));

export const PUT = withAdminSession(async ({ req, token }) => {
  const body = (await req.json().catch(() => null)) || {};
  const platform = typeof body.platform === 'string' ? body.platform.slice(0, 20) : '';
  return NextResponse.json(await saveAccountingPlatform(token, platform));
});
