'use client';

import Link from 'next/link';
import { useState } from 'react';

import AdminConnectionForm from '@/components/AdminConnectionForm';
import AdminAddDevice, { DeviceActions } from '@/components/AdminMonitoredDevices';
import { checkedText, groupConnections, statusLabel, summarise, withResult } from '@/lib/connectionStatus';

// Admin -> Connections: one card per outside service, server or computer,
// grouped, with Test, Edit and Manage. The list comes from the backend and
// the website (app/admin/connections/page.js).
async function call(url, method = 'POST') {
  const res = await fetch(url, { method });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || data.detail || 'That did not work. Try again.');
  return data;
}

function zohoReady(item) {
  const id = item.fields.find((field) => field.name === 'client_id');
  const secret = item.fields.find((field) => field.name === 'client_secret');
  return Boolean(id?.value && secret?.set);
}

export default function AdminConnections({ initial, notice }) {
  const [list, setList] = useState(initial || []);
  const [busy, setBusy] = useState('');
  const [editing, setEditing] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState(notice || null);

  async function reload() {
    try {
      setList(await call('/api/admin/connections', 'GET'));
    } catch (err) {
      setError(err.message);
    }
  }

  async function runTest(key) {
    const result = await call(`/api/admin/connections/${encodeURIComponent(key)}/check`);
    setList((current) => withResult(current, result));
  }

  async function test(key) {
    setBusy(key);
    setError('');
    try {
      await runTest(key);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy('');
    }
  }

  async function testAll() {
    setBusy('all');
    setError('');
    for (const item of list.filter((entry) => entry.can_test && entry.status !== 'not_set_up')) {
      try {
        await runTest(item.key);
      } catch (err) {
        setError(err.message);
      }
    }
    setBusy('');
  }

  async function connectZoho() {
    setBusy('zoho');
    setError('');
    try {
      const data = await call('/api/admin/connections/zoho/authorize');
      window.location.assign(data.url);
    } catch (err) {
      setError(err.message);
      setBusy('');
    }
  }

  function saved(text) {
    setEditing('');
    setMessage({ ok: true, text });
    reload();
  }

  return (
    <div>
      {message ? (
        <p className={message.ok ? 'form-note-banner' : 'form-error'} role="status">{message.text}</p>
      ) : null}
      {error ? <p className="form-error" role="alert">{error}</p> : null}

      <div className="connection-summary">
        {summarise(list).map((part) => (
          <span key={part.status} className={`admin-status is-${part.status}`}>{part.count} {part.label}</span>
        ))}
        <button type="button" className="btn btn-primary btn-sm" disabled={Boolean(busy)} onClick={testAll}>
          {busy === 'all' ? 'Checking…' : 'Check everything'}
        </button>
      </div>

      {groupConnections(list).map(({ group, items }) => (
        <section key={group} className="connection-group" aria-label={group}>
          <h2>{group}</h2>
          <div className="connection-grid">
            {items.map((item) => (
              <article key={item.key} className="connection-card">
                <header>
                  <h3>{item.name}</h3>
                  <span className={`admin-status is-${item.status}`}>{statusLabel(item.status)}</span>
                </header>
                <p className="admin-muted">{item.purpose}</p>
                <p className="connection-detail">{item.detail}</p>
                {item.checked_at ? <p className="connection-checked">{checkedText(item.checked_at)}</p> : null}
                {item.held_by ? <p className="connection-checked">Keys are kept in {item.held_by}.</p> : null}
                <div className="admin-actions">
                  {item.can_test ? (
                    <button type="button" className="btn btn-secondary btn-sm" disabled={Boolean(busy)} onClick={() => test(item.key)}>
                      {busy === item.key ? 'Testing…' : 'Test'}
                    </button>
                  ) : null}
                  {item.editable ? (
                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => setEditing(editing === item.key ? '' : item.key)}>
                      {editing === item.key ? 'Close' : 'Edit'}
                    </button>
                  ) : null}
                  {item.key === 'zoho_books' && zohoReady(item) ? (
                    <button type="button" className="btn btn-primary btn-sm" disabled={Boolean(busy)} onClick={connectZoho}>
                      {busy === 'zoho' ? 'Opening Zoho…' : item.connected ? 'Connect again' : 'Connect to Zoho Books'}
                    </button>
                  ) : null}
                  {item.manage_href && item.manage_href.startsWith('https://') ? (
                    <a className="btn btn-secondary btn-sm" href={item.manage_href} target="_blank" rel="noopener noreferrer">Edit in Vercel</a>
                  ) : null}
                  {item.manage_href && item.manage_href.startsWith('/') ? (
                    <Link className="btn btn-secondary btn-sm" href={item.manage_href}>Edit</Link>
                  ) : null}
                  {item.device_id ? <DeviceActions item={item} onChanged={reload} /> : null}
                </div>
                {editing === item.key ? (
                  <AdminConnectionForm connection={item} onSaved={saved} onCancel={() => setEditing('')} />
                ) : null}
              </article>
            ))}
          </div>
          {group === 'Servers and computers' ? <AdminAddDevice onAdded={reload} /> : null}
        </section>
      ))}
    </div>
  );
}
