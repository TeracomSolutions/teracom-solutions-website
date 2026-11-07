import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { ApiError } from '@/lib/api/client';
import { updateCustomerPreferences } from '@/lib/api/customerAuth';
import { CUSTOMER_ACCESS_TOKEN_COOKIE } from '@/lib/customerSession';

// The account page saves the customer's email topics, role, phone and company.
const Preferences = z.object({
  email_topics: z.array(z.string().max(40)).max(10),
  customer_role: z.string().max(40).nullable().optional(),
  industry: z.string().max(40).nullable().optional(),
  phone: z.string().max(40).optional(),
  company: z.string().max(255).optional(),
});

export async function PUT(req) {
  const token = (await cookies()).get(CUSTOMER_ACCESS_TOKEN_COOKIE)?.value;
  if (!token) return NextResponse.json({ error: 'Sign in again to change your preferences.' }, { status: 401 });
  const parsed = Preferences.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Those preferences could not be read.' }, { status: 400 });
  try {
    return NextResponse.json(await updateCustomerPreferences(token, parsed.data));
  } catch (err) {
    if (err instanceof ApiError) {
      const detail = Array.isArray(err.body?.detail) ? err.body.detail[0]?.msg : err.message;
      return NextResponse.json({ error: String(detail || 'Your preferences could not be saved.').replace(/^Value error, /, '') }, { status: err.status || 400 });
    }
    return NextResponse.json({ error: 'Unable to reach the account service.' }, { status: 502 });
  }
}
