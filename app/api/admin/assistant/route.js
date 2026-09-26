import { NextResponse } from 'next/server';
import { z } from 'zod';

import { withAdminSession } from '@/lib/adminApi';
import { assistantChat } from '@/lib/api/adminAssistant';

// The assistant may call several tools before answering, so this route is
// allowed to run longer than the default.
export const maxDuration = 60;

const ChatRequest = z.object({
  messages: z
    .array(z.object({ role: z.enum(['user', 'assistant']), content: z.string().min(1).max(8000) }))
    .min(1)
    .max(24),
});

export const POST = withAdminSession(async ({ req, token }) => {
  const parsed = ChatRequest.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Type a message first.' }, { status: 400 });
  }
  return NextResponse.json(await assistantChat(token, parsed.data.messages));
}, { fallback: 'The assistant did not answer in time. Try a shorter request.' });
