import { NextResponse } from 'next/server';
import { z } from 'zod';

import { withAdminSession } from '@/lib/adminApi';
import { saveMarketingSettings } from '@/lib/api/adminMarketing';

const Settings = z.object({
  enabled: z.boolean().optional(),
  auto_send: z.boolean().optional(),
  weekday: z.number().int().min(0).max(6).optional(),
  hour: z.number().int().min(0).max(23).optional(),
  channels: z.array(z.enum(['email', 'linkedin', 'facebook', 'instagram', 'x'])).optional(),
});

export const PUT = withAdminSession(async ({ req, token }) => {
  const parsed = Settings.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'That setting was not understood.' }, { status: 400 });
  return NextResponse.json(await saveMarketingSettings(token, parsed.data));
});
