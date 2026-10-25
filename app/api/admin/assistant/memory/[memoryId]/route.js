import { NextResponse } from 'next/server';
import { z } from 'zod';

import { withAdminSession } from '@/lib/adminApi';
import { removeAssistantMemory } from '@/lib/api/adminAssistant';

export const DELETE = withAdminSession(async ({ token, params }) => {
  const parsed = z.string().uuid().safeParse((await params)?.memoryId);
  if (!parsed.success) return NextResponse.json({ error: 'That note was not found.' }, { status: 404 });
  return NextResponse.json(await removeAssistantMemory(token, parsed.data));
});
