import { BRAND, retitle } from '@/lib/brand';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';

import AdminOrderBanner from '@/components/AdminOrderBanner';
import AdminOrderDetail from '@/components/AdminOrderDetail';
import AdminOrderPurchaseOrders from '@/components/AdminOrderPurchaseOrders';
import AdminHelpIcon from '@/components/AdminHelpIcon';
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
        <AdminHelpIcon>
          <h4>What this page is for</h4>
          <p>One order: the customer, delivery address, lines (with the supplier and cost from the price list), where it is up to, and its supplier purchase orders.</p>
          <h4>Moving it on</h4>
          <ol>
            <li>If it says <strong>On hold</strong>, check the payment in Stripe (and with the customer if unsure), then press <strong>I have checked it: release the hold</strong>.</li>
            <li>Under <strong>Order Steps</strong>, for each step in turn press <strong>Prepare</strong>, read <strong>What will be sent</strong>, then <strong>Approve and send to Zoho</strong>. The steps make the customer, the items (sell price and cost), the invoice, mark it sent and record the payment.</li>
            <li>Under <strong>Supplier purchase orders</strong> press <strong>Plan purchase orders</strong>, then <strong>Create in Zoho</strong>: it is made as a draft and stops there. Check the margin, then press <strong>Send to supplier</strong>.</li>
          </ol>
          <p>The supplier comes from the price list. It is linked to its Zoho vendor by name when exactly one vendor matches; otherwise use <strong>Find in Zoho</strong> on the supplier&apos;s Ordering details.</p>
        </AdminHelpIcon>
      </h1>
      <AdminSalesTabs />

      <AdminOrderBanner banner={banner?.banner} counts={banner?.counts} />

      {loadError && <p className="form-error" role="alert">{loadError}</p>}

      {!loadError && detail && <AdminOrderDetail detail={detail} />}
      <div id="purchase-orders">
        <AdminOrderPurchaseOrders orderId={orderId} initial={purchaseOrders} />
      </div>
    </AdminShell>
  );
}