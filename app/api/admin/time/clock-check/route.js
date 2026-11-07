import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { runClockCheck } from '@/lib/api/adminTime';

// Asks the backend to compare the server clock with an internet time source.
export const POST = withAdminSession(async ({ token }) => {
  return NextResponse.json(await runClockCheck(token));
});
