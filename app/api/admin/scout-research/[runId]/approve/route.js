import { NextResponse } from 'next/server';
import { z } from 'zod';

import { withAdminSession } from '@/lib/adminApi';
import { approveResearchRun } from '@/lib/api/adminScout';

const Decision = z.object({ notes: z.string().max(4000).nullable().optional() });

export const POST = withAdminSession(async ({ req, token, params }) => {
  const parsed = Decision.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Notes are too long.' }, { status: 400 });
  }
  return NextResponse.json(await approveResearchRun(token, params.runId, parsed.data.notes));
});
