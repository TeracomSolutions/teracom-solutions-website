import { BRAND, retitle } from '@/lib/brand';
import { redirect } from 'next/navigation';
import AdminShell from '@/components/AdminShell';
import AdminSeoTabs from '@/components/AdminSeoTabs';
import AdminHelpIcon from '@/components/AdminHelpIcon';
import AdminSeoAnalytics from '@/components/AdminSeoAnalytics';
import { isSessionError, requireAdminToken } from '@/lib/adminPage';
import { fetchAnalytics } from '@/lib/api/adminSeoInsights';

export const metadata = {
  title: retitle('Website Data analytics|Teracom Solutions', BRAND),
};

async function AdminSeoAnalyticsPage() {
  const token = await requireAdminToken();

  let initial = { connected: false, email: '', snapshot: null, status: {} };

  try {
    initial = await fetchAnalytics(token);
  } catch (error) {
    if (isSessionError(error)) {
      redirect('/admin/login');
    }
    // For other errors, we'll show a message in the UI
  }

  return (
    <AdminShell>
      <h1 className="admin-heading">
        Website Data
        <AdminHelpIcon>
          <h4>What this page shows</h4>
          <p>
            This page shows figures from Google Analytics, pulled once a day.
            Pull the figures now pulls them again.
          </p>

          <h4>Four numbers at the top</h4>
          <p>
            These show visits, visitors, orders and sales over the last 28 days
            against the 28 before.
          </p>

          <h4>The funnel</h4>
          <p>
            The funnel shows how shoppers move from product views to bought.
            A big drop between two steps is where shoppers are lost.
          </p>

          <h4>Visit sources</h4>
          <p>
            These show where visitors come from - Google search, direct, email,
            social and so on.
          </p>

          <h4>Pages that bring visits</h4>
          <p>
            This table shows the pages that bring visits. It shows what Google
            Search showed for each.
          </p>

          <h4>What people search for</h4>
          <p>
            This shows what people search for in the store.
          </p>

          <h4>Not set up?</h4>
          <p>
            If this page says it is not set up, the steps shown on it connect
            Google Analytics once.
          </p>
        </AdminHelpIcon>
      </h1>
      <p className="lead">
        How shoppers move through the store and which pages bring orders, from Google Analytics.
      </p>

      <AdminSeoTabs active="analytics" />

      <AdminSeoAnalytics initial={initial} />
    </AdminShell>
  );
}

export default AdminSeoAnalyticsPage;