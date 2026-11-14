import { BRAND, retitle } from '@/lib/brand';

import AdminDashboard from '@/components/AdminDashboard';
import AdminHelpIcon from '@/components/AdminHelpIcon';
import AdminShell from '@/components/AdminShell';
import { requireAdminToken } from '@/lib/adminPage';

export const metadata = {
  title: retitle('Dashboard|Teracom Solutions', BRAND),
};

export default async function AdminDashboardPage() {
  await requireAdminToken();

  return (
    <AdminShell>
      <h1 className="admin-heading">
        Dashboard <AdminHelpIcon>
          <h4>What this page is for</h4>
          <p>Seeing at a glance that the platform is healthy, and where to look when it is not. Overview is the map of every area; Dashboard is the health of each one.</p>

          <h4>How to read it</h4>
          <ul>
            <li><strong>Green</strong>: healthy, nothing to do.</li>
            <li><strong>Amber</strong>: working, with something to look at, such as leads waiting or reports to review.</li>
            <li><strong>Red</strong>: a problem, such as a failing connection, failed jobs or a failed backup.</li>
            <li>Each tile says why in one line and shows two or three numbers. Click a tile to open that area.</li>
          </ul>

          <h4>Things to know</h4>
          <p>It checks again every minute while the page is open, or press Refresh. A grey tile could not be read just then; the others still show. You can also ask Tera &quot;is everything healthy?&quot; from any page.</p>
        </AdminHelpIcon>
      </h1>

      <p className="lead">The health of every area at a glance. Click a tile to open it.</p>

      <AdminDashboard />
    </AdminShell>
  );
}
