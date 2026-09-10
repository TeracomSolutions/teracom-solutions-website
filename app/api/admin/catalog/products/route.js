import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { listCatalogProducts } from '@/lib/api/adminCatalog';
import { ApiError } from '@/lib/api/client';
import { ACCESS_TOKEN_COOKIE } from '@/lib/adminSession';

export async function GET(req) {
  const token = cookies().get(ACCESS_TOKEN_COOKIE)?.value;

  if (!token) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const skip = Number(searchParams.get('skip')) || 0;
  const limit = Number(searchParams.get('limit')) || 100;

  try {
    const data = await listCatalogProducts(token, { skip, limit });
    return NextResponse.json(data);
  } catch (err) {
    if (err instanceof ApiError) {
      return NextResponse.json({ error: err.message }, { status: err.status || 502 });
    }
    return NextResponse.json({ error: 'Unable to reach the catalog service.' }, { status: 502 });
  }
}
