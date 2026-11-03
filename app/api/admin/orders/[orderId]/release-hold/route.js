import { NextResponse } from 'next/server';
import { withAdminSession } from '@/lib/adminApi';
import { releaseOrderHold } from '@/lib/api/adminOrders';

// Releases a card fraud hold on one order, with a note of what was checked.
export const POST = withAdminSession(async ({ req, token, params }) => {
  const body = await req.json().catch(() => ({}));
  const note = typeof body.note === 'string' ? body.note.slice(0, 500) : '';
  return NextResponse.json(await releaseOrderHold(token, params.orderId, note));
});
