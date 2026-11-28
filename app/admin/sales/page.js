import { BRAND, retitle } from '@/lib/brand';
import { redirect } from 'next/navigation';

import AdminHelpIcon from '@/components/AdminHelpIcon';
import AdminShell from '@/components/AdminShell';
import AdminSalesTabs from '@/components/AdminSalesTabs';
import AdminSalesDashboard from '@/components/AdminSalesDashboard';
import AdminSalesCarts from '@/components/AdminSalesCarts';

import { isSessionError, requireAdminToken } from '@/lib/adminPage';

export const metadata = {
  title: retitle('Sales|Teracom Solutions', BRAND),
};

// Sales page.
export default async function AdminSalesPage() {
  const token = await requireAdminToken();

  // Handle session errors (redirect to login)
  if (isSessionError(token)) {
    redirect('/admin/login');
  }

  return (
    <AdminShell>
      <AdminSalesTabs />
      <h1 className="admin-heading">
        Sales
        <AdminHelpIcon>
          <h4>What this page is for</h4>
          <p>How the online store is selling: sales with and without GST, orders, the average order, the trend against the period before, orders per day, new and returning customers, the top products, carts and unfinished checkouts, and the latest orders. Pick the period and what to compare it with at the top; <strong>Details</strong> opens the full figures and every table downloads as CSV.</p>
          <h4>Where it comes from</h4>
          <p>Paid website orders recorded from Stripe. Test and simulated orders are never counted. The margin uses the supplier cost saved on each order line; lines without a cost are counted, not guessed.</p>
          <h4>Orders</h4>
          <p>The <strong>Orders</strong> tab lists every order, where each is up to, and lets you send it to Zoho, raise the supplier order and add tracking.</p>
        </AdminHelpIcon>
      </h1>
      <p className="lead">Live orders only; test and simulated orders are never counted. Click any panel for its full figures.</p>
      <AdminSalesDashboard />
      <details id="sales-carts" className="sales-detail">
        <summary>Carts and unfinished checkouts <span className="admin-muted">saved carts, products left behind, expired and failed checkouts, recording switches</span></summary>
        <div className="sales-detail-body">
          <AdminSalesCarts />
        </div>
      </details>
    </AdminShell>
  );
}