import { NextResponse } from 'next/server';

import { adminSessionToken } from '@/lib/adminApi';
import { marketplaceCall } from '@/lib/api/adminMarketplace';

// AliExpress sends the browser back here after the sign-in, with ?code=&state=
// (or ?error= when access was refused). This is the redirect address to
// enter in the AliExpress partner console. The backend checks the state and
// swaps the code for the lasting token; the browser lands back on the page.
function back(req, outcome, reason) {
  const url = new URL('/admin/marketplace', req.url);
  url.searchParams.set(outcome, outcome === 'connected' ? 'aliexpress' : '1');
  if (reason) url.searchParams.set('reason', reason.slice(0, 200));
  return NextResponse.redirect(url);
}

export async function GET(req) {
  const token = await adminSessionToken();
  if (!token) return NextResponse.redirect(new URL('/admin/login', req.url));

  const query = new URL(req.url).searchParams;
  if (query.get('error')) return back(req, 'failed', 'AliExpress sign-in was not approved.');
  const code = query.get('code') || '';
  const state = query.get('state') || '';
  if (!code || !state) return back(req, 'failed', 'AliExpress did not send a code back.');

  try {
    await marketplaceCall(token, 'POST', 'aliexpress/exchange', { body: { code, state } });
  } catch (err) {
    const detail = err && err.details && err.details.body ? err.details.body.detail : null;
    return back(req, 'failed', typeof detail === 'string' ? detail : 'AliExpress did not connect.');
  }
  return back(req, 'connected');
}
