'use client';

import { useEffect, useState } from 'react';

import { formatDateTime } from '@/lib/adminFormat';
import { STATUS_LABEL } from '@/lib/softwareInventory';

// Connections > Software (Robert, 2026-11-01): what the backend and the website run, at what version, whether
// a newer release exists and whether a security advisory has been published. The backend checks itself once a
// day; Check now checks both straight away.
const TONE = { current: 'ok', update: 'warn', advisory: 'bad', unknown: 'muted' };
const ORDER = { advisory: 0, update: 1, unknown: 2, current: 3 };

function Section({ title, note, data }) {
  if (!data || !data.items) {
    return (
      <section className="admin-card admin-software-section">
        <h2>{title}</h2>
        <p className="admin-muted">Not checked yet. Press Check now.</p>
      </section>
    );
  }
  const system = data.items.filter((item) => item.kind === 'system');
  const packages = [...data.items.filter((item) => item.kind !== 'system')].sort((a, b) => (ORDER[a.status] - ORDER[b.status]) || a.name.localeCompare(b.name));
  const s = data.summary || {};
  return (
    <section className="admin-card admin-software-section">
      <h2>{title}</h2>
      <p className="admin-muted">{note} Checked {formatDateTime(data.checked_at)}.</p>
      <div className="admin-software-summary">
        <span className="admin-pill admin-pill-bad">{s.advisory || 0} security advisory</span>
        <span className="admin-pill admin-pill-warn">{s.update || 0} newer version available</span>
        <span className="admin-pill admin-pill-ok">{s.current || 0} up to date</span>
        {s.unknown ? <span className="admin-pill admin-pill-muted">{s.unknown} could not check</span> : null}
      </div>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr><th>Part</th><th>In use</th><th>Newest</th><th>State</th></tr>
          </thead>
          <tbody>
            {[...system, ...packages].map((item) => (
              <tr key={item.name}>
                <td>
                  <strong>{item.name}</strong>
                  {item.purpose ? <div className="admin-muted">{item.purpose}</div> : null}
                </td>
                <td>{item.running || '–'}{item.pinned && item.pinned !== item.running ? <div className="admin-muted">set to {item.pinned}</div> : null}</td>
                <td>{item.latest || '–'}</td>
                <td>
                  <span className={`admin-pill admin-pill-${TONE[item.status] || 'muted'}`}>{STATUS_LABEL[item.status] || item.status}</span>
                  {(item.advisories || []).map((id) => (
                    <div key={id}><a href={`https://osv.dev/vulnerability/${id}`} target="_blank" rel="noopener noreferrer">{id}</a></div>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default function AdminSoftware() {
  const [data, setData] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function load(method) {
    setBusy(true);
    setError('');
    try {
      const response = await fetch('/api/admin/software', { method, cache: 'no-store' });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.error || 'The software check did not run.');
      setData(body);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    load('GET');
    // Only once, when the tab first opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="admin-software">
      <p className="lead">What the website and its backend run, at what version, whether a newer release exists and whether a security advisory has been published for the version in use.</p>
      <div className="admin-actions">
        <button type="button" className="btn btn-primary btn-sm" onClick={() => load('POST')} disabled={busy}>{busy ? 'Checking…' : 'Check now'}</button>
      </div>
      {error && <p className="form-error" role="alert">{error}</p>}
      {!data && busy && <p className="admin-muted">Loading…</p>}
      {data && (
        <>
          <Section title="Backend (server)" note="The server and every package pinned in the backend's requirements; checked by the backend once a day." data={data.backend} />
          <Section title="Website and console" note="The packages in the website's package.json and the Node version it runs on." data={data.website} />
          <p className="admin-muted">Security advisories come from the public OSV database (osv.dev); click one to read it. A newer version is not always urgent: updates are tested before they go live.</p>
        </>
      )}
    </div>
  );
}
