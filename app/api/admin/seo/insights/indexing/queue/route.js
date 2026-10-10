import { NextResponse } from 'next/server';
import { z } from 'zod';

import { withAdminSession } from '@/lib/adminApi';
import { queuePagesForContent } from '@/lib/api/adminSeoInsights';

const QueueRequest = z.object({ page_ids: z.array(z.string().uuid()).min(1).max(500) });

// Find photos and text for the product pages among these.
export const POST = withAdminSession(async ({ req, token }) => {
  const parsed = QueueRequest.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Tick at least one page.' }, { status: 400 });
  }
  return NextResponse.json(await queuePagesForContent(token, parsed.data.page_ids));
});
