import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { fetchPriceCheck, runPriceCheck } from '@/lib/api/adminPricing';

// Checking a few thousand products takes a few seconds.
export const maxDuration = 60;

export const GET = withAdminSession(async ({ token }) => NextResponse.json(await fetchPriceCheck(token)));

export const POST = withAdminSession(async ({ token }) => NextResponse.json(await runPriceCheck(token)));
