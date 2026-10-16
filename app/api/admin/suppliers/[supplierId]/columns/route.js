import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { saveColumnChoices } from '@/lib/api/adminSuppliers';
import { cleanColumnChoices } from '@/lib/columnChoices';

// Saves which heading holds each field, and which fields are off, for this
// supplier's price lists. uploadId (optional) makes the backend re-read that
// upload so its row count and brands are current.
export const PUT = withAdminSession(async ({ req, token, params }) => {
  const body = await req.json().catch(() => null);
  const { choices, error } = cleanColumnChoices(body?.choices);
  if (error) return NextResponse.json({ error }, { status: 400 });
  const uploadId = typeof body?.uploadId === 'string' && body.uploadId.length <= 64 ? body.uploadId : null;
  return NextResponse.json(await saveColumnChoices(token, params.supplierId, { choices, uploadId }));
});