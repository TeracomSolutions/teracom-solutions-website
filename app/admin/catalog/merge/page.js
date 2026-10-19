import Link from 'next/link';
import { redirect } from 'next/navigation';

import AdminProductMerge from '@/components/AdminProductMerge';
import AdminShell from '@/components/AdminShell';
import { isSessionError, requireAdminToken } from '@/lib/adminPage';
import { fetchMergeCandidates, fetchMergeHistory } from '@/lib/api/adminProductMerge';

export const metadata = {
  title: 'Merge duplicate products|Teracom Solutions',
};

export default async function AdminProductMergePage() {
  const token = await requireAdminToken();
  let groups = [];
  let history = [];
  let loadError = '';

  try {
    const [candidates, past] = await Promise.all([
      fetchMergeCandidates(token),
      fetchMergeHistory(token),
    ]);
    groups = candidates.groups || [];
    history = Array.isArray(past) ? past : [];
  } catch (err) {
    if (isSessionError(err)) redirect('/admin/login');
    loadError = 'Unable to load the duplicate products from the backend.';
  }

  return (
    <AdminShell>
      <p className="admin-muted"><Link href="/admin/catalog" className="admin-link">Back to the store catalog</Link></p>
      <h1 className="admin-heading">Merge duplicate products</h1>
      <p className="lead">This tool finds products that two suppliers both sell (same brand and maker part number) so one can be kept and the other hidden, one pair at a time, each needing your approval.</p>

      {loadError ? (
        <p className="form-error" role="alert">{loadError}</p>
      ) : (
        <AdminProductMerge groups={groups} history={history} />
      )}
    </AdminShell>
  );
}