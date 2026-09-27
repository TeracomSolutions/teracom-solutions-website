import { NextResponse } from 'next/server';

import { getCatalogue } from '@/lib/catalogue.js';

export async function GET() {
  const { products, tiers, source } = await getCatalogue();
  
  return NextResponse.json({ products, tiers, source }, {
    headers: {
      'Cache-Control': 'public, max-age=60, s-maxage=300'
    }
  });
}

export const dynamic = 'force-dynamic';