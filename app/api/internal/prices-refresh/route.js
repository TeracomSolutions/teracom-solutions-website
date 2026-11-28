import { NextResponse } from 'next/server';

import { isValidImportToken } from '@/lib/adminAuth';
import { refreshPricePages } from '@/lib/priceRefresh';

// The backend's scheduled Make prices live (services/pricing_schedule.py) asks the website to refresh its saved
// store pages. Only the backend can: it must send the shared service token.
export async function POST(req) {
  const provided = req.headers.get('x-internal-service-token') || '';
  if (!isValidImportToken(provided, process.env.WEBSITE_FRONTEND_SERVICE_TOKEN || '')) {
    return NextResponse.json({ error: 'Not allowed' }, { status: 401 });
  }
  refreshPricePages();
  return NextResponse.json({ ok: true });
}
