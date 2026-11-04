import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { resendFormSubmission } from '@/lib/api/forms';

const ID = /^[0-9a-f-]{36}$/;

// Sends a form again to every place its route lists (and to the customer when asked).
export const POST = withAdminSession(async ({ req, token, params }) => {
  if (!ID.test(params.id)) return NextResponse.json({ error: 'Unknown form.' }, { status: 404 });
  const body = await req.json().catch(() => ({}));
  return NextResponse.json(await resendFormSubmission(token, params.id, body?.customer === true));
});
