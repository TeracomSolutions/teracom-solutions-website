import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { findBrandLogo } from '@/lib/api/adminBrands';

// Look for the brand's logo on its own website (can take half a minute).
export const maxDuration = 60;

export const POST = withAdminSession(async ({ token, params }) => {
  return NextResponse.json(await findBrandLogo(token, params.slug));
});
