import { NextResponse } from 'next/server';
import { withAdminSession } from '@/lib/adminApi';
import { fetchSalesOrders } from '@/lib/api/adminSales';

/**
 * The orders behind the sales numbers.
 */
export const GET = withAdminSession(async ({ req, token }) => {
  const url = new URL(req.url);
  const params = url.searchParams;

  const range = params.get('range');
  if (range && !/^(7d|30d|90d|this_month|last_month|this_year|custom)$/.test(range)) {
    return NextResponse.json({ error: 'That period is not valid.' }, { status: 400 });
  }

  const start = params.get('start');
  if (start && !/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(start)) {
    return NextResponse.json({ error: 'That period is not valid.' }, { status: 400 });
  }

  const end = params.get('end');
  if (end && !/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(end)) {
    return NextResponse.json({ error: 'That period is not valid.' }, { status: 400 });
  }

  const q = params.get('q');
  if (q && q.trim().length > 100) {
    return NextResponse.json({ error: 'That is not valid.' }, { status: 400 });
  }

  const skip = params.get('skip');
  if (skip !== null && (!/^[0-9]+$/.test(skip) || parseInt(skip) < 0 || parseInt(skip) > 100000)) {
    return NextResponse.json({ error: 'That is not valid.' }, { status: 400 });
  }

  const limit = params.get('limit');
  if (limit !== null && (!/^[0-9]+$/.test(limit) || parseInt(limit) < 1 || parseInt(limit) > 200)) {
    return NextResponse.json({ error: 'That is not valid.' }, { status: 400 });
  }

  return NextResponse.json(await fetchSalesOrders(token, {
    range: range || '30d',
    start,
    end,
    q: q ? q.trim() : null,
    skip: skip !== null ? parseInt(skip) : 0,
    limit: limit !== null ? parseInt(limit) : 50
  }));
});