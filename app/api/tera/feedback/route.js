import { NextResponse } from 'next/server';
import { z } from 'zod';

import { apiErrorResponse } from '@/lib/adminApi';
import { sendTeraFeedback } from '@/lib/api/support';
import { teraAsker } from '@/lib/teraSession';

const FeedbackRequest = z.object({
  messageId: z.string().uuid(),
  value: z.union([z.literal(1), z.literal(-1)]),
});

// Helpful or not, on one of the signed-in asker's own Tera answers.
export async function POST(req) {
  const asker = await teraAsker();
  if (!asker) return NextResponse.json({ error: 'Sign in first.' }, { status: 401 });
  const parsed = FeedbackRequest.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Not a valid answer.' }, { status: 400 });
  try {
    return NextResponse.json(await sendTeraFeedback(asker.token, parsed.data.messageId, parsed.data.value, asker.kind));
  } catch (err) {
    return apiErrorResponse(err, 'That did not save.');
  }
}