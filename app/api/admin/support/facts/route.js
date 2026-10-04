import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { addSupportFact } from '@/lib/api/support';
import { FACT_ERROR, FactRequest } from '@/lib/teachTera';

// Teach Tera: a new fact, searched by Tera straight away.
export const POST = withAdminSession(async ({ req, token }) => {
  const parsed = FactRequest.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: FACT_ERROR }, { status: 400 });
  }
  return NextResponse.json(await addSupportFact(token, parsed.data));
});