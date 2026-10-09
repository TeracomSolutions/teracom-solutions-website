import { NextResponse } from 'next/server';
import { z } from 'zod';

import { withAdminSession } from '@/lib/adminApi';
import { fetchBands, saveBands } from '@/lib/api/adminPricing';

// One set of cost bands: a supplier's, or the default bands when supplier_id is
// null. Each band stops below a cost (ex GST, in cents), or has no limit, and
// sets a markup per tier. The list sent replaces that set.
const SaveRequest = z.object({
  supplier_id: z.string().uuid().nullable(),
  bands: z
    .array(
      z.object({
        up_to_cents: z.number().int().min(1).max(100000000).nullable(),
        markups: z.record(z.string(), z.number().min(0).max(1000).nullable()),
      }),
    )
    .max(12),
});

export const GET = withAdminSession(async ({ token }) => NextResponse.json(await fetchBands(token)));

export const PUT = withAdminSession(async ({ req, token }) => {
  const parsed = SaveRequest.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Each band needs a cost limit above $0 and markups between 0 and 1000.' }, { status: 400 });
  }
  return NextResponse.json(await saveBands(token, parsed.data.supplier_id, parsed.data.bands));
});
