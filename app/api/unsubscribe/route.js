import { NextResponse } from 'next/server';

import { unsubscribeCustomer } from '@/lib/api/social';

// Public: behind the link in every marketing email. The token in the link is
// the proof; the backend answers 400 for anything that does not verify.
export async function POST(req) {
  let body = {};
  try {
    body = await req.json();
  } catch {
    body = {};
  }
  const customerId = typeof body.customer_id === 'string' ? body.customer_id.slice(0, 64) : '';
  const token = typeof body.token === 'string' ? body.token.slice(0, 128) : '';
  if (!customerId || !token) {
    return NextResponse.json({ error: 'That link is not valid.' }, { status: 400 });
  }
  try {
    return NextResponse.json(await unsubscribeCustomer(customerId, token));
  } catch (err) {
    return NextResponse.json({ error: 'That link is not valid.' }, { status: err.status === 400 ? 400 : 502 });
  }
}
