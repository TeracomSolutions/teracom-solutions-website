import { NextResponse } from 'next/server';

import { createEstimate, listEstimates } from '@/lib/api/customerEstimates';
import { getAllProducts } from '@/lib/catalogue';
import { priceEstimate } from '@/lib/estimatorPricing';
import { backendError, noStore, sameOrigin, signedInCustomer } from '@/lib/estimatorRoute';

// The signed-in customer's saved estimates (Robert, 20 November 2026).
export async function GET() {
  const who = await signedInCustomer();
  if (who.error) return who.error;
  try {
    return NextResponse.json(await listEstimates(who.token), { headers: noStore });
  } catch (err) {
    return backendError(err, 'Your estimates could not be loaded.');
  }
}

export async function POST(req) {
  if (!sameOrigin(req)) return NextResponse.json({ error: 'Not allowed' }, { status: 403 });
  const who = await signedInCustomer();
  if (who.error) return who.error;
  const body = await req.json().catch(() => null);
  if (!body?.estimate) return NextResponse.json({ error: 'The estimate could not be read.' }, { status: 400 });
  const priced = priceEstimate(body.estimate, await getAllProducts(), who.pricing);
  try {
    return NextResponse.json(await createEstimate(who.token, priced), { headers: noStore });
  } catch (err) {
    return backendError(err, 'The estimate could not be saved.');
  }
}

export const dynamic = 'force-dynamic';
