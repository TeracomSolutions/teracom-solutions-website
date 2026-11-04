import { BRAND, retitle } from '@/lib/brand';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import AdminHelpIcon from '@/components/AdminHelpIcon';
import AdminShell from '@/components/AdminShell';
import { fetchFormSubmissions } from '@/lib/api/forms';
import { isSessionError, requireAdminToken } from '@/lib/adminPage';
import { ONLINE_FORMS } from '@/lib/onlineForms';

export const metadata = {
  title: retitle('Forms|Teracom Solutions', BRAND),
};

const STATUS_LABELS = { new: 'New', in_progress: 'In progress', done: 'Done', cancelled: 'Cancelled' };

const when = (value) =>
  value ? new Date(value).toLocaleString('en-AU', { timeZone: 'Australia/Melbourne', day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' }) : '';

// Forms customers fill in and sign on the website (lib/onlineForms), newest first.
export default async function AdminFormsPage({ searchParams }) {
  const token = await requireAdminToken();
  const search = (await searchParams) || {};
  const formKey = ONLINE_FORMS.some((f) => f.key === search.form) ? search.form : '';
  const status = STATUS_LABELS[search.status] ? search.status : '';
  const q = String(search.q || '').slice(0, 100);

  let rows = [];
  let loadError = null;
  try {
    const data = await fetchFormSubmissions(token, { formKey, status, q });
    rows = data?.submissions || [];
  } catch (err) {
    if (isSessionError(err)) redirect('/admin/login');
    loadError = 'Unable to load the forms from the backend.';
  }

  return (
    <AdminShell>
      <h1 className="admin-heading">
        Forms
        <AdminHelpIcon>
          <h4>What this section is for</h4>
          <p>Forms customers fill in and sign on the website, such as the monitoring commissioning form, newest first.</p>
          <ul>
            <li><strong>Reference</strong> - what the customer was given and quotes back, such as MC-7F3A2C. Click it to open the form.</li>
            <li><strong>Signed copy</strong> - a PDF made the moment the form arrived, with the answers, the version of the terms accepted and the signature. It is emailed to the customer and to the forms alert address, and never changes.</li>
            <li><strong>Status</strong> - New until someone works on it; set In progress, Done or Cancelled and add notes on the form itself. Changes go in the audit log.</li>
            <li><strong>Filters</strong> - choose a form or a status, or search by reference, name, email or company.</li>
          </ul>
        </AdminHelpIcon>
      </h1>
      <p className="lead">Forms customers filled in and signed on the website, with the signed copies and attached files.</p>

      <form className="admin-refresh" method="get">
        <label>
          Form
          <select name="form" defaultValue={formKey}>
            <option value="">All forms</option>
            {ONLINE_FORMS.map((f) => <option key={f.key} value={f.key}>{f.title}</option>)}
          </select>
        </label>
        <label>
          Status
          <select name="status" defaultValue={status}>
            <option value="">Any</option>
            {Object.entries(STATUS_LABELS).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
          </select>
        </label>
        <label>
          Search
          <input name="q" defaultValue={q} placeholder="Reference, name, email or company" />
        </label>
        <button type="submit" className="btn btn-secondary btn-sm">Show</button>
      </form>

      {loadError ? <p className="form-error" role="alert">{loadError}</p> : null}

      {!loadError && rows.length === 0 ? <p className="admin-muted">No forms yet{formKey || status || q ? ' match those filters' : ''}.</p> : null}

      {rows.length ? (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>Received</th><th>Reference</th><th>Form</th><th>From</th><th>Status</th><th>Signed copy</th></tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td>{when(row.created_at)}</td>
                  <td><Link className="admin-link" href={`/admin/forms/${row.id}`}>{row.reference}</Link></td>
                  <td>{row.form_title}</td>
                  <td className="wrap">
                    {row.company ? <>{row.company}<br /></> : null}
                    <span className="admin-muted">{row.name} &middot; <a className="admin-link" href={`mailto:${row.email}`}>{row.email}</a></span>
                  </td>
                  <td><span className={`admin-status is-${row.status}`}>{STATUS_LABELS[row.status] || row.status}</span></td>
                  <td>{row.has_pdf ? <a className="admin-link" href={`/api/admin/forms/${row.id}/pdf`} target="_blank" rel="noopener">PDF</a> : <span className="admin-muted">None</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </AdminShell>
  );
}
