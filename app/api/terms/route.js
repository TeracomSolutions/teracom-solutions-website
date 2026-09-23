import { NextResponse } from 'next/server';

import { buildTermsFeed } from '@/lib/termsFeed';

// GET /api/terms -- the terms version registry, for the Teracom AI platform.
//
// Versions are published on this site, so this is their single source. The
// platform reads version, effective date, URL and fingerprint from here
// rather than keeping its own copy.
//
// Public and unauthenticated on purpose: it says which version of a public
// document is current, which is already on the page. It exposes nothing
// about any customer.

export async function GET() {
  const feed = buildTermsFeed();

  return NextResponse.json(feed, {
    headers: {
      // Changes only on a deploy, so it can be cached hard at the edge while
      // staying fresh enough that a publication propagates within the hour.
      'Cache-Control': 'public, max-age=300, s-maxage=3600, stale-while-revalidate=86400',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
