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
      <p className="lead">What was sold, to whom, and what it earned, from live orders only. Test and simulated orders are never counted.</p>
      <AdminSalesDashboard />
      <AdminSalesCarts />
    </AdminShell>
  );
}