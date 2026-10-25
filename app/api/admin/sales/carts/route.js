import { NextResponse } from 'next/server';
import { z } from 'zod';

import { withAdminSession } from '@/lib/adminApi';
import { backendFetch } from '@/lib/api/client';

const Tracking = z.object({ carts: z.boolean().optional(), checkouts: z.boolean().optional() });

export const GET = withAdminSession(async ({ req, token }) => {
  const days = Math.max(1, Math.min(90, Number(new URL(req.url).searchParams.get('days')) || 30));
  return NextResponse.json(await backendFetch('/staff/sales/carts', { token, searchParams: { days } }));
});

export const PUT = withAdminSession(async ({ req, token }) => {
  const parsed = Tracking.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'That setting was not understood.' }, { status: 400 });
  return NextResponse.json(await backendFetch('/staff/sales/tracking', { method: 'PUT', token, body: parsed.data }));
});
