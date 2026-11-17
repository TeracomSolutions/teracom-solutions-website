import { BRAND, retitle } from '@/lib/brand';
import { redirect } from 'next/navigation';

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
      <h1 className="admin-heading">Sales</h1>
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