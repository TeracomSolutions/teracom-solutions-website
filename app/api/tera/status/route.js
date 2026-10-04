import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { getCurrentCustomer } from '@/lib/api/customerAuth';
import { CUSTOMER_ACCESS_TOKEN_COOKIE } from '@/lib/customerSession';

// Whether the visitor is signed in, so the Ask Tera window can offer the
// chat or ask them to sign in. Read when the window opens, so pages stay
// cacheable.
export async function GET() {
  const token = (await cookies()).get(CUSTOMER_ACCESS_TOKEN_COOKIE)?.value;
  if (!token) return NextResponse.json({ signedIn: false });
  try {
    const customer = await getCurrentCustomer(token);
    return NextResponse.json({ signedIn: true, firstName: customer?.first_name || '' });
  } catch {
    return NextResponse.json({ signedIn: false });
  }
}