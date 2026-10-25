import { NextResponse } from 'next/server';
import { z } from 'zod';

import { withAdminSession } from '@/lib/adminApi';
import { addAssistantMemory, listAssistantMemory } from '@/lib/api/adminAssistant';

const Note = z.object({ text: z.string().trim().min(1).max(500) });

export const GET = withAdminSession(async ({ token }) => NextResponse.json(await listAssistantMemory(token)));

export const POST = withAdminSession(async ({ req, token }) => {
  const parsed = Note.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Write the note first (up to 500 characters).' }, { status: 400 });
  return NextResponse.json(await addAssistantMemory(token, parsed.data.text));
});
