import { NextResponse } from 'next/server';
import { withAdminSession } from '@/lib/adminApi';
import { marketplaceCall } from '@/lib/api/adminMarketplace';

const UUID = '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}';
const GET_PATHS = new RegExp('^(status|suppliers|search|price-check|products|orders|products/' + UUID + '/review)$');
const POST_PATHS = new RegExp('^(import|aliexpress/authorize|products/manual|orders/prepare|products/' + UUID + '/(approve|reject)|orders/' + UUID + '/(submit|tracking))$');

function pathOf(params) {
  return (params.path || []).join('/');
}

export const GET = withAdminSession(async ({ req, token, params }) => {
  const path = pathOf(params);
  if (!GET_PATHS.test(path)) return NextResponse.json({ error: 'That page does not exist.' }, { status: 404 });
  const searchParams = {};
  new URL(req.url).searchParams.forEach((value, key) => { searchParams[key] = value; });
  return NextResponse.json(await marketplaceCall(token, 'GET', path, { searchParams }));
});

export const POST = withAdminSession(async ({ req, token, params }) => {
  const path = pathOf(params);
  if (!POST_PATHS.test(path)) return NextResponse.json({ error: 'That page does not exist.' }, { status: 404 });
  let body;
  try { body = await req.json(); } catch { body = undefined; }
  return NextResponse.json(await marketplaceCall(token, 'POST', path, { body }));
});
