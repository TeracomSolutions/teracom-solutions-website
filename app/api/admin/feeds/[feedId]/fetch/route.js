import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { fetchSupplierFeedNow } from '@/lib/api/adminSupplierFeeds';

// Pull the feed now; it runs in the background on the backend.
export const POST = withAdminSession(async ({ token, params }) => {
  return NextResponse.json(await fetchSupplierFeedNow(token, params.feedId), { status: 202 });
});
