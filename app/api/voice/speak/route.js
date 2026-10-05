import { NextResponse } from 'next/server';
import { z } from 'zod';

import { apiErrorResponse } from '@/lib/adminApi';
import { speakText } from '@/lib/api/voice';
import { checkRateLimit, clientIpFromRequest, rateLimitResponse } from '@/lib/rateLimit';
import { teraAsker } from '@/lib/teraSession';

// Tera's spoken answers, for anyone signed in: the same people who can ask
// Tera (Robert, 2026-10-06). The cloud voice is charged by the character, so
// a signed-out request is refused, and the browser uses its own voice.
const SpeakRequest = z.object({ text: z.string().trim().min(1).max(1200) });

export async function POST(req) {
  const asker = await teraAsker();
  if (!asker) {
    return NextResponse.json({ error: 'Sign in to hear Tera.' }, { status: 401 });
  }
  const limit = checkRateLimit(`voice:${clientIpFromRequest(req)}`, { maxAttempts: 40, windowMs: 60000 });
  if (!limit.allowed) {
    return rateLimitResponse(limit.retryAfterSeconds, 'Too many replies spoken at once. Try again in a moment.');
  }
  const parsed = SpeakRequest.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Nothing to say.' }, { status: 400 });
  }
  try {
    const audio = await speakText(parsed.data.text);
    return new Response(audio, { headers: { 'Content-Type': 'audio/mpeg', 'Cache-Control': 'private, max-age=3600' } });
  } catch (err) {
    return apiErrorResponse(err, 'The voice is not available right now.');
  }
}