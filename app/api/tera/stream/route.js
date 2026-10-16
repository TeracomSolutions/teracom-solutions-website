import { NextResponse } from 'next/server';
import { z } from 'zod';

import { apiErrorResponse } from '@/lib/adminApi';
import { streamTera } from '@/lib/api/support';
import { teraAsker } from '@/lib/teraSession';
import { assistantChat } from '@/lib/api/adminAssistant';
import { buildMessages, doneFrame, errorFrame } from '@/lib/teraStaffChat.js';

// Ask Tera with the answer passed on as it is written: the backend's
// server-sent events go straight through to the chat window (lib/teraStream.js
// reads them), for anyone signed in, as /api/tera/chat.
export const maxDuration = 60;
export const dynamic = 'force-dynamic';

const ChatRequest = z.object({
  message: z.string().trim().min(1).max(1000),
  conversationId: z.string().uuid().optional().nullable(),
  history: z.array(z.object({ role: z.string(), content: z.string() })).max(40).optional(),
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

  if (asker.kind === 'staff') {
    try {
      const answer = await assistantChat(asker.token, buildMessages(parsed.data.history, parsed.data.message));
      return new Response(doneFrame(answer.reply, parsed.data.conversationId), {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache, no-transform',
          'X-Accel-Buffering': 'no',
        },
      });
    } catch (err) {
      if (err?.status === 401) {
        return NextResponse.json({ error: 'Your sign-in has expired. Sign in again to keep chatting.', signIn: true }, { status: 401 });
      }
      return new Response(errorFrame(err.message), {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache, no-transform',
          'X-Accel-Buffering': 'no',
        },
      });
    }
  }

  try {
    const upstream = await streamTera(asker.token, {
      message: parsed.data.message,
      conversation_id: parsed.data.conversationId || null,
    }, asker.kind);
    return new Response(upstream.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        'X-Accel-Buffering': 'no',
      },
    });
  } catch (err) {
    if (err?.status === 401) {
      return NextResponse.json({ error: 'Your sign-in has expired. Sign in again to keep chatting.', signIn: true }, { status: 401 });
    }
    return apiErrorResponse(err, 'Tera is not available right now.');
  }
}