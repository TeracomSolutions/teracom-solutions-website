import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { clearConnection, saveConnection } from '@/lib/api/adminConnections';

// Only plain strings go to the backend; it checks every field again.
export const PUT = withAdminSession(async ({ req, token, params }) => {
  const body = (await req.json().catch(() => null)) || {};
  const values = Object.fromEntries(
    Object.entries(body.values || {})
      .filter(([, value]) => typeof value === 'string' && value.length <= 4000)
      .slice(0, 20),
  );
  return NextResponse.json(await saveConnection(token, params.key, values));
});

export const DELETE = withAdminSession(async ({ token, params }) => {
  return NextResponse.json(await clearConnection(token, params.key));
});
