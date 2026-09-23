import { NextResponse } from 'next/server';

import { ApiError } from '@/lib/api/client';
import { submitLead } from '@/lib/api/leads';
import { checkRateLimit, clientIpFromRequest, rateLimitResponse } from '@/lib/rateLimit';
import { findRequestForm, formatSubmission, valueFields } from '@/lib/requestForms';
import { TURNSTILE_FAILED_MESSAGE, verifyTurnstile } from '@/lib/turnstile';

// Service and password-reset requests.
//
// These go through the same /leads/ endpoint the contact form uses rather
// than a new one. A request for a technician IS a lead, staff already have a
// place to read those, and inventing a second inbox means a second inbox
// somebody forgets to check.
//
// NOTE FOR WHOEVER OWNS THE BACKEND: inquiry_type now includes
// 'service_request' and 'password_reset'. If that field is a closed
// enumeration, those two values need adding or these submissions will be
// rejected.

const RATE_LIMIT_MAX = Number(process.env.REQUESTS_RATE_LIMIT_MAX_ATTEMPTS) || 5;
const RATE_LIMIT_WINDOW_MS = (Number(process.env.REQUESTS_RATE_LIMIT_WINDOW_SECONDS) || 600) * 1000;

export async function POST(req) {
  const rateLimit = checkRateLimit(`requests:${clientIpFromRequest(req)}`, {
    maxAttempts: RATE_LIMIT_MAX,
    windowMs: RATE_LIMIT_WINDOW_MS,
  });
  if (!rateLimit.allowed) {
    return rateLimitResponse(rateLimit.retryAfterSeconds, 'Too many requests. Please try again shortly.');
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const form = findRequestForm(body?.form);
  if (!form) {
    return NextResponse.json({ error: 'Unknown form.' }, { status: 404 });
  }

  const values = body.values && typeof body.values === 'object' ? body.values : {};

  // Server-side validation as well as the browser's: required means required
  // even when someone posts straight at the endpoint.
  const missing = valueFields(form)
    .filter((field) => field.required && !String(values[field.id] || '').trim())
    .map((field) => field.label);
  const missingDeclarations = form.declarations.filter(
    (declaration) => declaration.required && !values[declaration.id]
  );

  if (missing.length > 0 || missingDeclarations.length > 0) {
    // Field labels, not field ids: an error naming "accurate, charges,
    // terms" tells the person nothing about which box they missed.
    const parts = [];
    if (missing.length > 0) parts.push(`please complete ${missing.join(', ')}`);
    if (missingDeclarations.length > 0) {
      parts.push(
        missingDeclarations.length === 1
          ? 'please tick the remaining declaration'
          : `please tick all ${form.declarations.length} declarations`
      );
    }
    const [first, ...rest] = parts;
    const error = `${first.charAt(0).toUpperCase()}${first.slice(1)}${rest.length ? `, and ${rest.join(', ')}` : ''}.`;
    return NextResponse.json({ error }, { status: 400 });
  }

  const human = await verifyTurnstile(body?.turnstileToken, clientIpFromRequest(req));
  if (!human.ok) {
    console.warn('Request failed Turnstile', form.slug, human.reason);
    return NextResponse.json({ error: TURNSTILE_FAILED_MESSAGE }, { status: 400 });
  }

  const message = formatSubmission(form, values);

  try {
    await submitLead({
      name: String(values.name).trim(),
      email: String(values.email).trim(),
      company: String(values.company || '').trim() || undefined,
      inquiry_type: form.inquiryType,
      message,
    });
  } catch (error) {
    const status = error instanceof ApiError ? error.status : 0;
    // Logged in full, deliberately. If delivery fails, the submission still
    // exists somewhere a human can retrieve it rather than being lost
    // because a service was down -- and the customer is told plainly rather
    // than being shown a success page for something that never arrived.
    console.error('Request submission failed', form.slug, status, message);
    return NextResponse.json(
      { error: 'We could not send that just now. Please call us and we will take the details.' },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
