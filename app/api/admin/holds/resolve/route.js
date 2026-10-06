import { NextResponse } from 'next/server';
import { z } from 'zod';

import { withAdminSession } from '@/lib/adminApi';
import { resolveHolds } from '@/lib/api/adminHolds';

// Import the chosen held rows as supplied, or leave them out.
const ResolveRequest = z.object({
  ids: z.array(z.string().uuid()).min(1).max(500),
  action: z.enum(['import', 'leave_out']),
});

export const POST = withAdminSession(async ({ req, token }) => {
  const parsed = ResolveRequest.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Choose at least one row and what to do with it.' }, { status: 400 });
  }
  return NextResponse.json(await resolveHolds(token, parsed.data.ids, parsed.data.action));
});
