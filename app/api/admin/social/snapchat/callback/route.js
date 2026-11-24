import { NextResponse } from 'next/server';

import { adminSessionToken } from '@/lib/adminApi';
import { snapchatExchange } from '@/lib/api/adminSocial';

// Snap sends the browser back here after the sign-in, with ?code=&state= (or ?error= when it was
// refused). This is the Redirect URI to enter on the Snap OAuth app. The backend checks the state and
// swaps the code for the lasting refresh token; the browser lands back on Connections > Social.
function back(req, outcome, reason) {
  const url = new URL('/admin/connections', req.url);
  url.searchParams.set('snapchat', outcome);
  if (reason) url.searchParams.set('reason', reason.slice(0, 200));
  url.hash = 'social';
  return NextResponse.redirect(url);
}

export async function GET(req) {
  const token = await adminSessionToken();
  if (!token) return NextResponse.redirect(new URL('/admin/login', req.url));

  const query = new URL(req.url).searchParams;
  if (query.get('error')) return back(req, 'failed', query.get('error_description') || 'The Snapchat sign-in was not approved.');
  const code = query.get('code') || '';
  const state = query.get('state') || '';
  if (!code || !state) return back(req, 'failed', 'Snapchat did not send a code back.');

  try {
    await snapchatExchange(token, code, state);
  } catch (err) {
    const detail = err && err.details && err.details.body ? err.details.body.detail : null;
    return back(req, 'failed', typeof detail === 'string' ? detail : 'Snapchat did not connect.');
  }
  return back(req, 'connected');
}
