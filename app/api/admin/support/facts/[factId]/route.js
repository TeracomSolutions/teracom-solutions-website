import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { deleteSupportFact, updateSupportFact } from '@/lib/api/support';
import { FACT_ERROR, FactRequest } from '@/lib/teachTera';

// Teach Tera: change a fact (or switch it off or on), or delete it.
export const PUT = withAdminSession(async ({ req, token, params }) => {
  const parsed = FactRequest.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: FACT_ERROR }, { status: 400 });
  }
  return NextResponse.json(await updateSupportFact(token, params.factId, parsed.data));
});

export const DELETE = withAdminSession(async ({ token, params }) => {
  return NextResponse.json(await deleteSupportFact(token, params.factId));
});
