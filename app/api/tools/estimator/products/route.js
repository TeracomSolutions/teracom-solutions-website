import { NextResponse } from 'next/server';

import { getAllProducts } from '@/lib/catalogue';
import { productChoice } from '@/lib/estimatorPricing';
import { noStore, signedInCustomer } from '@/lib/estimatorRoute';
import { checkSharedRateLimit, clientIpFromRequest, rateLimitResponse } from '@/lib/rateLimit';
import { searchProducts } from '@/lib/storeSearch';

// The Estimator's materials search (Robert, 20 November 2026): only the store's own
// products, at this customer's price.
export async function GET(req) {
  const rateLimit = await checkSharedRateLimit(`estimator-search:${clientIpFromRequest(req)}`, { maxAttempts: 90, windowMs: 60_000 });
  if (!rateLimit.allowed) return rateLimitResponse(rateLimit.retryAfterSeconds, 'Too many searches. Try again in a minute.');
  const who = await signedInCustomer();
  if (who.error) return who.error;
  const url = new URL(req.url);
  const q = (url.searchParams.get('q') || '').slice(0, 120);
  const category = (url.searchParams.get('category') || '').slice(0, 120);
  const page = Number(url.searchParams.get('page')) || 1;
  const products = (await getAllProducts()).filter((p) => p.type !== 'subscription');
  const found = searchProducts(products, { q, categoryTitle: category, page, size: 20 });
  return NextResponse.json({
    items: found.items.map((p) => productChoice(p, who.pricing)),
    total: found.total,
    page: found.page,
    pages: found.pages,
    categories: found.categories.slice(0, 30),
  }, { headers: noStore });
}

export const dynamic = 'force-dynamic';
