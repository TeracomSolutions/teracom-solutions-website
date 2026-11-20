import { BRAND, retitle } from '@/lib/brand';

import AdminHelpIcon from '@/components/AdminHelpIcon';
import AdminReports from '@/components/AdminReports';
import AdminShell from '@/components/AdminShell';
import { requireAdminToken } from '@/lib/adminPage';

export const metadata = {
  title: retitle('Reports|Teracom Solutions', BRAND),
};

export default async function AdminReportsPage() {
  await requireAdminToken();

  return (
    <AdminShell>
      <h1 className="admin-heading">
        Reports <AdminHelpIcon>
          <h4>What this page is for</h4>
          <p>One place to report on anything in the platform: selling, customers, the store, the website, marketing, the AI and the system itself.</p>
          <h4>How to use it</h4>
          <ul>
            <li>Open a <strong>ready-made</strong> report on the left, or pick the data under <strong>Report on</strong>.</li>
            <li><strong>List rows</strong> shows the records with the columns you tick. <strong>Group and total</strong> counts or adds them up by any column, with dates by day, week, month, quarter or year.</li>
            <li>Add filters and a date range, choose the sort, then <strong>Run</strong>. <strong>CSV</strong> downloads what is shown.</li>
            <li>Name it and press <strong>Save</strong> to keep it in the list on the left.</li>
          </ul>
          <h4>Things to know</h4>
          <p>Passwords, keys, tokens, addresses people signed in from and file contents are never offered. Up to 5,000 rows a report; a report that runs longer than 15 seconds is stopped. Administrators only, and each report run is in the audit log.</p>
        </AdminHelpIcon>
      </h1>
      <p className="lead">Report on anything in the platform, from sales and customers to website visits and the AI.</p>
      <AdminReports />
    </AdminShell>
  );
}
