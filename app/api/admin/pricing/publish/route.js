import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { fetchPublishStatus, publishPrices } from '@/lib/api/adminPricing';
import { invalidateCatalogueCache } from '@/lib/catalogue';

// Store pages (and their saved guest copies) that show prices. Marking them
// stale is cheap: each page is rebuilt the next time somebody opens it.
const PRICE_PAGES = ['/store', '/g/store', '/brands', '/g/brands'];

export const GET = withAdminSession(async ({ token }) => {
  return NextResponse.json(await fetchPublishStatus(token));
});

export const POST = withAdminSession(async ({ token }) => {
  invalidateCatalogueCache();
  for (const path of PRICE_PAGES) {
    revalidatePath(path, 'layout');
  }
  return NextResponse.json(await publishPrices(token));
});
