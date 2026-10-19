import Link from 'next/link';
import { redirect } from 'next/navigation';

import AdminShell from '@/components/AdminShell';
import AdminStoreTabs from '@/components/AdminStoreTabs';
import AdminTestTools from '@/components/AdminTestTools';

import { isSessionError, requireAdminToken } from '@/lib/adminPage';
import { fetchScenarios, fetchTestRecords } from '@/lib/api/adminTestTools';

export const metadata = {
  title: 'Test tools|Teracom Solutions',
};

// Test tools page.
export default async function AdminTestToolsPage() {
  const token = await requireAdminToken();

  let scenarioInfo = null;
  let recordsInfo = null;
  let loadError = null;

  try {
    [scenarioInfo, recordsInfo] = await Promise.all([
      fetchScenarios(token),
      fetchTestRecords(token),
    ]);
  } catch (err) {
    if (isSessionError(err)) redirect('/admin/login');
    loadError = 'Unable to load the test tools from the backend.';
  }

  return (
    <AdminShell>
      <p className="admin-muted">
        <Link href="/admin/orders" className="admin-link">&larr; Orders</Link>
      </p>
      <h1 className="admin-heading">Test tools</h1>
      <p className="lead">Try the whole order flow without a real purchase, then clean up what it made.</p>
      <AdminStoreTabs />

      {loadError && <p className="form-error" role="alert">{loadError}</p>}

      {!loadError && <AdminTestTools scenarioInfo={scenarioInfo} recordsInfo={recordsInfo} />}
    </AdminShell>
  );
}