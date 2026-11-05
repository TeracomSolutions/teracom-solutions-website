import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { chooseContentImage } from '@/lib/api/adminContent';

// Picks another of the pictures the found page offered (Robert, 2026-11-05).
export const POST = withAdminSession(async ({ req, token, params }) => {
  const body = await req.json().catch(() => ({}));
  const imageUrl = typeof body.image_url === 'string' ? body.image_url.trim() : '';
  if (!imageUrl.startsWith('http')) {
    return NextResponse.json({ error: 'Choose one of the pictures.' }, { status: 400 });
  }
  return NextResponse.json(await chooseContentImage(token, params.jobId, imageUrl));
});
