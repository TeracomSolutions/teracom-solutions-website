import { BRAND, retitle } from '@/lib/brand';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';

import AdminOrderBanner from '@/components/AdminOrderBanner';
import AdminOrderDetail from '@/components/AdminOrderDetail';
import AdminOrderPurchaseOrders from '@/components/AdminOrderPurchaseOrders';
import AdminShell from '@/components/AdminShell';
import AdminSalesTabs from '@/components/AdminSalesTabs';

import { fetchOrder, fetchOrderBanner } from '@/lib/api/adminOrders';
import { isSessionError, requireAdminToken } from '@/lib/adminPage';
import { fetchPurchaseOrders } from '@/lib/api/adminPurchaseOrders';

export const metadata = {
  title: retitle('Order|Teracom Solutions', BRAND),
};

// One order details page.
export default async function AdminOrderPage({ params }) {
  const token = await requireAdminToken();
  const { orderId } = await params;

  let detail = null;
  let banner = null;
  let loadError = null;

  try {
    [detail, banner] = await Promise.all([
      fetchOrder(token, orderId),
      fetchOrderBanner(token),
    ]);
  } catch (err) {
    if (isSessionError(err)) redirect('/admin/login');
    if (err.status === 404) notFound();
    loadError = 'Unable to load this order from the backend.';
  }

  let purchaseOrders = { purchase_orders: [] };
  try {
    purchaseOrders = await fetchPurchaseOrders(token, orderId);
  } catch (err) {
    purchaseOrders = { purchase_orders: [] };
  }

  return (
    <AdminShell>
      <p className="admin-muted">
        <Link href="/admin/orders" className="admin-link">&larr; Orders</Link>
      </p>
      <h1 className="admin-heading">
        Order <span className="admin-muted">{orderId.substring(0, 12)}</span>
      </h1>
      <AdminSalesTabs />

      <AdminOrderBanner banner={banner?.banner} counts={banner?.counts} />

      {loadError && <p className="form-error" role="alert">{loadError}</p>}

      {!loadError && detail && <AdminOrderDetail detail={detail} />}
      <AdminOrderPurchaseOrders orderId={orderId} initial={purchaseOrders} />
    </AdminShell>
  );
}