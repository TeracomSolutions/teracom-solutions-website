import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { growthCall } from '@/lib/api/adminGrowth';

// Area pages, projects, questions and newsletter issues (Scout, Growth tools):
//   GET    items                      the list
//   POST   items                      a new one
//   PUT    items/<id>                 save
//   DELETE items/<id>                 delete
//   POST   items/<id>/photos          upload a photo (form data: file, caption)
//   DELETE items/<id>/photos/<file>   remove a photo
//   POST   items/<id>/send            send a newsletter issue
const UUID = /^[0-9a-f-]{36}$/;
const FILE = /^[a-z_]+-[0-9a-f]{16}\.webp$/;

function pathOf(params) {
  const rest = params.rest || [];
  if (rest.length === 0) return { ok: true, path: 'items' };
  if (!UUID.test(rest[0])) return { ok: false };
  if (rest.length === 1) return { ok: true, path: `items/${rest[0]}`, id: rest[0] };
  if (rest.length === 2 && rest[1] === 'photos') return { ok: true, path: `items/${rest[0]}/photos`, photos: true };
  if (rest.length === 2 && rest[1] === 'send') return { ok: true, path: `items/${rest[0]}/send`, send: true };
  if (rest.length === 3 && rest[1] === 'photos' && FILE.test(rest[2])) return { ok: true, path: `items/${rest[0]}/photos/${rest[2]}` };
  return { ok: false };
}

const missing = () => NextResponse.json({ error: 'That page does not exist.' }, { status: 404 });

export const GET = withAdminSession(async ({ token, params }) => {
  const route = pathOf(params);
  if (!route.ok || route.path !== 'items') return missing();
  return NextResponse.json(await growthCall(token, 'GET', `${params.key}/items`));
});

export const POST = withAdminSession(async ({ req, token, params }) => {
  const route = pathOf(params);
  if (!route.ok || route.id) return missing();
  if (route.photos) {
    const form = await req.formData().catch(() => null);
    const file = form ? form.get('file') : null;
    if (!file || typeof file === 'string' || !file.size) return NextResponse.json({ error: 'Choose a picture.' }, { status: 400 });
    if (file.size > 4 * 1024 * 1024) return NextResponse.json({ error: 'That picture is over 4 MB.' }, { status: 400 });
    const body = new FormData();
    body.append('file', file, file.name || 'photo');
    body.append('caption', String(form.get('caption') || '').slice(0, 200));
    return NextResponse.json(await growthCall(token, 'POST', `${params.key}/${route.path}`, { body }));
  }
  if (route.send) {
    if (params.key !== 'newsletter') return missing();
    return NextResponse.json(await growthCall(token, 'POST', `newsletter/${route.path}`));
  }
  const body = await req.json().catch(() => ({}));
  return NextResponse.json(await growthCall(token, 'POST', `${params.key}/items`, { body }));
});

export const PUT = withAdminSession(async ({ req, token, params }) => {
  const route = pathOf(params);
  if (!route.ok || !route.id) return missing();
  const body = await req.json().catch(() => ({}));
  return NextResponse.json(await growthCall(token, 'PUT', `${params.key}/${route.path}`, { body }));
});

export const DELETE = withAdminSession(async ({ token, params }) => {
  const route = pathOf(params);
  if (!route.ok || route.path === 'items' || route.photos || route.send) return missing();
  return NextResponse.json(await growthCall(token, 'DELETE', `${params.key}/${route.path}`));
});
