import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { updateMedia, deleteMedia } from '@/lib/api/adminSocial';

export const PATCH = withAdminSession(async ({ req, token, params }) => {
  const { alt_text } = await req.json();
  return NextResponse.json(await updateMedia(token, params.id, { alt_text: alt_text?.substring(0, 500) }));
});

export const DELETE = withAdminSession(async ({ token, params }) => {
  return NextResponse.json(await deleteMedia(token, params.id));
});
