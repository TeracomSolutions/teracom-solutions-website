import { NextResponse } from 'next/server';
import { z } from 'zod';

import { withAdminSession } from '@/lib/adminApi';
import { saveFeedbackSettings } from '@/lib/api/adminMarketing';

const Settings = z.object({ google_review_url: z.string().trim().max(500) });

export const PUT = withAdminSession(async ({ req, token }) => {
  const parsed = Settings.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'The link was not understood.' }, { status: 400 });
  return NextResponse.json(await saveFeedbackSettings(token, parsed.data));
});
