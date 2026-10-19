import { NextResponse } from 'next/server';
import { withAdminSession } from '@/lib/adminApi';
import { simulateOrder } from '@/lib/api/adminTestTools';

/**
 * Makes a test order; refused by the backend in live mode.
 */
export const POST = withAdminSession(async ({ req, token }) => {
  const body = await req.json().catch(() => null);

  if (!body?.scenario || !/^[a-z0-9_]{1,40}$/i.test(body.scenario)) {
    return NextResponse.json({ error: 'Choose a scenario.' }, { status: 400 });
  }

  return NextResponse.json(await simulateOrder(token, body.scenario));
});