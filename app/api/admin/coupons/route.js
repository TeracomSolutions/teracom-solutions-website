import { NextResponse } from 'next/server';
import { z } from 'zod';

import { createCoupon, listCoupons, updateCoupon } from '@/lib/api/adminCoupons';
import { ApiError } from '@/lib/api/client';
import { adminSessionToken, staffSessionIsValid } from '@/lib/adminApi';
import { staffMe } from '@/lib/api/adminAuth';
import { levelAllows, sectionLevel } from '@/lib/staffAccessRules';

// Staff-only. The service token that reaches the backend lives on the server;
// a signed-in staff session is what authorises using it. A browser never sees
// the token, and someone without a staff session cannot reach these routes at
// all -- which matters because this endpoint mints discounts.

const CouponCreate = z.object({
  code: z.string().min(1).max(40),
  label: z.string().min(1).max(120),
  discount_type: z.enum(['percent', 'fixed']),
  discount_value: z.number().int().positive(),
  max_discount_cents: z.number().int().positive().nullable().optional(),
  min_subtotal_cents: z.number().int().positive().nullable().optional(),
  expires_at: z.string().nullable().optional(),
  max_redemptions: z.number().int().positive().nullable().optional(),
  max_per_customer: z.number().int().positive().nullable().optional(),
  restricted_to_tier: z.enum(['Silver', 'Gold', 'Platinum']).nullable().optional(),
  internal_note: z.string().max(500).nullable().optional(),
});

const CouponUpdate = z.object({
  code: z.string().min(1).max(40),
  active: z.boolean().optional(),
  label: z.string().trim().min(1).max(120).optional(),
  internal_note: z.string().max(500).nullable().optional(),
  expires_at: z.string().nullable().optional(),
  max_redemptions: z.number().int().positive().nullable().optional(),
  max_per_customer: z.number().int().positive().nullable().optional(),
  max_discount_cents: z.number().int().positive().nullable().optional(),
  min_subtotal_cents: z.number().int().positive().nullable().optional(),
}).refine(d => Object.keys(d).length > 1, { message: 'Nothing to change.' });

async function requireStaff() {
  const token = await adminSessionToken();
  return (await staffSessionIsValid(token)) ? token : null;
}

// Coupons reach the backend with the website's service token, so the staff member's own Coupons
// permission is checked here: Read only may list, Read and write may also create and change.
async function couponAccess(needed) {
  const token = await requireStaff();
  if (!token) return NextResponse.json({ error: 'Not signed in.' }, { status: 401 });
  let me = null;
  try {
    me = await staffMe(token);
  } catch {
    me = null;
  }
  if (!levelAllows(sectionLevel(me, 'coupons'), needed)) {
    return NextResponse.json({ error: needed === 'read' ? 'You do not have access to Coupons.' : 'You can look at Coupons but not change them.' }, { status: 403 });
  }
  return null;
}

export async function GET() {
  const refused = await couponAccess('read');
  if (refused) return refused;
  try {
    return NextResponse.json(await listCoupons());
  } catch (err) {
    console.error('Could not list coupons', err instanceof ApiError ? err.status : err);
    return NextResponse.json({ error: 'Could not reach the coupon service.' }, { status: 502 });
  }
}

export async function POST(req) {
  const refused = await couponAccess('write');
  if (refused) return refused;

  const parsed = CouponCreate.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return NextResponse.json(
      { error: `${first.path.join('.') || 'request'}: ${first.message}` },
      { status: 400 }
    );
  }

  try {
    return NextResponse.json(await createCoupon(parsed.data), { status: 201 });
  } catch (err) {
    if (err instanceof ApiError) {
      // 409 means the code already exists. Saying so plainly beats a generic
      // failure, because the obvious next move is to pick another code.
      const message =
        err.status === 409
          ? 'That code already exists. Choose a different one.'
          : err.details?.detail || 'The coupon service rejected that.';
      return NextResponse.json({ error: message }, { status: err.status === 409 ? 409 : 400 });
    }
    return NextResponse.json({ error: 'Could not reach the coupon service.' }, { status: 502 });
  }
}

export async function PATCH(req) {
  const refused = await couponAccess('write');
  if (refused) return refused;

  const parsed = CouponUpdate.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  try {
    const { code, ...rest } = parsed.data;
    return NextResponse.json(await updateCoupon(code, rest));
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) {
      return NextResponse.json({ error: 'No such code.' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Could not reach the coupon service.' }, { status: 502 });
  }
}
