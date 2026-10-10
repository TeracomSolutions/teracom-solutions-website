import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { checkHealthNow, fetchHealthPages, fetchHealthSummary } from '@/lib/api/adminSeoInsights';

const KINDS = ['product', 'category', 'brand', 'article', 'resource', 'service', 'tool', 'home', 'other'];

// The counts for each kind of problem and the pages with one. ?code= narrows to
// one kind of problem, ?kind= to one kind of page, ?q= to part of an address;
// ?skip= pages through a long list.
export const GET = withAdminSession(async ({ req, token }) => {
  const params = new URL(req.url).searchParams;
  const asked = params.get('code') || '';
  const code = /^[a-z_]{1,40}$/.test(asked) ? asked : '';
  const kind = KINDS.includes(params.get('kind')) ? params.get('kind') : '';
  const q = (params.get('q') || '').trim().slice(0, 100);
  const skip = Math.max(0, Number.parseInt(params.get('skip') || '0', 10) || 0);
  const [summary, pages] = await Promise.all([fetchHealthSummary(token), fetchHealthPages(token, { code, kind, q, skip })]);
  return NextResponse.json({ summary, ...pages });
});

// Check now: start a check of the whole website.
export const POST = withAdminSession(async ({ token }) => NextResponse.json(await checkHealthNow(token)));
