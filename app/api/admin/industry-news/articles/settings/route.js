import { NextResponse } from 'next/server';
import { z } from 'zod';

import { withAdminSession } from '@/lib/adminApi';
import { saveNewsArticleSettings } from '@/lib/api/adminIndustryNews';

const Body = z.object({ weekly_enabled: z.boolean().optional(), per_week: z.number().int().min(1).max(10).optional() });

export const PUT = withAdminSession(async ({ req, token }) => {
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'The settings were not understood.' }, { status: 400 });
  return NextResponse.json(await saveNewsArticleSettings(token, parsed.data));
});
