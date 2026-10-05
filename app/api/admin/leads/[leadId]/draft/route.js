import { NextResponse } from 'next/server';

import { withAdminSession } from '@/lib/adminApi';
import { discardLeadDraft, redraftLead } from '@/lib/api/adminLeads';

// Tera's draft reply to one enquiry: draft again (POST) or discard (DELETE).
export const POST = withAdminSession(async ({ token, params }) => {
  return NextResponse.json(await redraftLead(token, params.leadId));
});

export const DELETE = withAdminSession(async ({ token, params }) => {
  return NextResponse.json(await discardLeadDraft(token, params.leadId));
});
