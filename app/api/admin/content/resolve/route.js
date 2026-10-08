import { NextResponse } from 'next/server';
import { z } from 'zod';

import { withAdminSession } from '@/lib/adminApi';
import { resolveContent } from '@/lib/api/adminContent';

// Use what was found, not that one, try again, go live as it is, or leave offline.
const ResolveRequest = z.object({
  ids: z.array(z.string().uuid()).min(1).max(500),
  action: z.enum(['approve', 'reject', 'retry', 'go_live_anyway', 'leave_offline']),
});

export const POST = withAdminSession(async ({ req, token }) => {
  const parsed = ResolveRequest.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Choose at least one product and what to do with it.' }, { status: 400 });
  }
  return NextResponse.json(await resolveContent(token, parsed.data.ids, parsed.data.action));
});