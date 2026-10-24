import { NextResponse } from 'next/server';
import { z } from 'zod';

import { withAdminSession } from '@/lib/adminApi';
import { createCampaign } from '@/lib/api/adminMarketing';

const Campaign = z.object({
  title: z.string().trim().min(1).max(200),
  offer: z.string().trim().min(1).max(2000),
  banner_text: z.string().max(160).nullable(),
  link_url: z.string().max(500).nullable(),
  coupon_code: z.string().max(100).nullable(),
  starts_on: z.string().regex(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/),
  ends_on: z.string().regex(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/).nullable(),
  show_banner: z.boolean(),
  in_weekly: z.boolean(),
  status: z.enum(['draft', 'active', 'paused']),
  media_ids: z.array(z.string().max(64)).max(4),
});

export const POST = withAdminSession(async ({ req, token }) => {
  const parsed = Campaign.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Some of the campaign details were not understood.' }, { status: 400 });
  return NextResponse.json(await createCampaign(token, parsed.data));
});
