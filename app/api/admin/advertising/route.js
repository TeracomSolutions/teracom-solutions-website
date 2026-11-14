import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { fetchAdvertising } from '@/lib/api/adminAdvertising';

// The Advertising page: rules, platforms, campaigns and this month's spend.
export const GET = withAdminSession(async ({ token }) => {
  return NextResponse.json(await fetchAdvertising(token));
});
