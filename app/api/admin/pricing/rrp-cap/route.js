import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { fetchRrpCap, saveRrpCap } from '@/lib/api/adminPricing';

export const GET = withAdminSession(async ({ token }) => NextResponse.json(await fetchRrpCap(token)));

export const PUT = withAdminSession(async ({ req, token }) => {
  const body = (await req.json().catch(() => null)) || {};
  const list = (v) => (Array.isArray(v) ? v.map(String) : []);
  return NextResponse.json(await saveRrpCap(token, { brands: list(body.brands), supplier_ids: list(body.supplier_ids) }));
});
