import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { fetchPriceSchedule, savePriceSchedule } from '@/lib/api/adminPricing';

export const GET = withAdminSession(async ({ token }) => NextResponse.json(await fetchPriceSchedule(token)));

export const PUT = withAdminSession(async ({ req, token }) => {
  const body = (await req.json().catch(() => null)) || {};
  return NextResponse.json(await savePriceSchedule(token, {
    enabled: Boolean(body.enabled),
    every_days: Number(body.every_days) || 1,
    hour: Number.isFinite(Number(body.hour)) ? Number(body.hour) : 6,
  }));
});
