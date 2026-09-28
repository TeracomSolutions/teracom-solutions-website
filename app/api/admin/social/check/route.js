import { NextResponse } from 'next/server';
import { withAdminSession } from '@/lib/adminApi';
import { checkPost } from '@/lib/api/adminSocial';

export const POST = withAdminSession(async ({ token, req }) => {
  const body = await req.json();
  
  // Only pass the required fields to checkPost
  const { title, text, link_url, channels, overrides, media_ids } = body;
  
  const result = await checkPost(token, {
    title,
    text,
    link_url,
    channels,
    overrides,
    media_ids
  });
  
  return NextResponse.json(result);
});
