import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { fetchTaskRuns } from '@/lib/api/adminScout';

export const GET = withAdminSession(async ({ token, params }) => {
  return NextResponse.json(await fetchTaskRuns(token, params.taskId));
});
