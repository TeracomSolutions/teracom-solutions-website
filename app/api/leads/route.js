import { NextResponse } from 'next/server';

import { submitLead } from '@/lib/api/leads';
import { ApiError } from '@/lib/api/client';
import { checkRateLimit, clientIpFromRequest } from '@/lib/rateLimit';

// Spam/junk-CRM-data defence, not fraud defence (flagged in
// Repository_Audit_Decision_Memo_V1.md item 6) -- a looser limit than
// checkout's, since a real prospect submitting this form more than once in
// a short window (fixing a typo, trying a different interest) is plausible
// and shouldn't be blocked.
const LEADS_RATE_LIMIT_MAX_ATTEMPTS = Number(process.env.LEADS_RATE_LIMIT_MAX_ATTEMPTS) || 5;
const LEADS_RATE_LIMIT_WINDOW_MS = (Number(process.env.LEADS_RATE_LIMIT_WINDOW_SECONDS) || 600) * 1000;

// "Customer Experience & Commercial Readiness Wave", objectives
// #10-#11 (Contact Sales / Demo Request workflows). Previously this
// route only ever console.log'd a submission and redirected — now it
// calls the real backend (POST /leads/), so a submission is actually
// persisted and staff-visible (GET /staff/leads). Still a plain HTML
// form POST (multipart/form-data), not JSON — the homepage's contact
// form (app/page.js) was never converted to a client component for
// this, so the interface stays exactly what it was.
const INTEREST_TO_INQUIRY_TYPE = {
  'Talk to Sales': 'contact_sales',
  'Request Demo': 'demo_request',
  'Teracom AI': 'securityos',
  'Technical Consulting': 'technical_consulting',
  'Teracom Store': 'store',
  Partnership: 'partnership',
};

export async function POST(req) {
  const rateLimitKey = `leads:${clientIpFromRequest(req)}`;
  const rateLimit = checkRateLimit(rateLimitKey, {
    maxAttempts: LEADS_RATE_LIMIT_MAX_ATTEMPTS,
    windowMs: LEADS_RATE_LIMIT_WINDOW_MS,
  });
  if (!rateLimit.allowed) {
    // Same visitor-facing redirect the backend-call failure path below
    // uses (the homepage only distinguishes lead=received/lead=error) —
    // logged distinctly server-side so the two cases stay distinguishable
    // in the logs even though the visitor sees the same generic message.
    console.warn('Lead submission rate limited', rateLimitKey, `retry after ${rateLimit.retryAfterSeconds}s`);
    return NextResponse.redirect(new URL('/?lead=error#contact', req.url), 303);
  }

  const form = await req.formData();
  const lead = Object.fromEntries(form.entries());

  const inquiryType = INTEREST_TO_INQUIRY_TYPE[lead.interest] || 'platform_question';

  try {
    await submitLead({
      name: lead.name,
      email: lead.email,
      company: lead.company || undefined,
      inquiry_type: inquiryType,
      message: lead.message || undefined,
    });
  } catch (error) {
    // A failed backend call shouldn't strand the visitor on a broken
    // page — redirect back with an error flag rather than a 500; the
    // homepage renders an honest "something went wrong" state for it.
    const status = error instanceof ApiError ? error.status : 0;
    console.error('Lead submission failed', status, error instanceof Error ? error.message : error);
    return NextResponse.redirect(new URL('/?lead=error#contact', req.url), 303);
  }

  return NextResponse.redirect(new URL('/?lead=received#contact', req.url), 303);
}
