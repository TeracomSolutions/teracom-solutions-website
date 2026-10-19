import { NextResponse } from 'next/server';
import { withAdminSession } from '@/lib/adminApi';
import { cleanupTestRecords } from '@/lib/api/adminTestTools';

/**
 * Deletes the TEST records in the Zoho test organisation; the backend refuses outside test mode.
 */
export const POST = withAdminSession(async ({ req, token }) => {
  const body = await req.json().catch(() => null);
  const local = Boolean(body && body.local === true);

  return NextResponse.json(await cleanupTestRecords(token, local));
});