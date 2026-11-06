import { NextResponse } from 'next/server';

import { ApiError } from '@/lib/api/client';
import { submitForm } from '@/lib/api/forms';
import { FILE_RULES, agreementVersion, checkForm, cleanValues, fileExtension, findOnlineForm, identity, summarise, termsTitle } from '@/lib/onlineForms';
import { checkSharedRateLimit, clientIpFromRequest, rateLimitResponse } from '@/lib/rateLimit';
import { STARTED_FIELD, TRAP_FIELD, checkSubmission } from '@/lib/formGuard';
import { TERMS_VERSION } from '@/lib/termsDocument';
import { TURNSTILE_FAILED_MESSAGE, verifyTurnstile } from '@/lib/turnstile';

// A form customers fill in and sign (lib/onlineForms). Everything the browser checked is
// checked again here against the form's own definition; only its own answers go on, with
// the terms version this website is showing (never the browser's word for it).

const RATE_LIMIT_MAX = Number(process.env.REQUESTS_RATE_LIMIT_MAX_ATTEMPTS) || 5;
const RATE_LIMIT_WINDOW_MS = (Number(process.env.REQUESTS_RATE_LIMIT_WINDOW_SECONDS) || 600) * 1000;
const MAX_SIGNATURE_LENGTH = 250_000;
const BASE64 = /^[A-Za-z0-9+/]+={0,2}$/;

export async function POST(req, props) {
  const params = await props.params;
  const form = findOnlineForm(params.key);
  if (!form) return NextResponse.json({ error: 'Unknown form.' }, { status: 404 });

  const ip = clientIpFromRequest(req);
  const rateLimit = await checkSharedRateLimit(`forms:${ip}`, { maxAttempts: RATE_LIMIT_MAX, windowMs: RATE_LIMIT_WINDOW_MS });
  if (!rateLimit.allowed) return rateLimitResponse(rateLimit.retryAfterSeconds, 'Too many attempts. Please try again shortly.');

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }
  // A form that is not live takes submissions only from its preview page.
  if (!form.live && body?.preview !== true) return NextResponse.json({ error: 'Unknown form.' }, { status: 404 });

  const values = body?.values && typeof body.values === 'object' ? body.values : {};
  const incoming = Array.isArray(body?.files) ? body.files.filter((f) => f && typeof f === 'object') : [];
  const fileFields = new Set(form.sections.flatMap((s) => s.fields).filter((f) => f.type === 'file').map((f) => f.id));
  const files = incoming.map((f) => ({
    field: String(f.field || ''),
    name: String(f.name || '').replace(/[\\/\r\n"]/g, '_').slice(0, 200),
    type: String(f.type || 'application/octet-stream').slice(0, 120),
    base64: String(f.base64 || ''),
  }));
  if (files.some((f) => !fileFields.has(f.field) || !f.name || !BASE64.test(f.base64))) {
    return NextResponse.json({ error: 'One of the attached files could not be read. Please attach it again.' }, { status: 400 });
  }
  const fileInfo = files.map((f) => ({ field: f.field, name: f.name, size: Math.floor((f.base64.length * 3) / 4) }));

  const problems = checkForm(form, values, fileInfo);
  if (values.agree !== true) problems.push('Tick the agreement');
  const signedName = String(values.signedName || '').trim();
  if (!signedName) problems.push('Type your full name under the signature');
  const signature = typeof values.signature === 'string' ? values.signature : '';
  if (!signature.startsWith('data:image/png;base64,')) problems.push('Sign in the box');
  if (signature.length > MAX_SIGNATURE_LENGTH) problems.push('That signature is too large. Please clear it and sign again');
  if (problems.length) return NextResponse.json({ error: `${problems.join('. ')}.`, problems }, { status: 400 });
  if (fileInfo.some((f) => !FILE_RULES.extensions.includes(fileExtension(f.name)))) {
    return NextResponse.json({ error: 'That file type is not accepted.' }, { status: 400 });
  }

  // The keyless spam guard (hidden field and timer only: a form full of names and
  // addresses would trip the text rules), then Turnstile.
  const guard = body?.guard && typeof body.guard === 'object' ? body.guard : {};
  const verdict = checkSubmission({ trap: guard[TRAP_FIELD], started: guard[STARTED_FIELD] });
  if (verdict.spam) {
    console.warn('Form looked like spam', form.key, verdict.reasons.join(','), ip);
    return NextResponse.json({ ok: true, reference: '' });
  }
  const human = await verifyTurnstile(body?.turnstileToken, ip);
  if (!human.ok) {
    console.warn('Form failed Turnstile', form.key, human.reason);
    return NextResponse.json({ error: TURNSTILE_FAILED_MESSAGE }, { status: 400 });
  }

  const who = identity(form, values);
  const data = cleanValues(form, values);
  try {
    const saved = await submitForm(
      {
        form_key: form.key,
        form_title: form.title,
        form_version: form.version,
        reference_prefix: form.referencePrefix,
        name: who.name || signedName,
        email: who.email,
        company: who.company || undefined,
        phone: who.phone || undefined,
        data,
        summary: summarise(form, data, fileInfo),
        terms_version: agreementVersion(form, TERMS_VERSION),
        terms_title: termsTitle(form, values, TERMS_VERSION),
        signed_name: signedName,
        signature_png: signature,
        files: files.map((f) => ({ field: f.field, filename: f.name, content_type: f.type, content_base64: f.base64 })),
      },
      ip,
      req.headers.get('user-agent')
    );
    return NextResponse.json({ ok: true, reference: saved?.reference || '' });
  } catch (error) {
    const status = error instanceof ApiError ? error.status : 0;
    // The answers are not logged: they hold contacts, voice codes and a signature.
    console.error('Form could not be sent to the backend', form.key, status, error instanceof Error ? error.message : error);
    return NextResponse.json({ error: 'We could not send that just now. Please email us and we will take it from there.' }, { status: 502 });
  }
}
