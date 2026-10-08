import { NextResponse } from 'next/server';
import { z } from 'zod';

import { withAdminSession } from '@/lib/adminApi';
import { queueContent } from '@/lib/api/adminContent';

const QueueRequest = z.object({
  product_ids: z.array(z.string().uuid()).min(1).max(5000),
});

export const POST = withAdminSession(async ({ req, token }) => {
  const parsed = QueueRequest.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Tick at least one product.' }, { status: 400 });
  }
  return NextResponse.json(await queueContent(token, parsed.data.product_ids));
});
