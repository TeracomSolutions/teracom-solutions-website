import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { fetchResourceRuns } from '@/lib/api/adminResources';

export const GET = withAdminSession(async ({ token, params }) => {
  return NextResponse.json(await fetchResourceRuns(token, params.sourceId));
});
