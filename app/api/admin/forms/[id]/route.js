import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { updateFormSubmission } from '@/lib/api/forms';

const ID = /^[0-9a-f-]{36}$/;
const STATUSES = ['new', 'in_progress', 'done', 'cancelled'];

// A form's status and staff notes. Only these two fields are passed on.
export const PATCH = withAdminSession(async ({ req, token, params }) => {
  if (!ID.test(params.id)) return NextResponse.json({ error: 'Unknown form.' }, { status: 404 });
  const body = await req.json().catch(() => ({}));
  const changes = {};
  if (STATUSES.includes(body?.status)) changes.status = body.status;
  if (typeof body?.staff_notes === 'string') changes.staff_notes = body.staff_notes.slice(0, 8000);
  return NextResponse.json(await updateFormSubmission(token, params.id, changes));
});
