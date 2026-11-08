import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { fetchAiActivity } from '@/lib/api/adminAiActivity';

// The AI activity overview for the console page. ?days= is 1, 7 or 30; ?area= and ?provider= narrow it.
export const GET = withAdminSession(async ({ req, token }) => {
  const params = new URL(req.url).searchParams;
  const asked = parseInt(params.get('days') || '1', 10);
  const days = [1, 7, 30].includes(asked) ? asked : 1;
  const area = (params.get('area') || '').slice(0, 40);
  const provider = (params.get('provider') || '').slice(0, 40);
  return NextResponse.json(await fetchAiActivity(token, days, area, provider));
});