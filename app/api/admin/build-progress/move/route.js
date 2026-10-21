import { NextResponse } from 'next/server';
import { z } from 'zod';

import { withAdminSession } from '@/lib/adminApi';
import { moveBuildItem } from '@/lib/api/adminBuildProgress';

const MoveRequest = z.object({
  item_id: z.string().min(1).max(120),
  to: z.enum(['up', 'down', 'top', 'bottom', 'first']),
});

export const POST = withAdminSession(async ({ req, token }) => {
  const parsed = MoveRequest.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'That move was not understood.' }, { status: 400 });
  }
  return NextResponse.json(await moveBuildItem(token, parsed.data.item_id, parsed.data.to));
});
