import { BRAND, retitle } from '@/lib/brand';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';

import AdminFormResend from '@/components/AdminFormResend';
import AdminFormStatus from '@/components/AdminFormStatus';
import AdminShell from '@/components/AdminShell';
import { fetchFormSubmission } from '@/lib/api/forms';
import { isSessionError, requireAdminToken } from '@/lib/adminPage';
import { adminZone, setAdminZone } from '@/lib/adminFormat';
import { zoneFor } from '@/lib/api/adminTime';
import { KIND_LABELS, describeDestination } from '@/lib/formRouting';

export const metadata = {
  title: retitle('Form|Teracom Solutions', BRAND),
};

const when = (value) =>
  value ? new Date(value).toLocaleString('en-AU', { timeZone: adminZone(), timeZoneName: 'short', day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: '2-digit' }) : '';

// One form a customer filled in and signed: the answers, the agreement, the files and its status.
export default async function AdminFormPage({ params }) {
  const token = await requireAdminToken();
  setAdminZone(await zoneFor(token));
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/.test(id)) notFound();

  let sub = null;
  let loadError = null;
  try {
    sub = await fetchFormSubmission(token, id);
  } catch (err) {
    if (isSessionError(err)) redirect('/admin/login');
    if (err.status === 404) notFound();
    loadError = 'Unable to load this form from the backend.';
  }

  return (
    <AdminShell>
      <p className="admin-muted">
        <Link href="/admin/forms" className="admin-link">&larr; Forms</Link>
      </p>
      {loadError ? <p className="form-error" role="alert">{loadError}</p> : null}
      {sub ? (
        <>
          <h1 className="admin-heading">
            {sub.form_title} <span className="admin-muted">{sub.reference}</span>
          </h1>
          <p className="lead">
            From {sub.company ? `${sub.company}, ` : ''}{sub.name} (<a className="admin-link" href={`mailto:${sub.email}`}>{sub.email}</a>
            {sub.phone ? `, ${sub.phone}` : ''}), received {when(sub.created_at)}.
          </p>

          <div className="admin-actions" style={{ marginBottom: 20 }}>
            {sub.has_pdf ? (
              <a className="btn btn-primary btn-sm" href={`/api/admin/forms/${sub.id}/pdf`} target="_blank" rel="noopener">Open the signed copy</a>
            ) : (
              <span className="admin-muted">No signed copy was made for this form.</span>
            )}
          </div>

          <AdminFormStatus id={sub.id} status={sub.status} notes={sub.staff_notes || ''} />

          <section className="admin-card form-summary">
            <h2>Where it went</h2>
            <p className="admin-muted">
              Goes to the customer and {(sub.destinations || []).map((d) => describeDestination(d)).join('; ') || 'nowhere else'}.{' '}
              <Link className="admin-link" href="/admin/forms#form-route-heading">Change where forms go</Link>
            </p>
            {sub.deliveries?.length ? (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead><tr><th>When</th><th>Where</th><th>Result</th></tr></thead>
                  <tbody>
                    {sub.deliveries.map((d) => (
                      <tr key={d.id}>
                        <td>{when(d.created_at)}</td>
                        <td className="wrap">{KIND_LABELS[d.kind] || d.kind}<br /><span className="admin-muted">{d.target}</span></td>
                        <td className="wrap">
                          <span className={`admin-status is-${d.outcome === 'done' ? 'done' : 'cancelled'}`}>{d.outcome === 'done' ? 'Done' : 'Failed'}</span>
                          {d.detail ? <><br /><span className="admin-muted">{d.detail}</span></> : null}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="admin-muted">Nothing recorded yet (forms received before 5 November 2026 were only emailed).</p>
            )}
            <AdminFormResend id={sub.id} />
          </section>

          {(sub.summary || []).map((section) => (
            <section className="admin-card form-summary" key={section.title}>
              <h2>{section.title}</h2>
              <dl className="audit-detail-list">
                {section.rows.map((row) => (
                  <div className="audit-detail-item" key={row.label}>
                    <dt>{row.label}</dt>
                    <dd className="form-summary-value">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}

          {sub.files?.length ? (
            <section className="admin-card form-summary">
              <h2>Attached files</h2>
              <ul>
                {sub.files.map((f) => (
                  <li key={f.id}>
                    <a className="admin-link" href={`/api/admin/forms/${sub.id}/files/${f.id}`}>{f.filename}</a>{' '}
                    <span className="admin-muted">({Math.ceil(f.size / 1024)} KB)</span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <section className="admin-card form-summary">
            <h2>Agreement</h2>
            <p>Accepted {sub.terms_title || 'the terms'}{sub.terms_version ? ` (version ${sub.terms_version})` : ''}.</p>
            <p className="admin-muted">
              Signed by {sub.signed_name || sub.name} on {when(sub.signed_at)}{sub.client_ip ? `, from ${sub.client_ip}` : ''}.
            </p>
            {sub.signature_png ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img className="form-signature" src={sub.signature_png} alt={`Signature of ${sub.signed_name || sub.name}`} />
            ) : null}
          </section>
        </>
      ) : null}
    </AdminShell>
  );
}
