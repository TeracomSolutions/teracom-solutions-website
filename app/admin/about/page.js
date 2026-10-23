import { redirect } from 'next/navigation';

import AboutVersions from '@/components/AboutVersions';
import AdminShell from '@/components/AdminShell';
import { fetchAbout } from '@/lib/api/adminAbout';
import { isSessionError, requireAdminToken } from '@/lib/adminPage';
import { formatBuildTime, formatReleased } from '@/lib/aboutView';
import { CONSOLE_VERSION, CONSOLE_VERSIONS } from '@/lib/consoleVersions';
import { fromBackend } from '@/lib/versionList';

export const metadata = {
  title: 'About|Teracom Solutions',
};

function Facts({ rows }) {
  return (
    <dl className="audit-detail-list">
      {rows.map(([label, value]) => (
        <div className="audit-detail-item" key={label}>
          <dt>{label}</dt>
          <dd>{value || '-'}</dd>
        </div>
      ))}
    </dl>
  );
}

// About page: the console (this front end) and the backend are released separately, so each has its own
// version, commit and history of changes.
export default async function AdminAboutPage() {
  const token = await requireAdminToken();

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

  const consoleCommit = (process.env.BUILD_COMMIT || '').slice(0, 7);

  return (
    <AdminShell>
      <h1 className="admin-heading">About</h1>
      <p className="lead">Which versions of the console and the backend are running, and what changed in each. Open About on each copy to check both are on the same versions and commits.</p>

      <section className="admin-card">
        <h2>Console (this front end)</h2>
        <Facts
          rows={[
            ['Version', CONSOLE_VERSION.version],
            ['Released', formatReleased(CONSOLE_VERSION.date)],
            ['Commit', consoleCommit],
            ['Built', formatBuildTime(process.env.BUILD_TIME)],
          ]}
        />
      </section>

      {loadError && (
        <p className="form-error" role="alert">{loadError}</p>
      )}

      {about && (
        <section className="admin-card">
          <h2>Backend</h2>
          <Facts
            rows={[
              ['Product', about.product],
              ['Site', about.site],
              ['Version', about.version],
              ['Released', formatReleased(about.released)],
              ['Commit', about.commit],
              ['Built', formatBuildTime(about.build_time)],
              ['Environment', about.environment],
            ]}
          />
        </section>
      )}

      <p className="admin-muted">Console and backend are listed separately because each is released on its own.</p>

      {about && <AboutVersions title="Backend versions" items={fromBackend(about.versions)} />}
      <AboutVersions title="Console versions" items={CONSOLE_VERSIONS} />
    </AdminShell>
  );
}
