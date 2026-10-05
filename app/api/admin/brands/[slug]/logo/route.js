import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { removeBrandLogo, uploadBrandLogo } from '@/lib/api/adminBrands';

const MAX_BYTES = 1000000;

// Upload a brand's logo (PNG, JPEG, WebP or SVG, under 1 MB), or remove it.
export const POST = withAdminSession(async ({ req, token, params }) => {
  const form = await req.formData().catch(() => null);
  const file = form?.get('file');
  if (!file || typeof file === 'string' || !file.size) {
    return NextResponse.json({ error: 'Choose an image file.' }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'A logo must be under 1 MB.' }, { status: 400 });
  }
  return NextResponse.json(await uploadBrandLogo(token, params.slug, file));
});

export const DELETE = withAdminSession(async ({ token, params }) => {
  return NextResponse.json(await removeBrandLogo(token, params.slug));
});
