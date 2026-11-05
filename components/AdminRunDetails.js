import { formatDateTime, humanise } from '@/lib/adminFormat';
import { splitProblems } from '@/lib/checkProblems';

function answerClass(status) {
  if (status === 200) return 'is-approved';
  if (typeof status === 'number' && status >= 400) return 'is-failed';
  if (status === 'note') return 'is-pending';
  if (typeof status === 'number') return 'is-pending';
  return 'is-failed';
}

export default function AdminRunDetails({ run }) {
  if (!run) {
    return (
      <section id="last-check">
        <h2>What the last check saw</h2>
        <p className="admin-muted">No checks yet.</p>
      </section>
    );
  }

  const details = Array.isArray(run.details) ? run.details : [];
  const problems = splitProblems(run.error);
  const withNotes = details.filter((d) => d.note).length;

  return (
    <section id="last-check">
      <h2>What the last check saw</h2>
      <p>
        <span className={`admin-status ${run.status === 'ok' ? 'is-approved' : run.status === 'failed' ? 'is-failed' : 'is-running'}`}>{humanise(run.status)}</span>
        {' '}Started {formatDateTime(run.started_at)}{run.finished_at ? `, finished ${formatDateTime(run.finished_at)}` : ''}. Read {run.pages_scanned} page{run.pages_scanned === 1 ? '' : 's'}; {run.found} document{run.found === 1 ? '' : 's'} found, {run.new} new, {run.changed} changed, {run.missing} missing.
      </p>
      {run.summary && <p className="admin-run-why"><strong>Why nothing was found: </strong>{run.summary}</p>}
      {problems.length > 0 && (
        <div className="admin-run-why">
          <strong>{run.status === 'failed' ? 'Why it failed' : 'Problems'}</strong>
          <ul>{problems.map((p, i) => <li key={i}>{p}</li>)}</ul>
        </div>
      )}
      {details.length === 0 ? (
        <p className="admin-muted">No page-by-page record for this check. Checks from 5 November 2026 keep one.</p>
      ) : (
        <details className="admin-run-pages" open={run.status === 'failed' || Boolean(run.summary)}>
          <summary>Every page it read ({details.length}{withNotes ? `, ${withNotes} with a note` : ''})</summary>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr><th>Page</th><th>Answer</th><th>Links</th><th>PDFs</th><th>Note</th></tr>
              </thead>
              <tbody>
                {details.map((d, i) => (
                  <tr key={i}>
                    <td className="wrap">{d.url ? <a href={d.url} target="_blank" rel="noopener noreferrer" className="admin-link">{d.url}</a> : '—'}</td>
                    <td><span className={`admin-status ${answerClass(d.status)}`}>{String(d.status)}</span></td>
                    <td>{d.links}</td>
                    <td>{d.pdfs}</td>
                    <td className="wrap">{d.note || ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      )}
    </section>
  );
}
