import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { publishResourceSource } from '@/lib/api/adminResources';

// Publish to website: every collected document of this website goes on the
// Resources pages, and new finds follow automatically.
export const POST = withAdminSession(async ({ token, params }) => {
  return NextResponse.json(await publishResourceSource(token, params.sourceId));
});