import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { checkIndexingNow, fetchIndexingPages, fetchIndexingSummary } from '@/lib/api/adminSeoInsights';

const GROUPS = ['indexed', 'waiting', 'duplicate', 'excluded', 'redirect', 'problem', 'unknown', 'unchecked'];
const KINDS = ['product', 'category', 'brand', 'article', 'resource', 'service', 'tool', 'home', 'other'];

// The counts for each state and the pages in one list. ?group=, ?kind=, ?q= (part of
// an address) narrow it; ?skip= pages through a long list.
export const GET = withAdminSession(async ({ req, token }) => {
  const params = new URL(req.url).searchParams;
  const group = GROUPS.includes(params.get('group')) ? params.get('group') : '';
  const kind = KINDS.includes(params.get('kind')) ? params.get('kind') : '';
  const q = (params.get('q') || '').trim().slice(0, 100);
  const skip = Math.max(0, Number.parseInt(params.get('skip') || '0', 10) || 0);
  const [summary, pages] = await Promise.all([fetchIndexingSummary(token), fetchIndexingPages(token, { group, kind, q, skip })]);
  return NextResponse.json({ summary, ...pages });
});

// Check now: start today's checks with Google.
export const POST = withAdminSession(async ({ token }) => NextResponse.json(await checkIndexingNow(token)));
