import { BRAND, retitle } from '@/lib/brand';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { listCoupons } from '@/lib/api/adminCoupons';
import { ACCESS_TOKEN_COOKIE } from '@/lib/adminSession';
import { staffSessionIsValid } from '@/lib/adminApi';
import { staffMe } from '@/lib/api/adminAuth';
import { levelAllows, sectionLevel } from '@/lib/staffAccessRules';
import AdminCouponManager from '@/components/AdminCouponManager';
import AdminShell from '@/components/AdminShell';

export const metadata = {
  title: retitle('Discount Codes|Teracom Solutions', BRAND),
};

export default async function AdminCouponsPage() {
  const token = (await cookies()).get(ACCESS_TOKEN_COOKIE)?.value;

  if (!token) {
    redirect('/admin/login');
  }

  if (!(await staffSessionIsValid(token))) {
    redirect('/admin/login');
  }

  let me = null;
  try {
    me = await staffMe(token);
  } catch {
    me = null;
  }
  const allowed = levelAllows(sectionLevel(me, 'coupons'), 'read');

  let coupons = [];
  try {
    if (!allowed) throw new Error('no access');
    const data = await listCoupons();
    coupons = data.coupons || [];
  } catch {
    // Render the page with an empty list rather than failing outright: the
    // create form still works once the backend is reachable, and the client
    // refetches on mount.
    coupons = [];
  }

  return (
    <AdminShell>
          <h1>Discount codes</h1>
          <p className="lead">
            Create a code a customer can type in the cart. The discount is worked out here, not by
            Stripe -- Stripe is only told the amount.
          </p>

          {allowed ? <AdminCouponManager initialCoupons={coupons} /> : <p className="form-error" role="alert">You do not have access to Coupons. An Administrator can give it to you under Account.</p>}
    </AdminShell>
  );
}
