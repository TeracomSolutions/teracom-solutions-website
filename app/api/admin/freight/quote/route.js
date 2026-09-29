import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { tryFreightQuote } from '@/lib/api/adminFreight';

export const POST = withAdminSession(async ({ req, token }) => {
  const body = (await req.json().catch(() => null)) || {};
  const item = body.item || {};
  return NextResponse.json(await tryFreightQuote(token, {
    postcode: String(body.postcode || ''),
    items: [{
      quantity: Number(item.quantity) || 1,
      weight_kg: item.weight_kg === '' || item.weight_kg == null ? null : Number(item.weight_kg),
      length_cm: item.length_cm === '' || item.length_cm == null ? null : Number(item.length_cm),
      width_cm: item.width_cm === '' || item.width_cm == null ? null : Number(item.width_cm),
      height_cm: item.height_cm === '' || item.height_cm == null ? null : Number(item.height_cm),
    }],
  }));
});