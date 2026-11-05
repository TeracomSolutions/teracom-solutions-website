import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { fetchResourceRun } from '@/lib/api/adminResources';

// One check with its progress; the progress bar under Check polls this.
export const GET = withAdminSession(async ({ token, params }) => {
  return NextResponse.json(await fetchResourceRun(token, params.runId));
});