import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { fetchMerchant, refreshMerchant } from '@/lib/api/adminSeoInsights';

// Return the saved Google Merchant Center snapshot and the connection state.
export const GET = withAdminSession(async ({ req, token }) => {
  return NextResponse.json(await fetchMerchant(token));
});

// Read Google Merchant Center again now.
export const POST = withAdminSession(async ({ token }) => {
  return NextResponse.json(await refreshMerchant(token));
});
