import { NextResponse } from 'next/server';

import { backendFetch } from '@/lib/api/client';

// The specials for the website banner: public, no personal data, kept for five minutes.
export async function GET() {
  try {
    const data = await backendFetch('/marketing/banner', { cache: 'force-cache', revalidate: 300 });
    return NextResponse.json({ items: Array.isArray(data.items) ? data.items : [] }, { headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' } });
  } catch {
    return NextResponse.json({ items: [] });
  }
}
