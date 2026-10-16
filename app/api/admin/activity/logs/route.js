import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { fetchJobLogs } from '@/lib/api/adminActivity';

// The background job log folders, with how many files each has and when one was last written.
export const GET = withAdminSession(async ({ token }) => {
  return NextResponse.json(await fetchJobLogs(token));
});
