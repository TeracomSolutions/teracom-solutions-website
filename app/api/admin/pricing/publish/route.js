import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { fetchPublishStatus, publishPrices } from '@/lib/api/adminPricing';
import { refreshPricePages } from '@/lib/priceRefresh';

// Making prices live also runs the price check on the backend.
export const maxDuration = 60;

export const GET = withAdminSession(async ({ token }) => {
  return NextResponse.json(await fetchPublishStatus(token));
});

// Only a real staff session may clear the store pages, and only once the backend
// has accepted the publish: each clear makes every store page rebuild on Vercel.
export const POST = withAdminSession(async ({ token }) => {
  const result = await publishPrices(token);
  refreshPricePages();
  return NextResponse.json(result);
}, { verify: true });
