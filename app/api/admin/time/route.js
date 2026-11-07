import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { fetchTime, saveZone } from '@/lib/api/adminTime';

const ZONE = /^[A-Za-z_]+(\/[A-Za-z_+\-0-9]+){0,2}$/;

// The time zone every console page shows times in. GET: the current one. PUT {zone}: change it.
export const GET = withAdminSession(async ({ token }) => {
  return NextResponse.json(await fetchTime(token));
});

export const PUT = withAdminSession(async ({ req, token }) => {
  const body = await req.json().catch(() => ({}));
  const zone = typeof body.zone === 'string' ? body.zone.trim() : '';
  if (!ZONE.test(zone) || zone.length > 60) return NextResponse.json({ error: 'Choose a time zone from the list.' }, { status: 400 });
  return NextResponse.json(await saveZone(token, zone));
});
