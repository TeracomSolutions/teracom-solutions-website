import { NextResponse } from 'next/server';

import { adminSessionToken } from '@/lib/adminApi';
import { finishAccountingConnect } from '@/lib/api/adminConnections';
import { OAUTH_KEYS, PLATFORM_NAMES } from '@/lib/accountingPlatforms';

// Xero, MYOB and QuickBooks send the browser back here after the sign-in: this is the Redirect URI to enter in
// each platform's developer site (/api/admin/connections/xero/callback and so on). It carries ?code=&state=, plus
// ?realmId= from QuickBooks (the company) and ?businessId= from MYOB (the company file), or ?error= when access
// was refused. The backend checks the state and swaps the code for the lasting token.
function back(req, key, outcome, reason) {
  const url = new URL('/admin/connections', req.url);
  url.searchParams.set(key, outcome);
  if (reason) url.searchParams.set('reason', reason.slice(0, 200));
  return NextResponse.redirect(url);
}

export async function GET(req, ctx) {
  const { key } = await ctx.params;
  if (!OAUTH_KEYS.includes(key)) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const token = await adminSessionToken();
  if (!token) return NextResponse.redirect(new URL('/admin/login', req.url));

  const name = PLATFORM_NAMES[key];
  const query = new URL(req.url).searchParams;
  if (query.get('error')) return back(req, key, 'failed', `${name} access was not approved.`);
  const code = query.get('code') || '';
  const state = query.get('state') || '';
  if (!code || !state) return back(req, key, 'failed', `${name} did not send a code back.`);

  try {
    await finishAccountingConnect(token, key, {
      code,
      state,
      realm_id: query.get('realmId') || '',
      business_id: query.get('businessId') || '',
    });
  } catch (err) {
    const detail = err?.details?.body?.detail;
    return back(req, key, 'failed', typeof detail === 'string' ? detail : `${name} did not connect.`);
  }
  return back(req, key, 'connected');
}
