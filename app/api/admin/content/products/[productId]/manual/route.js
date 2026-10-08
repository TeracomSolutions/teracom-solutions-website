import { NextResponse } from 'next/server';
import { z } from 'zod';

import { withAdminSession } from '@/lib/adminApi';
import { manualContent } from '@/lib/api/adminContent';

// A manufacturer's page, a picture's address or typed words for one product.
const ManualRequest = z
  .object({
    page_url: z.string().trim().url().max(1000).optional(),
    image_url: z.string().trim().url().max(1000).optional(),
    description: z.string().trim().max(3000).optional(),
  })
  .refine((data) => data.page_url || data.image_url || data.description, { message: 'Nothing to use.' });

export const POST = withAdminSession(async ({ req, token, params }) => {
  const parsed = ManualRequest.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Give a web address (starting https://) or some words.' }, { status: 400 });
  }
  return NextResponse.json(await manualContent(token, params.productId, parsed.data));
});
