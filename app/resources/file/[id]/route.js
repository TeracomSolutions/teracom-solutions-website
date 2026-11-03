import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { adminSessionToken } from '@/lib/adminApi';
import { ApiError, backendFetch } from '@/lib/api/client';
import { CUSTOMER_ACCESS_TOKEN_COOKIE } from '@/lib/customerSession';

// A manual, datasheet or download (Robert, 2026-11-03: downloads need a sign-in).
// A signed-in customer, or staff in the console, is sent to a ten-minute link from
// the backend (services/resource_links.py); anyone else to create an account first,
// coming straight back here afterwards.
export const dynamic = 'force-dynamic';

const DOCUMENT_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function noStore(response) {
  response.headers.set('Cache-Control', 'private, no-store');
  return response;
}

export async function GET(req, { params }) {
  const { id } = await params;
  if (!DOCUMENT_ID.test(id || '')) return noStore(NextResponse.json({ error: 'Not found' }, { status: 404 }));
  const back = encodeURIComponent(`/resources/file/${id}`);
  const store = await cookies();
  const customer = store.get(CUSTOMER_ACCESS_TOKEN_COOKIE)?.value || '';
  const staff = customer ? '' : await adminSessionToken();
  if (!customer && !staff) return noStore(NextResponse.redirect(new URL(`/account/signup?next=${back}`, req.url), 302));
  try {
    const data = await backendFetch(`/resources/${id}/link/${customer ? 'customer' : 'staff'}`, { token: customer || staff });
    return noStore(NextResponse.redirect(data.url, 302));
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) {
      return noStore(NextResponse.redirect(new URL(`/account/login?next=${back}`, req.url), 302));
    }
    if (err instanceof ApiError && err.status === 404) {
      return noStore(NextResponse.json({ error: 'That document is no longer available.' }, { status: 404 }));
    }
    return noStore(NextResponse.json({ error: 'The download could not be started. Try again in a minute.' }, { status: 502 }));
  }
}
