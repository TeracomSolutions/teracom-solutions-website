import { revalidatePath, revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { fetchPublishStatus, publishPrices } from '@/lib/api/adminPricing';
import { invalidateCatalogueCache } from '@/lib/catalogue';

// Store pages (and their saved guest copies) that show prices. Marking them
// stale is cheap: each page is rebuilt the next time somebody opens it.
const PRICE_PAGES = ['/store', '/g/store', '/brands', '/g/brands'];

// Making prices live also runs the price check on the backend.
export const maxDuration = 60;

export const GET = withAdminSession(async ({ token }) => {
  return NextResponse.json(await fetchPublishStatus(token));
});

export const POST = withAdminSession(async ({ token }) => {
  invalidateCatalogueCache();
  revalidateTag('storefront-catalogue');
  for (const path of PRICE_PAGES) {
    revalidatePath(path, 'layout');
  }
  return NextResponse.json(await publishPrices(token));
});
