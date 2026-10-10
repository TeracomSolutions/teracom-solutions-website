import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { fetchOpportunities } from '@/lib/api/adminSeoInsights';

const KINDS = ['striking', 'ctr', 'gaps', 'rising', 'falling'];

// One kind of opportunity. ?kind= is striking (the default), ctr, gaps, rising or
// falling; ?skip= pages through a long list.
export const GET = withAdminSession(async ({ req, token }) => {
  const params = new URL(req.url).searchParams;
  const asked = params.get('kind');
  const kind = KINDS.includes(asked) ? asked : 'striking';
  const skip = Math.max(0, Number.parseInt(params.get('skip') || '0', 10) || 0);
  return NextResponse.json(await fetchOpportunities(token, kind, skip));
});
