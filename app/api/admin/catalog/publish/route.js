import { NextResponse } from 'next/server';
import { z } from 'zod';

import { withAdminSession } from '@/lib/adminApi';
import { publishProducts } from '@/lib/api/adminCatalog';

const PublishRequest = z.object({
  product_ids: z.array(z.string().uuid()).min(1).max(5000),
  published: z.boolean(),
});

export const POST = withAdminSession(async ({ req, token }) => {
  const parsed = PublishRequest.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Tick at least one product.' }, { status: 400 });
  }
  return NextResponse.json(await publishProducts(token, parsed.data));
});
