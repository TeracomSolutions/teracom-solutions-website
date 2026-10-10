import { NextResponse } from 'next/server';
import { z } from 'zod';

import { withAdminSession } from '@/lib/adminApi';
import { decideTitles, fetchTitles, suggestTitle } from '@/lib/api/adminSeoInsights';

const STATUSES = ['proposed', 'active', 'rejected'];

const SuggestRequest = z.object({ path: z.string().trim().min(1).max(600) });
const DecideRequest = z.object({
  ids: z.array(z.string().uuid()).min(1).max(200),
  action: z.enum(['approve', 'reject']),
});

// The titles in one tab. ?status= is proposed (the default), active or rejected.
export const GET = withAdminSession(async ({ req, token }) => {
  const params = new URL(req.url).searchParams;
  const asked = params.get('status');
  const status = STATUSES.includes(asked) ? asked : 'proposed';
  const skip = Math.max(0, Number.parseInt(params.get('skip') || '0', 10) || 0);
  return NextResponse.json(await fetchTitles(token, status, skip));
});

// Ask the AI for a better title and description for a page.
export const POST = withAdminSession(async ({ req, token }) => {
  const parsed = SuggestRequest.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Type the address of a page, like /store/cctv.' }, { status: 400 });
  }
  return NextResponse.json(await suggestTitle(token, parsed.data.path));
});

// Yes (the website uses the title at once) or no.
export const PUT = withAdminSession(async ({ req, token }) => {
  const parsed = DecideRequest.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Choose at least one title and what to do with it.' }, { status: 400 });
  }
  return NextResponse.json(await decideTitles(token, parsed.data.ids, parsed.data.action));
});
