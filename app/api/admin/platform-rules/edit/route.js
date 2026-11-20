import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { backendFetch } from '@/lib/api/client';

// Editing System > Platform rules (backend api/staff_platform_rules.py, services/platform_rule_edits.py).
// One route for the four changes, so the page has a single place to call: edit, reset, add, remove.
const KINDS = ['rules', 'schedules'];
const ID = /^[a-z0-9-]{1,80}$/;

export const POST = withAdminSession(async ({ req, token }) => {
  const body = await req.json().catch(() => null);
  const action = body?.action;
  const kind = KINDS.includes(body?.kind) ? body.kind : null;
  const id = typeof body?.id === 'string' && ID.test(body.id) ? body.id : null;
  const fields = body?.fields && typeof body.fields === 'object' && !Array.isArray(body.fields) ? body.fields : null;
  let out;
  if (action === 'edit' && kind && id && fields) {
    out = await backendFetch(`/staff/platform-rules/${kind}/${id}`, { method: 'PUT', token, body: fields });
  } else if (action === 'reset' && kind && id) {
    out = await backendFetch(`/staff/platform-rules/${kind}/${id}/edit`, { method: 'DELETE', token });
  } else if (action === 'add' && fields) {
    out = await backendFetch('/staff/platform-rules/rules', { method: 'POST', token, body: fields });
  } else if (action === 'remove' && id) {
    out = await backendFetch(`/staff/platform-rules/rules/${id}`, { method: 'DELETE', token });
  } else {
    return NextResponse.json({ error: 'That change was not understood.' }, { status: 400 });
  }
  return NextResponse.json(out);
}, { verify: true });
