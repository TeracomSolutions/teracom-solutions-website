import { NextResponse } from 'next/server';
import { z } from 'zod';

import { withAdminSession } from '@/lib/adminApi';
import { updateTier } from '@/lib/api/adminPricing';

const TIERS = ['silver', 'gold', 'platinum'];

const UpdateRequest = z
  .object({
    label: z.string().trim().min(1).max(50).optional(),
    discount_percent: z.number().min(0).max(100).optional(),
    active: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, { message: 'Nothing to change.' });

export const PUT = withAdminSession(async ({ req, token, params }) => {
  if (!TIERS.includes(params.tierKey)) {
    return NextResponse.json({ error: 'Unknown tier.' }, { status: 400 });
  }
  const parsed = UpdateRequest.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'The discount must be a number between 0 and 100.' }, { status: 400 });
  }
  return NextResponse.json(await updateTier(token, params.tierKey, parsed.data));
});
