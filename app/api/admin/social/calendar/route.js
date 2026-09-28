import { NextResponse } from 'next/server';
import { withAdminSession } from '@/lib/adminApi';
import { getCalendar } from '@/lib/api/adminSocial';

export const GET = withAdminSession(async ({ token, req }) => {
  const url = new URL(req.url);
  const searchParams = url.searchParams;
  
  const start = searchParams.get('start');
  const days = searchParams.get('days');
  
  if (!start || !/^\d{4}-\d{2}-\d{2}$/.test(start)) {
    return NextResponse.json({ error: 'Give a start date.' }, { status: 400 });
  }
  
  const result = await getCalendar(token, start, days);
  return NextResponse.json(result);
});