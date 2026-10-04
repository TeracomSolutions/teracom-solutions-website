import { NextResponse } from 'next/server';
import { z } from 'zod';

import { withAdminSession } from '@/lib/adminApi';
import { saveSupportSettings } from '@/lib/api/support';

const SettingsRequest = z.object({
  monthly_cloud_cap: z.number().int().min(0).max(100000),
});

export const PUT = withAdminSession(async ({ req, token }) => {
  const parsed = SettingsRequest.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Enter a whole number of answers, 0 or more.' }, { status: 400 });
  }
  return NextResponse.json(await saveSupportSettings(token, parsed.data));
});