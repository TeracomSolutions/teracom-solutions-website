import { LICENCE_NOTES, OPEN_SOURCE, OPEN_SOURCE_CHECKED } from '@/lib/openSource';

// About -> Open-source software and outside services (Robert, 2026-11-06): what the website,
// console and backend are built with, each with its version, licence and what it does here.
export default function AboutOpenSource() {
  return (
    <section className="admin-card about-open-source" id="open-source">
      <h2>Open-source software and outside services</h2>
      <p className="admin-muted">
        What the website, the console and the backend are built with, and the outside services they use. Checked {OPEN_SOURCE_CHECKED}.
        Connections, Software lists every installed package with its version and any security advisory.
      </p>
      {LICENCE_NOTES.length > 0 ? (
        <div className="about-licence-notes">
          <strong>Licences to look at</strong>
          <ul>{LICENCE_NOTES.map((note) => <li key={note}>{note}</li>)}</ul>
        </div>
      ) : null}
      {OPEN_SOURCE.map((group) => (
        <details key={group.key} className="about-open-group" open={group.key === 'website' || group.key === 'backend'}>
          <summary>{group.title} ({group.items.length})</summary>
          <div className="admin-table-wrap">
            <table className="admin-table admin-table-compact">
              <thead><tr><th>Software</th><th>Version</th><th>Licence</th><th>What it does here</th></tr></thead>
              <tbody>
                {group.items.map(([name, version, licence, url, purpose]) => (
                  <tr key={name}>
                    <td className="wrap"><a href={url} target="_blank" rel="noopener noreferrer" className="admin-link">{name}</a></td>
                    <td className="wrap">{version || '—'}</td>
                    <td className="wrap">{licence}</td>
                    <td className="wrap">{purpose}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      ))}
    </section>
  );
}
