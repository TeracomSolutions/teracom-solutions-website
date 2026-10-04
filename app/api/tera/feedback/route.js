import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { apiErrorResponse } from '@/lib/adminApi';
import { sendTeraFeedback } from '@/lib/api/support';
import { CUSTOMER_ACCESS_TOKEN_COOKIE } from '@/lib/customerSession';

const FeedbackRequest = z.object({
  messageId: z.string().uuid(),
  value: z.union([z.literal(1), z.literal(-1)]),
});

// Helpful or not, on one of the signed-in customer's own Tera answers.
export async function POST(req) {
  const token = (await cookies()).get(CUSTOMER_ACCESS_TOKEN_COOKIE)?.value;
  if (!token) return NextResponse.json({ error: 'Sign in first.' }, { status: 401 });
  const parsed = FeedbackRequest.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Not a valid answer.' }, { status: 400 });
  try {
    return NextResponse.json(await sendTeraFeedback(token, parsed.data.messageId, parsed.data.value));
  } catch (err) {
    return apiErrorResponse(err, 'That did not save.');
  }
}