import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { growthCall } from '@/lib/api/adminGrowth';

// Google Business Profile (growth tool 1): start the Google sign-in, reply to
// a review, post an update to the listing.
const ACTIONS = ['authorize', 'reply', 'post'];

export const POST = withAdminSession(async ({ req, token, params }) => {
  if (params.key !== 'business_profile' || !ACTIONS.includes(params.action)) {
    return NextResponse.json({ error: 'That page does not exist.' }, { status: 404 });
  }
  const body = await req.json().catch(() => ({}));
  if (params.action === 'authorize') {
    const origin = new URL(req.url).origin;
    return NextResponse.json(await growthCall(token, 'POST', 'business_profile/authorize', { body: { redirect_uri: `${origin}/api/admin/growth/google/callback` } }));
  }
  return NextResponse.json(await growthCall(token, 'POST', `business_profile/${params.action}`, { body }));
});
