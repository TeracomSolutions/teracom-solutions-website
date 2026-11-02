import { NextResponse } from 'next/server';

import { fetchMetaConfig } from '@/lib/api/meta';
import { validPixelId } from '@/lib/metaPixel';

export const dynamic = 'force-dynamic';

// Which Meta pixel the website loads (Robert, 2026-11-03), from Connections >
// Meta. It never fails: when the backend cannot be reached no pixel loads.
export async function GET() {
  let pixelId = '';
  try {
    pixelId = validPixelId((await fetchMetaConfig())?.pixel_id);
  } catch {
    // No pixel.
  }
  return NextResponse.json({ pixel_id: pixelId || null }, { headers: { 'Cache-Control': 'public, max-age=60' } });
}
