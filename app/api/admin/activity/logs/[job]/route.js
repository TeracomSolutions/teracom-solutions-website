import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { fetchJobLog } from '@/lib/api/adminActivity';

// The end of one background job's newest log. ?lines= (1 to 400).
export const GET = withAdminSession(async ({ req, token, params }) => {
  const asked = Number.parseInt(new URL(req.url).searchParams.get('lines') || '200', 10);
  const lines = Math.min(400, Math.max(1, Number.isNaN(asked) ? 200 : asked));
  return NextResponse.json(await fetchJobLog(token, params.job, lines));
});
