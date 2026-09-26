import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { runScoutTask } from '@/lib/api/adminScout';

// Starts a research run; the backend launches it in the background and
// answers straight away with the new run.
export const POST = withAdminSession(async ({ token, params }) => {
  return NextResponse.json(await runScoutTask(token, params.taskId), { status: 201 });
});
