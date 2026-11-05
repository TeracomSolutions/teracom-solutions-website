import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { fetchGrowth } from '@/lib/api/adminGrowth';

// Every growth tool with its switch, settings and last report.
export const GET = withAdminSession(async ({ token }) => {
  return NextResponse.json(await fetchGrowth(token));
});
