import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { findAllBrandLogos } from '@/lib/api/adminBrands';

// Look again for the logo of every brand that has none, in the background.
export const POST = withAdminSession(async ({ token }) => NextResponse.json(await findAllBrandLogos(token)));
