import Link from 'next/link';
import { redirect } from 'next/navigation';

import AdminHelpIcon from '@/components/AdminHelpIcon';
import AdminResourceDocuments from '@/components/AdminResourceDocuments';
import AdminResourceTree from '@/components/AdminResourceTree';
import AdminShell from '@/components/AdminShell';
import { fetchResourceDocuments, fetchResourceRuns, fetchResourceSources, fetchResourceTree } from '@/lib/api/adminResources';
import { formatDateTime, humanise } from '@/lib/adminFormat';
import { isSessionError, requireAdminToken } from '@/lib/adminPage';

export const metadata = {
  title: 'Resource documents|Teracom Solutions',
};

// Public download links go straight to the backend, the same way the store
// serves them to visitors.
const DOWNLOAD_BASE = process.env.NEXT_PUBLIC_RESOURCES_BASE_URL || 'https://api.teracomsolutions.com.au';

function runClass(status) {
  if (status === 'ok') return 'is-approved';
  if (status === 'failed') return 'is-failed';
  return 'is-running';
}

export default async function AdminResourceSourcePage({ params }) {
  const token = await requireAdminToken();
  const { sourceId } = await params;

  let source = null;
  let documents = [];
  let runs = [];
  let tree = null;
  let loadError = '';

  try {
    const [sources, docs, history, files] = await Promise.all([
      fetchResourceSources(token),
      fetchResourceDocuments(token, { sourceId }),
      fetchResourceRuns(token, sourceId),
      fetchResourceTree(token, sourceId),
    ]);
    source = sources.find((s) => s.id === sourceId) || null;
    documents = docs;
    runs = history;
    tree = files;
  } catch (err) {
    if (isSessionError(err)) redirect('/admin/login');
    loadError = 'Unable to load this website from the backend.';
  }

  return (
    <AdminShell>
      <p className="admin-muted"><Link href="/admin/resources" className="admin-link">&larr; Resources</Link></p>
      <h1 className="admin-heading">
        {source ? source.name : 'Documents'}
        <AdminHelpIcon>
          <p>Every document collected from this website. <strong>Files on the server</strong> shows where they are kept: one folder for this site, a folder per kind inside it, the supplier&apos;s file names inside those. <strong>Pause checks</strong> on the Resources page stops the schedule for a site without removing anything.</p>
          <ul>
            <li><strong>Type</strong> - correct it if the automatic guess was wrong.</li>
            <li><strong>Store SKU</strong> - the part number of the product this belongs to; the store shows the document on that product page. Filled in automatically when the file name carries a SKU from the catalogue.</li>
            <li><strong>Status</strong> - New (first seen on the last check), Changed (the file differs from the copy we held), Unchanged, or Missing (the site no longer links to it; our copy is kept).</li>
            <li><strong>On store</strong> - Publish / Hide. A published document with a SKU appears under Downloads on the product page.</li>
          </ul>
          <p>Below the documents is the history of checks: when, what triggered it, pages scanned, and counts.</p>
        </AdminHelpIcon>
      </h1>
      {source && (
        <p className="lead">
          <a href={source.url} target="_blank" rel="noopener noreferrer" className="admin-link">{source.url}</a>
          {' · '}{source.recurrence === 'manual' ? 'checked manually' : `checked ${source.recurrence}`}
          {source.last_checked_at ? ` · last check ${formatDateTime(source.last_checked_at)}` : ''}
        </p>
      )}

      {loadError && <p className="form-error" role="alert">{loadError}</p>}
      {!loadError && !source && <p className="form-error" role="alert">This website is no longer in Resources.</p>}

      {source && (
        <>
          <h2 id="files">Files on the server</h2>
          {tree && <AdminResourceTree tree={tree} downloadBase={DOWNLOAD_BASE} />}

          <h2>Documents</h2>
          <AdminResourceDocuments documents={documents} downloadBase={DOWNLOAD_BASE} />

          <h2>Check history</h2>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Started</th>
                  <th>Trigger</th>
                  <th>Result</th>
                  <th>Pages</th>
                  <th>Found</th>
                  <th>New</th>
                  <th>Changed</th>
                  <th>Missing</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {runs.length === 0 && <tr><td colSpan={9} className="admin-muted">No checks yet.</td></tr>}
                {runs.map((run) => (
                  <tr key={run.id}>
                    <td>{formatDateTime(run.started_at)}</td>
                    <td>{humanise(run.triggered_by)}</td>
                    <td><span className={`admin-status ${runClass(run.status)}`}>{humanise(run.status)}</span></td>
                    <td>{run.pages_scanned}</td>
                    <td>{run.found}</td>
                    <td>{run.new}</td>
                    <td>{run.changed}</td>
                    <td>{run.missing}</td>
                    <td className="wrap">{run.error || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </AdminShell>
  );
}
