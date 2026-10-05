import { NextResponse } from 'next/server';
import { z } from 'zod';

import { withAdminSession } from '@/lib/adminApi';
import { updateStoreBrand } from '@/lib/api/adminBrands';

// Edit a brand: its name, website, other spellings, page text, and whether
// it shows with the brands Teracom works with. Each field only when sent.
const BrandRequest = z.object({
  name: z.string().trim().min(1).max(200).optional(),
  aliases: z.array(z.string().trim().max(200)).max(30).optional(),
  website: z.string().trim().max(300).optional(),
  tagline: z.string().trim().max(300).optional(),
  body: z.string().trim().max(6000).optional(),
  supported: z.boolean().optional(),
  logo_tile: z.boolean().optional(),
});

export const PUT = withAdminSession(async ({ req, token, params }) => {
  const parsed = BrandRequest.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Check the brand details: the name cannot be blank.' }, { status: 400 });
  }
  return NextResponse.json(await updateStoreBrand(token, params.slug, parsed.data));
});
