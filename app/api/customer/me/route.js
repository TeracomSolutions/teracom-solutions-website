// Returns the currently signed-in customer's details
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { CUSTOMER_ACCESS_TOKEN_COOKIE } from '@/lib/customerSession';
import { getCurrentCustomer } from '@/lib/api/customerAuth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const token = (await cookies()).get(CUSTOMER_ACCESS_TOKEN_COOKIE)?.value;
  let customer = null;

  if (token) {
    try {
      const details = await getCurrentCustomer(token);
      customer = {
        first_name: details.first_name || '',
        email: details.email || ''
      };
    } catch (error) {
      // On any error, leave customer null
      customer = null;
    }
  }

  return NextResponse.json({ customer }, { headers: { 'Cache-Control': 'no-store' } });
}