import { redirect } from 'next/navigation';

import AdminShell from '@/components/AdminShell';
import { fetchAbout } from '@/lib/api/adminAbout';
import { isSessionError, requireAdminToken } from '@/lib/adminPage';
import { formatBuildTime, formatReleased, notesLines } from '@/lib/aboutView';

export const metadata = {
  title: 'About|Teracom Solutions',
};

// About page.
export default async function AdminAboutPage() {
  const token = await requireAdminToken();

  // Handle session errors (redirect to login)
  if (isSessionError(token)) {
    redirect('/admin/login');
  }

  let about = null;
  let loadError = '';

  try {
    about = await fetchAbout(token);
  } catch (err) {
    if (isSessionError(err)) {
      redirect('/admin/login');
    }
    loadError = 'Unable to read the version from the backend.';
  }

  return (
    <AdminShell>
      <h1 className="admin-heading">About</h1>
      <p className="lead">Which version of the backend this console is talking to. Open About on each copy to check both are on the same version and commit.</p>

      {loadError && (
        <p className="form-error" role="alert">{loadError}</p>
      )}

      {about && (
        <>
          <section className="admin-card">
            <dl className="audit-detail-list">
              <div className="audit-detail-item">
                <dt>Product</dt>
                <dd>{about.product}</dd>
              </div>
              <div className="audit-detail-item">
                <dt>Site</dt>
                <dd>{about.site}</dd>
              </div>
              <div className="audit-detail-item">
                <dt>Version</dt>
                <dd>{about.version}</dd>
              </div>
              <div className="audit-detail-item">
                <dt>Released</dt>
                <dd>{formatReleased(about.released)}</dd>
              </div>
              <div className="audit-detail-item">
                <dt>Commit</dt>
                <dd>{about.commit}</dd>
              </div>
              <div className="audit-detail-item">
                <dt>Built</dt>
                <dd>{formatBuildTime(about.build_time)}</dd>
              </div>
              <div className="audit-detail-item">
                <dt>Environment</dt>
                <dd>{about.environment}</dd>
              </div>
            </dl>
          </section>

          <section className="admin-card">
            <h2>Version history</h2>
            {about.versions && about.versions.map((entry, index) => (
              <div key={index}>
                <h3>{entry.version} - {formatReleased(entry.date)}</h3>
                {notesLines(entry.notes).map((line, i) => (
                  <p key={i} className={`admin-muted${line.bullet ? ' bullet' : ''}`}>
                    {line.bullet && '• '}
                    {line.text}
                  </p>
                ))}
              </div>
            ))}
          </section>
        </>
      )}
    </AdminShell>
  );
}