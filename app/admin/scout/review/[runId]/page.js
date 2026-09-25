import Link from 'next/link';
import { redirect } from 'next/navigation';

import AdminReviewRunDetail from '@/components/AdminReviewRunDetail';
import AdminShell from '@/components/AdminShell';
import { fetchResearchRun } from '@/lib/api/adminScout';
import { isSessionError, requireAdminToken } from '@/lib/adminPage';

export const metadata = {
  title: 'Scout Research Run|Teracom Solutions',
};

export default async function AdminReviewRunPage({ params }) {
  const token = await requireAdminToken();
  const { runId } = await params;

  let run = null;
  let loadError = null;

  try {
    run = await fetchResearchRun(token, runId);
  } catch (err) {
    if (isSessionError(err)) {
      redirect('/admin/login');
    }
    loadError = err.status === 404 ? 'Research run not found.' : 'Unable to load this research run.';
  }

  return (
    <AdminShell>
      <p className="admin-muted"><Link href="/admin/scout?tab=review" className="admin-link">&larr; Review Queue</Link></p>
      {loadError ? <p className="form-error" role="alert">{loadError}</p> : <AdminReviewRunDetail run={run} />}
    </AdminShell>
  );
}
