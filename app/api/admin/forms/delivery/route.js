import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { fetchFormDelivery, saveFormDelivery } from '@/lib/api/forms';

// Where signed forms go: the route for all forms and any form's own list.
export const GET = withAdminSession(async ({ token }) => NextResponse.json(await fetchFormDelivery(token)));

export const PUT = withAdminSession(async ({ req, token }) => {
  const body = await req.json().catch(() => ({}));
  if (!body || typeof body.routes !== 'object' || Array.isArray(body.routes)) {
    return NextResponse.json({ error: 'Nothing to save.' }, { status: 400 });
  }
  return NextResponse.json(await saveFormDelivery(token, body.routes));
});
