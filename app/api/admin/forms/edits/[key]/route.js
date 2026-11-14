import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

import { withAdminSession } from '@/lib/adminApi';
import { FORM_EDITS_TAG, resetFormEdits, saveFormEdits } from '@/lib/api/forms';
import { findOnlineForm } from '@/lib/onlineForms';
import { cleanEdits } from '@/lib/onlineForms/edits';

// Staff changes to one form (lib/onlineForms/edits.js): only changes the form can take are
// sent on, and the public pages pick them up at once.
export const PUT = withAdminSession(async ({ req, token, params }) => {
  const form = findOnlineForm(params.key);
  if (!form) return NextResponse.json({ error: 'Unknown form.' }, { status: 404 });
  const body = await req.json().catch(() => ({}));
  if (!body || typeof body.edits !== 'object' || Array.isArray(body.edits)) {
    return NextResponse.json({ error: 'Nothing to save.' }, { status: 400 });
  }
  const saved = await saveFormEdits(token, form.key, cleanEdits(form, body.edits));
  revalidateTag(FORM_EDITS_TAG);
  return NextResponse.json(saved);
});

export const DELETE = withAdminSession(async ({ token, params }) => {
  const form = findOnlineForm(params.key);
  if (!form) return NextResponse.json({ error: 'Unknown form.' }, { status: 404 });
  const result = await resetFormEdits(token, form.key);
  revalidateTag(FORM_EDITS_TAG);
  return NextResponse.json(result);
});
