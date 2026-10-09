import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { listRedirects, seoOverview } from '@/lib/api/adminSeo';

const STATUSES = ['proposed', 'active', 'rejected'];

// The redirects in one tab of the Search page, with the counts and the last
// search. ?status= is proposed (the default), active or rejected; ?skip= pages
// through a long list.
export const GET = withAdminSession(async ({ req, token }) => {
  const params = new URL(req.url).searchParams;
  const asked = params.get('status');
  const status = STATUSES.includes(asked) ? asked : 'proposed';
  const skip = Math.max(0, Number.parseInt(params.get('skip') || '0', 10) || 0);
  const [overview, list] = await Promise.all([seoOverview(token), listRedirects(token, status, skip)]);
  return NextResponse.json({ overview, ...list });
});