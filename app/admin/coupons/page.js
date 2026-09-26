import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { listCoupons } from '@/lib/api/adminCoupons';
import { ACCESS_TOKEN_COOKIE } from '@/lib/adminSession';
import AdminCouponManager from '@/components/AdminCouponManager';
import AdminNav from '@/components/AdminNav';
import AdminBrand from '@/components/AdminBrand';

export const metadata = {
  title: 'Discount Codes|Teracom Solutions',
};

export default async function AdminCouponsPage() {
  const token = (await cookies()).get(ACCESS_TOKEN_COOKIE)?.value;

  if (!token) {
    redirect('/admin/login');
  }

  let coupons = [];
  try {
    const data = await listCoupons();
    coupons = data.coupons || [];
  } catch {
    // Render the page with an empty list rather than failing outright: the
    // create form still works once the backend is reachable, and the client
    // refetches on mount.
    coupons = [];
  }

  return (
    <main id="main-content">
      <section className="section section-spacious">
        <div className="container">
          <AdminBrand />
          <AdminNav />
          <h1>Discount codes</h1>
          <p className="lead">
            Create a code a customer can type in the cart. The discount is worked out here, not by
            Stripe -- Stripe is only told the amount.
          </p>

          <AdminCouponManager initialCoupons={coupons} />
        </div>
      </section>
    </main>
  );
}
