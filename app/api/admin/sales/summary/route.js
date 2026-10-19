import { NextResponse } from 'next/server';
import { withAdminSession } from '@/lib/adminApi';
import { fetchSalesSummary } from '@/lib/api/adminSales';

/**
 * Read-only sales numbers.
 */
export const GET = withAdminSession(async ({ req, token }) => {
  const url = new URL(req.url);
  const params = url.searchParams;

  const range = params.get('range');
  if (range && !/^(7d|30d|90d|this_month|last_month|this_year|custom)$/.test(range)) {
    return NextResponse.json({ error: 'That period is not valid.' }, { status: 400 });
  }

  const compare = params.get('compare');
  if (compare && !/^(previous|last_year|none)$/.test(compare)) {
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

  const bucket = params.get('bucket');
  if (bucket && !/^(day|week|month)$/.test(bucket)) {
    return NextResponse.json({ error: 'That period is not valid.' }, { status: 400 });
  }

  return NextResponse.json(await fetchSalesSummary(token, {
    range,
    start,
    end,
    compare,
    bucket
  }));
});