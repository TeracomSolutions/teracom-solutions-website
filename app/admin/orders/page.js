import Link from 'next/link';
import { redirect } from 'next/navigation';

import AdminShell from '@/components/AdminShell';
import AdminStoreTabs from '@/components/AdminStoreTabs';
import AdminOrderBanner from '@/components/AdminOrderBanner';

import { isSessionError, requireAdminToken } from '@/lib/adminPage';
import { fetchOrders, fetchOrderBanner, fetchOrderAlerts } from '@/lib/api/adminOrders';
import { formatDateTime } from '@/lib/adminFormat';

import {
  orderStatusLabel,
  orderStatusTone,
  cents,
  buildOrdersQuery,
  pageToSkip,
  PAGE_SIZE,
  alertTone,
  stepLabel,
  statusLabel
} from '@/lib/orderView';

export const metadata = {
  title: 'Orders|Teracom Solutions',
};

export default async function AdminOrdersPage({ searchParams }) {
  const params = await searchParams;
  const { status = '', mode = '', q = '', page = '0' } = params;

  const token = await requireAdminToken();

  let orders = [];
  let banner = null;
  let alerts = [];
  let total = 0;
  let loadError = '';

  try {
    const [ordersData, bannerData, alertsData] = await Promise.all([
      fetchOrders(token, { status, mode, q, skip: pageToSkip(page), limit: PAGE_SIZE }),
      fetchOrderBanner(token),
      fetchOrderAlerts(token)
    ]);

    orders = ordersData.orders || [];
    total = ordersData.total || 0;
    banner = bannerData.banner || null;
    alerts = alertsData.alerts || [];
  } catch (err) {
    if (isSessionError(err)) redirect('/admin/login');
    loadError = 'Unable to load the orders from the backend.';
  }

  return (
    <AdminShell>
      <AdminStoreTabs />

      <h1 className="admin-heading">Orders</h1>
      <p className="lead">Every paid order, the steps to Zoho Books, and what needs you.</p>

      <p className="admin-muted"><Link href="/admin/orders/test-tools" className="admin-link">Test tools</Link> (make a test order, clean up test records)</p>      {banner && <AdminOrderBanner banner={banner} counts={banner.counts} />}

      {alerts.length > 0 && (
        <section className="admin-card">
          <h2>Needs attention</h2>
          <ul>
            {alerts.map(alert => (
              <li key={alert.order_id} className={`form-error ${alertTone(alert.severity)}`}>
                {alert.message}
                <Link href={`/admin/orders/${alert.order_id}`} className="admin-link">View order</Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <form method="get" className="admin-form">
        <div>
          <label htmlFor="status">Status</label>
          <select id="status" name="status">
            <option value="">All</option>
            <option value="recorded">Recorded</option>
            <option value="in_progress">In Progress</option>
            <option value="attention">Attention</option>
            <option value="complete">Complete</option>
          </select>
        </div>

        <div>
          <label htmlFor="mode">Mode</label>
          <select id="mode" name="mode">
            <option value="">All</option>
            <option value="preview">Preview</option>
            <option value="test">Test</option>
            <option value="live">Live</option>
          </select>
        </div>

        <div>
          <label htmlFor="q">Search</label>
          <input type="text" id="q" name="q" defaultValue={q} />
        </div>

        <button type="submit" className="btn btn-primary">Filter</button>
      </form>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Mode</th>
              <th>Status</th>
              <th>Steps</th>
              <th>Open</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="7">No orders found.</td>
              </tr>
            ) : (
              orders.map(order => (
                <tr key={order.id}>
                  <td>{formatDateTime(order.created_at)}</td>
                  <td>{order.name || order.email}</td>
                  <td>{cents(order.total_cents)}</td>
                  <td>{order.mode}</td>
                  <td className={`admin-status is-${orderStatusTone(order.status)}`}>
                    {orderStatusLabel(order.status)}
                  </td>
                  <td>
                    {Object.entries(order.steps || {}).map(([step, status]) => (
                      <span key={step} className="admin-muted">
                        {stepLabel(step)} {statusLabel(status)}
                      </span>
                    ))}
                  </td>
                  <td>
                    <Link href={`/admin/orders/${order.id}`} className="admin-link">Open</Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {total > 0 && (
        <div className="admin-actions">
          {page > '0' && (
            <Link href={buildOrdersQuery({ status, mode, q, page: parseInt(page) - 1 })} className="btn btn-secondary btn-sm">Previous</Link>
          )}

          {orders.length === PAGE_SIZE && (
            <Link href={buildOrdersQuery({ status, mode, q, page: parseInt(page) + 1 })} className="btn btn-secondary btn-sm">Next</Link>
          )}
        </div>
      )}

      {loadError && (
        <p className="form-error" role="alert">{loadError}</p>
      )}
    </AdminShell>
  );
}