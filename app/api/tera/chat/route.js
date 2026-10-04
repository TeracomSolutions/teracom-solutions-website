import { NextResponse } from 'next/server';
import { z } from 'zod';

import { apiErrorResponse } from '@/lib/adminApi';
import { askTera } from '@/lib/api/support';
import { teraAsker } from '@/lib/teraSession';

// Ask Tera is for anyone signed in: customers on the website, and staff
// signed in to the console (Robert, 2026-10-04). The backend answers from
// Teracom's own library with that session's token.
const ChatRequest = z.object({
  message: z.string().trim().min(1).max(1000),
  conversationId: z.string().uuid().optional().nullable(),
});

export async function POST(req) {
  const asker = await teraAsker();
  if (!asker) {
    return NextResponse.json({ error: 'Sign in to chat with Tera.', signIn: true }, { status: 401 });
  }
  const parsed = ChatRequest.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Type a question of up to 1,000 characters.' }, { status: 400 });
  }
  try {
    const result = await askTera(asker.token, {
      message: parsed.data.message,
      conversation_id: parsed.data.conversationId || null,
    }, asker.kind);
    return NextResponse.json({
      reply: result.reply,
      sources: result.sources || [],
      answered: Boolean(result.answered),
      conversationId: result.conversation_id,
      messageId: result.message_id,
    });
  } catch (err) {
    if (err?.status === 401) {
      return NextResponse.json({ error: 'Your sign-in has expired. Sign in again to keep chatting.', signIn: true }, { status: 401 });
    }
    return apiErrorResponse(err, 'Tera is not available right now.');
  }
}