import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { fetchAnalytics, refreshAnalytics } from '@/lib/api/adminSeoInsights';

// Return the saved Analytics figures and the connection state.
export const GET = withAdminSession(async ({ req, token }) => {
  return NextResponse.json(await fetchAnalytics(token));
});

// Pull the figures again now.
export const POST = withAdminSession(async ({ token }) => {
  return NextResponse.json(await refreshAnalytics(token));
});
