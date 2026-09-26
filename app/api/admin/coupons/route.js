import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { z } from 'zod';

import { createCoupon, listCoupons, updateCoupon } from '@/lib/api/adminCoupons';
import { ApiError } from '@/lib/api/client';
import { ACCESS_TOKEN_COOKIE } from '@/lib/adminSession';

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
  active: z.boolean(),
});

async function requireStaff() {
  const token = (await cookies()).get(ACCESS_TOKEN_COOKIE)?.value;
  return token || null;
}

export async function GET() {
  if (!(await requireStaff())) {
    return NextResponse.json({ error: 'Not signed in.' }, { status: 401 });
  }
  try {
    return NextResponse.json(await listCoupons());
  } catch (err) {
    console.error('Could not list coupons', err instanceof ApiError ? err.status : err);
    return NextResponse.json({ error: 'Could not reach the coupon service.' }, { status: 502 });
  }
}

export async function POST(req) {
  if (!(await requireStaff())) {
    return NextResponse.json({ error: 'Not signed in.' }, { status: 401 });
  }

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
  if (!(await requireStaff())) {
    return NextResponse.json({ error: 'Not signed in.' }, { status: 401 });
  }

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
