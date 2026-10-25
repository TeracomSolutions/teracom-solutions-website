import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { BACKEND_API_URL } from '@/lib/config';

export const GET = withAdminSession(async ({ token }) => {
  const response = await fetch(`${BACKEND_API_URL}/staff/sales/carts.csv`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
    signal: AbortSignal.timeout(20000),
  });
  if (!response.ok) return NextResponse.json({ error: 'The CSV could not be made.' }, { status: response.status === 403 ? 403 : 502 });
  return new NextResponse(await response.text(), {
    headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': 'attachment; filename="carts-and-checkouts.csv"' },
  });
});
