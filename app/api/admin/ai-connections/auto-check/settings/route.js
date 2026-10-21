import { NextResponse } from 'next/server';
import { z } from 'zod';

import { withAdminSession } from '@/lib/adminApi';
import { fetchAiAutoCheck, saveAiAutoCheck } from '@/lib/api/adminAiConnections';

const SettingsRequest = z.object({
  enabled: z.boolean().optional(),
  every_minutes: z.number().int().min(15).max(1440).optional(),
  retries: z.number().int().min(0).max(5).optional(),
});

export const GET = withAdminSession(async ({ token }) => NextResponse.json(await fetchAiAutoCheck(token)));

export const PUT = withAdminSession(async ({ req, token }) => {
  const parsed = SettingsRequest.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'That setting was not understood.' }, { status: 400 });
  }
  return NextResponse.json(await saveAiAutoCheck(token, parsed.data));
});
