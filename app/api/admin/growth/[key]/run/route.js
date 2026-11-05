import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { runGrowthTool } from '@/lib/api/adminGrowth';

// Runs a growth tool now, in the background on the backend.
export const POST = withAdminSession(async ({ token, params }) => {
  return NextResponse.json(await runGrowthTool(token, params.key));
});
