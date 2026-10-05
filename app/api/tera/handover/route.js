import { NextResponse } from 'next/server';
import { z } from 'zod';

import { apiErrorResponse } from '@/lib/adminApi';
import { teraHandover } from '@/lib/api/support';
import { teraAsker } from '@/lib/teraSession';

// From the Ask Tera window: send the question to the team (in business
// hours) or ask for a callback (outside them). The backend makes a lead for
// the Leads page and Tera drafts the reply for staff to check.
const HandoverRequest = z.object({
  conversationId: z.string().uuid().optional().nullable(),
  kind: z.enum(['question', 'callback']),
  phone: z.string().trim().max(40).optional(),
  bestTime: z.string().trim().max(120).optional(),
  note: z.string().trim().max(1000).optional(),
});

export async function POST(req) {
  const asker = await teraAsker();
  if (!asker) {
    return NextResponse.json({ error: 'Sign in to contact the team.', signIn: true }, { status: 401 });
  }
  const parsed = HandoverRequest.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Check the details and try again.' }, { status: 400 });
  }
  const { conversationId, kind, phone, bestTime, note } = parsed.data;
  if (kind === 'callback' && !phone) {
    return NextResponse.json({ error: 'Add a phone number so the team can call you back.' }, { status: 400 });
  }
  try {
    const result = await teraHandover(asker.token, {
      conversation_id: conversationId || null,
      kind,
      phone: phone || null,
      best_time: bestTime || null,
      note: note || null,
    }, asker.kind);
    return NextResponse.json({ ok: true, kind: result.kind });
  } catch (err) {
    return apiErrorResponse(err, 'That did not send. Please use Submit a request instead.');
  }
}