import { NextResponse } from 'next/server';

import { clearAdminSessionCookies } from '@/lib/adminSession';

export async function POST() {
  return clearAdminSessionCookies(NextResponse.json({ ok: true }));
}
