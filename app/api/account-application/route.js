import { NextResponse } from 'next/server';

import { ApiError } from '@/lib/api/client';
import { submitLead } from '@/lib/api/leads';
import { checkRateLimit, clientIpFromRequest, rateLimitResponse } from '@/lib/rateLimit';
import {
  formatApplication,
  missingFrom,
  visibleDeclarations,
  visibleSteps,
} from '@/lib/accountApplication';

// A trade account application.
//
// Sent through the same /leads/ endpoint as every other enquiry, so staff
// read it where they already read everything else.
//
// NOTE FOR WHOEVER OWNS THE BACKEND: inquiry_type 'account_application'. If
// that field is a closed enumeration it needs adding.

const RATE_LIMIT_MAX = Number(process.env.REQUESTS_RATE_LIMIT_MAX_ATTEMPTS) || 5;
const RATE_LIMIT_WINDOW_MS = (Number(process.env.REQUESTS_RATE_LIMIT_WINDOW_SECONDS) || 600) * 1000;

// A drawn signature is a PNG data URL. Generous enough for a real signature,
// small enough that nobody can post a megabyte of anything through it.
const MAX_SIGNATURE_LENGTH = 250_000;

export async function POST(req) {
  const rateLimit = checkRateLimit(`account-application:${clientIpFromRequest(req)}`, {
    maxAttempts: RATE_LIMIT_MAX,
    windowMs: RATE_LIMIT_WINDOW_MS,
  });
  if (!rateLimit.allowed) {
    return rateLimitResponse(rateLimit.retryAfterSeconds, 'Too many attempts. Please try again shortly.');
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const values = body?.values && typeof body.values === 'object' ? body.values : {};
  const directors = Array.isArray(body?.directors) ? body.directors.filter((d) => d && typeof d === 'object') : [];

  // Every step the applicant should have seen, validated server-side. The
  // browser decides what to show; it does not decide what is required.
  const steps = visibleSteps(values);
  const missing = steps.flatMap((step) => missingFrom(step, values, step.repeatable ? directors : []));
  const missingDeclarations = steps.flatMap((step) =>
    visibleDeclarations(step, values).filter((d) => d.required && !values[d.id])
  );

  if (missing.length > 0) {
    return NextResponse.json({ error: `Please complete ${missing.join(', ')}.` }, { status: 400 });
  }
  if (missingDeclarations.length > 0) {
    return NextResponse.json({ error: 'Please tick each declaration before sending.' }, { status: 400 });
  }

  const signature = typeof values.signature === 'string' ? values.signature : '';
  if (!signature.startsWith('data:image/png;base64,')) {
    return NextResponse.json({ error: 'Please sign in the box before sending.' }, { status: 400 });
  }
  if (signature.length > MAX_SIGNATURE_LENGTH) {
    return NextResponse.json({ error: 'That signature is too large. Please clear it and sign again.' }, { status: 400 });
  }

  const name = String(values.signedBy || '').trim();
  const email = String(values.bizEmail || values.p1Email || values.acctEmail || '').trim();
  if (!email) {
    return NextResponse.json({ error: 'We need an email address to reply to.' }, { status: 400 });
  }

  const message = formatApplication(values, directors);

  try {
    await submitLead({
      name,
      email,
      company: String(values.companyName || values.tradingAs || '').trim() || undefined,
      inquiry_type: 'account_application',
      message,
    });
  } catch (error) {
    const status = error instanceof ApiError ? error.status : 0;
    // Logged in full so a delivery failure is recoverable by a human rather
    // than losing an application somebody spent ten minutes on. The
    // signature is deliberately not logged: it is an image of someone's
    // handwriting and it does not belong in a log file.
    console.error('Account application submission failed', status, message);
    return NextResponse.json(
      { error: 'We could not send that just now. Please email us and we will take it from there.' },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
