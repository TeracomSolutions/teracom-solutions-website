'use client';

import { useState } from 'react';

// Servers and computers that check in by themselves (Admin -> Connections).
// Adding one, or giving it a new address, shows the line to paste on that
// machine once; the backend keeps only a hash of it.
const KINDS = [
  { value: 'server', label: 'Server' },
  { value: 'workstation', label: 'Workstation PC' },
  { value: 'network', label: 'Network device' },
  { value: 'other', label: 'Other' },
];
const INTERVALS = [5, 10, 15, 30, 60];
const BLANK = { name: '', kind: 'server', every_minutes: '5', notes: '' };

async function call(url, method, body) {
  const res = await fetch(url, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || data.detail || 'That did not work. Try again.');
  return data;
}

function CopyLine({ label, text }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="connection-copy">
      <p className="admin-muted">{label}</p>
      <code className="connection-code">{text}</code>
      <button type="button" className="admin-link-btn" onClick={copy}>{copied ? 'Copied' : 'Copy'}</button>
    </div>
  );
}

export function DeviceCommands({ name, commands, onDone }) {
  return (
    <div className="connection-commands" role="status">
      <p><strong>Set up {name}.</strong> Paste one of these on that machine. This is the only time the address is shown.</p>
      <CopyLine label="Windows 10, 11 or Server 2019 and later: run in an administrator Command Prompt or PowerShell" text={commands.windows} />
      <CopyLine label="Linux: add this line with sudo crontab -e" text={commands.linux} />
      <CopyLine label="Or have any monitoring tool send a POST to" text={commands.url} />
      <button type="button" className="btn btn-secondary btn-sm" onClick={onDone}>Done</button>
    </div>
  );
}

export function DeviceActions({ item, onChanged }) {
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [commands, setCommands] = useState(null);
  const base = `/api/admin/connections/devices/${encodeURIComponent(item.device_id)}`;

  async function act(kind) {
    setBusy(true);
    setError('');
    try {
      if (kind === 'token') {
        const data = await call(`${base}/token`, 'POST');
        setCommands(data.commands);
      } else {
        await call(base, 'DELETE');
        onChanged();
      }
      setConfirm('');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  if (commands) {
    return <DeviceCommands name={item.name} commands={commands} onDone={() => { setCommands(null); onChanged(); }} />;
  }
  if (confirm) {
    return (
      <>
        <span className="admin-muted">
          {confirm === 'token' ? 'Make a new address? The old one stops working.' : `Stop watching ${item.name}?`}
        </span>
        <button type="button" className="btn btn-secondary btn-sm" disabled={busy} onClick={() => act(confirm)}>
          {busy ? 'Working…' : 'Yes'}
        </button>
        <button type="button" className="admin-link-btn" onClick={() => setConfirm('')}>No</button>
        {error ? <span className="form-error" role="alert">{error}</span> : null}
      </>
    );
  }
  return (
    <>
      <button type="button" className="btn btn-secondary btn-sm" onClick={() => setConfirm('token')}>New check-in address</button>
      <button type="button" className="admin-link-btn" onClick={() => setConfirm('remove')}>Remove</button>
    </>
  );
}

export default function AdminAddDevice({ onAdded }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(BLANK);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [added, setAdded] = useState(null);

  const set = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }));

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      const data = await call('/api/admin/connections/devices', 'POST', { ...form, every_minutes: Number(form.every_minutes) });
      setAdded({ name: form.name.trim(), commands: data.commands });
      setForm(BLANK);
      setOpen(false);
      onAdded();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  if (added) {
    return <DeviceCommands name={added.name} commands={added.commands} onDone={() => setAdded(null)} />;
  }
  if (!open) {
    return (
      <p className="connection-add">
        <button type="button" className="btn btn-secondary btn-sm" onClick={() => setOpen(true)}>Add a server or computer</button>
      </p>
    );
  }
  return (
    <form className="admin-form connection-form" onSubmit={submit}>
      <label>
        Name
        <input value={form.name} onChange={set('name')} maxLength={120} required placeholder="e.g. Office NAS or Reception PC" />
      </label>
      <label>
        Kind
        <select value={form.kind} onChange={set('kind')}>
          {KINDS.map((kind) => <option key={kind.value} value={kind.value}>{kind.label}</option>)}
        </select>
      </label>
      <label>
        Checks in every
        <select value={form.every_minutes} onChange={set('every_minutes')}>
          {INTERVALS.map((minutes) => <option key={minutes} value={String(minutes)}>{minutes} minutes</option>)}
        </select>
      </label>
      <label>
        Notes <span className="admin-muted">(optional: where it is, what it does)</span>
        <input value={form.notes} onChange={set('notes')} maxLength={500} />
      </label>
      {error ? <p className="form-error" role="alert">{error}</p> : null}
      <div className="admin-actions">
        <button type="submit" className="btn btn-primary btn-sm" disabled={busy}>{busy ? 'Adding…' : 'Add'}</button>
        <button type="button" className="btn btn-secondary btn-sm" onClick={() => setOpen(false)}>Cancel</button>
      </div>
    </form>
  );
}