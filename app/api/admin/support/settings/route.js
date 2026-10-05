import { NextResponse } from 'next/server';
import { z } from 'zod';

import { withAdminSession } from '@/lib/adminApi';
import { saveSupportSettings } from '@/lib/api/support';

// Each setting is changed only when it is sent.
const SettingsRequest = z.object({
  monthly_cloud_cap: z.number().int().min(0).max(100000).optional(),
  local_model_enabled: z.boolean().optional(),
  local_model_url: z.string().trim().max(300).optional(),
  local_model: z.string().trim().min(1).max(120).optional(),
  web_search_enabled: z.boolean().optional(),
  manufacturer_sites: z.array(z.string().trim().max(200)).max(200).optional(),
  draft_replies_enabled: z.boolean().optional(),
});

export const PUT = withAdminSession(async ({ req, token }) => {
  const parsed = SettingsRequest.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Check the settings: the cap is a whole number, 0 or more, and the model needs a name.' }, { status: 400 });
  }
  return NextResponse.json(await saveSupportSettings(token, parsed.data));
});