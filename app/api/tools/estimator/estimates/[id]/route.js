import { NextResponse } from 'next/server';

import { deleteEstimate, getEstimate, updateEstimate } from '@/lib/api/customerEstimates';
import { getAllProducts } from '@/lib/catalogue';
import { priceEstimate } from '@/lib/estimatorPricing';
import { backendError, noStore, sameOrigin, signedInCustomer } from '@/lib/estimatorRoute';
import { checkSharedRateLimit, rateLimitResponse } from '@/lib/rateLimit';

// The backend keeps up to 400 KB per estimate (security review 2026-11-20).
const MAX_BODY = 450_000;

// One of the signed-in customer's estimates. Opening it prices the materials again, so
// the customer always sees today's price for each store product.
export async function GET(req, { params }) {
  const { id } = await params;
  const who = await signedInCustomer();
  if (who.error) return who.error;
  try {
    const saved = await getEstimate(who.token, id);
    const priced = priceEstimate(saved.data, await getAllProducts(), who.pricing);
    return NextResponse.json({ ...saved, data: priced }, { headers: noStore });
  } catch (err) {
    return backendError(err, 'That estimate could not be opened.');
  }
}

export async function PUT(req, { params }) {
  if (!sameOrigin(req)) return NextResponse.json({ error: 'Not allowed' }, { status: 403 });
  const { id } = await params;
  const who = await signedInCustomer();
  if (who.error) return who.error;
  if (Number(req.headers.get('content-length') || 0) > MAX_BODY) {
    return NextResponse.json({ error: 'This estimate is too large to save. Split it into two estimates.' }, { status: 413 });
  }
  const saves = await checkSharedRateLimit(`estimator-save:${who.customer.id}`, { maxAttempts: 60, windowMs: 600_000 });
  if (!saves.allowed) return rateLimitResponse(saves.retryAfterSeconds, 'Too many saves at once. Try again in a few minutes.');
  const body = await req.json().catch(() => null);
  if (!body?.estimate) return NextResponse.json({ error: 'The estimate could not be read.' }, { status: 400 });
  const priced = priceEstimate(body.estimate, await getAllProducts(), who.pricing);
  try {
    return NextResponse.json(await updateEstimate(who.token, id, priced), { headers: noStore });
  } catch (err) {
    return backendError(err, 'The estimate could not be saved.');
  }
}

export async function DELETE(req, { params }) {
  if (!sameOrigin(req)) return NextResponse.json({ error: 'Not allowed' }, { status: 403 });
  const { id } = await params;
  const who = await signedInCustomer();
  if (who.error) return who.error;
  try {
    return NextResponse.json(await deleteEstimate(who.token, id), { headers: noStore });
  } catch (err) {
    return backendError(err, 'That estimate could not be deleted.');
  }
}

export const dynamic = 'force-dynamic';
