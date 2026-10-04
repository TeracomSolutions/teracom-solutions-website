// Server-only. Who is asking Tera: a customer signed in to the website, or
// a staff member signed in to the console (Robert, 2026-10-04: "available
// once anybody's signed in"). A customer session wins when there are both.
if (typeof window !== 'undefined') {
  throw new Error('lib/teraSession.js must only be used on the server.');
}

import { cookies } from 'next/headers';

import { adminSessionToken } from '@/lib/adminApi';
import { CUSTOMER_ACCESS_TOKEN_COOKIE } from '@/lib/customerSession';

// { kind: 'customer' | 'staff', token } or null when nobody is signed in.
export async function teraAsker() {
  const customerToken = (await cookies()).get(CUSTOMER_ACCESS_TOKEN_COOKIE)?.value;
  if (customerToken) return { kind: 'customer', token: customerToken };
  const staffToken = await adminSessionToken();
  if (staffToken) return { kind: 'staff', token: staffToken };
  return null;
}