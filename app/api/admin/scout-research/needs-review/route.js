import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { fetchNeedsReview } from '@/lib/api/adminScout';

export const GET = withAdminSession(async ({ token }) => {
  return NextResponse.json(await fetchNeedsReview(token));
});
