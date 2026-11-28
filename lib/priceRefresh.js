import { revalidatePath, revalidateTag } from 'next/cache';

import { invalidateCatalogueCache } from '@/lib/catalogue';

// Store pages (and their saved guest copies) that show prices. Marking them stale is cheap: each page is rebuilt
// the next time somebody opens it. Used by Make prices live now and by the scheduled run.
export const PRICE_PAGES = ['/store', '/g/store', '/brands', '/g/brands'];

export function refreshPricePages() {
  invalidateCatalogueCache();
  revalidateTag('storefront-catalogue');
  for (const path of PRICE_PAGES) {
    revalidatePath(path, 'layout');
  }
}
