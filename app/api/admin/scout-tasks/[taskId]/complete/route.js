import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { completeScoutTask } from '@/lib/api/adminScout';

export const POST = withAdminSession(async ({ token, params }) => {
  return NextResponse.json(await completeScoutTask(token, params.taskId));
});
