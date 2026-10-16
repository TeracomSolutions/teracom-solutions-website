import { redirect } from 'next/navigation';
import AdminActivity from '@/components/AdminActivity';
import AdminHelpIcon from '@/components/AdminHelpIcon';
import AdminShell from '@/components/AdminShell';
import { fetchActivity, fetchActivityTypes, fetchJobLogs } from '@/lib/api/adminActivity';
import { isSessionError, requireAdminToken } from '@/lib/adminPage';

export const metadata = {
  title: 'Activity|Teracom Solutions',
};

export default async function AdminActivityPage() {
  const token = await requireAdminToken();

  let initial = { rows: [], next_before: null, types: [], logs: [] };
  let loadError = '';

  try {
    const [activity, types, logs] = await Promise.all([
      fetchActivity(token, { limit: 50 }),
      fetchActivityTypes(token),
      fetchJobLogs(token)
    ]);

    initial = {
      rows: activity.rows || [],
      next_before: activity.next_before || null,
      types: types.types || [],
      logs: logs.logs || []
    };
  } catch (err) {
    if (isSessionError(err)) {
      redirect('/admin/login');
    } else {
      loadError = 'Unable to load the activity from the backend.';
    }
  }

  return (
    <AdminShell>
      <h1 className="admin-heading">
        Activity <AdminHelpIcon>
          <h4>What this page is for</h4>
          <p>
            Everything staff and the system did, newest first: imports, uploads,
            publishing, price changes, questions put to the assistant and more.
            Use it to see exactly what happened, and when, while looking into a problem.
          </p>

          <h4>How to read it</h4>
          <ul>
            <li>
              Each row says who did it and what.
            </li>
            <li>
              Press Details on a row to see everything recorded about it, with passwords and keys hidden.
            </li>
            <li>
              Search finds a product, file, supplier or person in any row.
            </li>
            <li>
              Job logs shows the end of the log of each background job (Google Analytics,
              Google Shopping, photos and text, price feeds and so on), for when a job
              did not do what it should.
            </li>
          </ul>

          <h4>Things to know</h4>
          <p>
            The System tab lists what the system did by itself: each background job started, the Google jobs finishing or failing, and server errors. It starts empty and fills as jobs run.
          </p>
          <p>
            Anyone with this page open can read it, so nothing secret is shown.
          </p>
        </AdminHelpIcon>
      </h1>

      <p className="lead">
        What staff and the system did, and how the background jobs are going.
      </p>

      {loadError ? (
        <p className="form-error" role="alert">
          {loadError}
        </p>
      ) : (
        <AdminActivity initial={initial} />
      )}
    </AdminShell>
  );
}