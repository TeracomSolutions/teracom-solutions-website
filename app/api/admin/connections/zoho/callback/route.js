import { NextResponse } from 'next/server';

import { adminSessionToken } from '@/lib/adminApi';
import { finishZohoConnect } from '@/lib/api/adminConnections';

// Zoho sends the browser back here after the sign-in, with ?code=&state=
// (or ?error= when access was refused). This is the redirect address to
// enter in the Zoho API Console. The backend checks the state and swaps
// the code for the lasting token; the browser lands back on the page.
function back(req, outcome, reason) {
  const url = new URL('/admin/connections', req.url);
  url.searchParams.set('zoho', outcome);
  if (reason) url.searchParams.set('reason', reason.slice(0, 200));
  return NextResponse.redirect(url);
}

export async function GET(req) {
  const token = await adminSessionToken();
  if (!token) return NextResponse.redirect(new URL('/admin/login', req.url));

  const query = new URL(req.url).searchParams;
  if (query.get('error')) return back(req, 'failed', 'Zoho access was not approved.');
  const code = query.get('code') || '';
  const state = query.get('state') || '';
  if (!code || !state) return back(req, 'failed', 'Zoho did not send a code back.');

  try {
    await finishZohoConnect(token, code, state);
  } catch (err) {
    const detail = err?.details?.body?.detail;
    return back(req, 'failed', typeof detail === 'string' ? detail : 'Zoho Books did not connect.');
  }
  return back(req, 'connected');
}