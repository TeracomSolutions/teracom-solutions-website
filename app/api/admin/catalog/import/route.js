import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { importCatalogFeed } from '@/lib/api/adminCatalog';
import { ApiError } from '@/lib/api/client';
import { ACCESS_TOKEN_COOKIE } from '@/lib/adminSession';

// Body shape mirrors teracom-platform-backend's own
// schemas/store_catalog.py#StoreProductFeedRow -- exactly what
// lib/feed-importer.js#parseFeed() produces client-side. This route
// does not re-parse a raw feed file; the browser already did that.
const FeedRow = z.object({
  sku: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional().default(''),
  price: z.number().optional().default(0),
  stock: z.number().optional().default(0),
  category: z.string().optional().default('Uncategorised'),
  supplier: z.string().nullish(),
});

const ImportRequest = z.array(FeedRow);

export async function POST(req) {
  const token = cookies().get(ACCESS_TOKEN_COOKIE)?.value;

  if (!token) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const parsed = ImportRequest.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid feed rows' }, { status: 400 });
  }

  try {
    const summary = await importCatalogFeed(token, parsed.data);
    return NextResponse.json(summary);
  } catch (err) {
    if (err instanceof ApiError) {
      return NextResponse.json({ error: err.message }, { status: err.status || 502 });
    }
    return NextResponse.json({ error: 'Unable to reach the catalog service.' }, { status: 502 });
  }
}
