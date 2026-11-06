import { NextResponse } from 'next/server';
import { z } from 'zod';

import { withAdminSession } from '@/lib/adminApi';
import { saveNewsArticleSettings } from '@/lib/api/adminIndustryNews';

const Body = z.object({
  weekly_enabled: z.boolean().optional(),
  per_week: z.number().int().min(1).max(10).optional(),
  publish_days: z.array(z.number().int().min(0).max(6)).min(1).max(7).optional(),
  publish_hour: z.number().int().min(0).max(23).optional(),
  share_channels: z.array(z.enum(['email', 'linkedin', 'facebook', 'instagram', 'x'])).max(5).optional(),
});

export const PUT = withAdminSession(async ({ req, token }) => {
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'The settings were not understood.' }, { status: 400 });
  return NextResponse.json(await saveNewsArticleSettings(token, parsed.data));
});
