import { NextResponse } from 'next/server';
import { z } from 'zod';

import { withAdminSession } from '@/lib/adminApi';
import { queueMissingContent } from '@/lib/api/adminContent';

const QueueMissingRequest = z.object({
  live_only: z.boolean().optional(),
});

export const POST = withAdminSession(async ({ req, token }) => {
  const parsed = QueueMissingRequest.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: 'That request was not understood.' }, { status: 400 });
  }
  return NextResponse.json(await queueMissingContent(token, parsed.data.live_only));
});
