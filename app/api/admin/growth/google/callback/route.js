import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { growthCall } from '@/lib/api/adminGrowth';

// Where Google sends Robert back after he connects the Business Profile
// (register this address in the Google Cloud OAuth client). Finishes the
// sign-in on the backend, then returns to Scout, Growth tools.
export const GET = withAdminSession(async ({ req, token }) => {
  const url = new URL(req.url);
  const back = new URL('/admin/scout?tab=growth', url.origin);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  if (!code || !state) {
    back.searchParams.set('google', url.searchParams.get('error') || 'cancelled');
    return NextResponse.redirect(back);
  }
  try {
    await growthCall(token, 'POST', 'business_profile/exchange', {
      body: { code, state, redirect_uri: `${url.origin}/api/admin/growth/google/callback` },
    });
    back.searchParams.set('google', 'connected');
  } catch (err) {
    back.searchParams.set('google', 'failed');
    back.searchParams.set('reason', String(err.message || '').slice(0, 200));
  }
  return NextResponse.redirect(back);
});
