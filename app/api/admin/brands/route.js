import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { listStoreBrands } from '@/lib/api/adminBrands';

// The store's brands, for the Brands page's refresh.
export const GET = withAdminSession(async ({ token }) => NextResponse.json(await listStoreBrands(token)));
