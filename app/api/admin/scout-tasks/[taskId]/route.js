import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { deleteScoutTask } from '@/lib/api/adminScout';

export const DELETE = withAdminSession(async ({ token, params }) => {
  return NextResponse.json(await deleteScoutTask(token, params.taskId));
});
