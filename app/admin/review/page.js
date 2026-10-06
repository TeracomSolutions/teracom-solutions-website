import { redirect } from 'next/navigation';

import AdminHelpIcon from '@/components/AdminHelpIcon';
import AdminReview from '@/components/AdminReview';
import AdminShell from '@/components/AdminShell';
import AdminStoreTabs from '@/components/AdminStoreTabs';
import { listHolds } from '@/lib/api/adminHolds';
import { isSessionError, requireAdminToken } from '@/lib/adminPage';

export const metadata = {
  title: 'Needs review|Teracom Solutions',
};

export default async function AdminReviewPage() {
  const token = await requireAdminToken();

  let initial = { total: 0, counts: {}, holds: [] };
  let loadError = '';
  try {
    initial = await listHolds(token, 'pending');
  } catch (err) {
    if (isSessionError(err)) redirect('/admin/login');
    loadError = 'Unable to load the list from the backend.';
  }

  return (
    <AdminShell>
      <h1 className="admin-heading">
        Store
        <AdminHelpIcon>
          <h4>What this page is for</h4>
          <p>When a supplier&apos;s price list is imported, any row whose <strong>recommended price is below its cost</strong> is held here instead of going into the store, until you say what to do with it. The recommended price includes GST, so it is compared with the cost after taking GST off. Your own selling prices are always the cost plus your markup, so a low recommended price in a supplier&apos;s list does not make you sell below cost; it usually means the supplier&apos;s list price is out of date or wrong.</p>
          <h4>What you can do</h4>
          <ul>
            <li><strong>Import anyway</strong> puts the row into the store exactly as the supplier sent it. The same price and cost in a later price list will then import without being held.</li>
            <li><strong>Leave out</strong> keeps the row out of the store. A product already in the store is not updated from the price list until its price or cost changes. The same price and cost in a later price list is left out quietly.</li>
            <li>Tick several rows and use <strong>Leave selected out</strong> or <strong>Import selected anyway</strong> to decide them together.</li>
            <li>If a later price list has a different price or cost for a row you decided on, it comes back here to be decided again. If a later list no longer has it below cost, it is cleared by itself.</li>
          </ul>
          <h4>The tabs</h4>
          <p><strong>Waiting for a decision</strong> is the list to work through. <strong>Left out</strong> and <strong>Imported anyway</strong> are what has already been decided. The number beside Needs review in the Store tabs is how many are waiting.</p>
        </AdminHelpIcon>
      </h1>
      <AdminStoreTabs />
      <p className="lead">Price list rows held back because their recommended price is below cost, waiting for you to decide.</p>

      {loadError ? <p className="form-error" role="alert">{loadError}</p> : <AdminReview initial={initial} />}
    </AdminShell>
  );
}