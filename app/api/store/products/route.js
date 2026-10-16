import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import { getCatalogue, getCustomerPricing } from '@/lib/catalogue.js';
import { forViewer } from '@/lib/catalogueMerge.js';
import { CUSTOMER_ACCESS_TOKEN_COOKIE } from '@/lib/customerSession';

// The catalogue as this visitor may see it: no supplier names, descriptions or
// markups, and only the price they pay (nothing for a guest). The answer
// depends on who is asking, so it is never stored in a shared cache.
export async function GET() {
  const token = (await cookies()).get(CUSTOMER_ACCESS_TOKEN_COOKIE)?.value;
  const customer = await getCustomerPricing(token);
  const { products, tiers, source } = await getCatalogue();

  return NextResponse.json({
    products: forViewer(products, customer),
    tiers: (tiers || []).map((tier) => ({ key: tier.key, label: tier.label })),
    source,
  }, {
    headers: {
      'Cache-Control': 'private, max-age=60'
    }
  });
}

export const dynamic = 'force-dynamic';