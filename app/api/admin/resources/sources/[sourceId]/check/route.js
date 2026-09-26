import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { checkResourceSource } from '@/lib/api/adminResources';

// Starts a check now; it runs in the background on the backend.
export const POST = withAdminSession(async ({ token, params }) => {
  return NextResponse.json(await checkResourceSource(token, params.sourceId), { status: 201 });
});
