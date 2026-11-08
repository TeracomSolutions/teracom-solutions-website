import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { fetchMemoryOverview } from '@/lib/api/adminMemory';

// The Memory overview for the console page.
export const GET = withAdminSession(async ({ token }) => {
  return NextResponse.json(await fetchMemoryOverview(token));
});