import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { fetchPerformance, refreshPerformance } from '@/lib/api/adminSeoInsights';

// The weekly trend, the totals and the opportunity counts for the Search overview.
export const GET = withAdminSession(async ({ token }) => NextResponse.json(await fetchPerformance(token)));

// Refresh: pull Google's figures again.
export const POST = withAdminSession(async ({ token }) => NextResponse.json(await refreshPerformance(token)));
