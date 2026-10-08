import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { uploadContentImage } from '@/lib/api/adminContent';

// The site's host allows about 4.5 MB in one request; a bigger picture can be
// given as a link instead.
const MAX_BYTES = 4 * 1024 * 1024;

export const POST = withAdminSession(async ({ req, token, params }) => {
  const form = await req.formData().catch(() => null);
  const file = form ? form.get('file') : null;
  if (!file || typeof file === 'string' || !file.size) {
    return NextResponse.json({ error: 'Choose a picture to upload.' }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'That picture is over 4 MB. Paste a link to it instead.' }, { status: 400 });
  }
  const body = new FormData();
  body.append('file', file, file.name || 'photo');
  return NextResponse.json(await uploadContentImage(token, params.productId, body));
});
