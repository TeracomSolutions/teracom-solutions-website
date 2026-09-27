'use client';

import { useState } from 'react';
import { Copy, Download, KeyRound, ShieldCheck, ShieldOff } from 'lucide-react';

import { backupCodesText, groupSecret } from '@/lib/mfaFormat';

// Turning two-factor on and off for the signed-in staff member. The secret
// is shown as a QR code for authenticator apps and as plain text for a
// password manager such as Zoho Vault; both hold the same secret, so codes
// from either are accepted. Backup codes are shown exactly once.
async function call(url, body) {
  const res = await fetch(url, {
    method: body === undefined ? 'GET' : 'POST',
    headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'The request failed.');
  return data;
}

function CopyButton({ text, label = 'Copy' }) {
  const [done, setDone] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setDone(true);
      setTimeout(() => setDone(false), 1500);
    } catch {
      window.prompt('Copy this:', text);
    }
  }
  return (
    <button type="button" className="btn btn-secondary btn-sm" onClick={copy}>
      <Copy size={14} strokeWidth={2} aria-hidden="true" /> {done ? 'Copied' : label}
    </button>
  );
}

export default function AdminTwoFactor({ initialStatus, email }) {
  const [status, setStatus] = useState(initialStatus || { enabled: false, backup_codes_left: 0 });
  const [mode, setMode] = useState('status'); // status | setup | codes | disable
  const [setup, setSetup] = useState(null);
  const [codes, setCodes] = useState([]);
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function refresh() {
    try {
      setStatus(await call('/api/admin/mfa/status'));
    } catch {
      // keep what we have
    }
  }

  async function startSetup() {
    setBusy(true);
    setError('');
    try {
      setSetup(await call('/api/admin/mfa/setup', {}));
      setCode('');
      setMode('setup');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function enable(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const data = await call('/api/admin/mfa/enable', { code: code.trim() });
      setCodes(data.backup_codes || []);
      setCode('');
      setMode('codes');
      await refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function disable(e) {
    e.preventDefault();
    if (!window.confirm('Turn two-factor off for your account? A password alone will sign you in again.')) return;
    setBusy(true);
    setError('');
    try {
      await call('/api/admin/mfa/disable', { code: code.trim() });
      setCode('');
      setMode('status');
      await refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  function downloadCodes() {
    const blob = new Blob([backupCodesText(codes, email || 'your account')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'teracom-admin-backup-codes.txt';
    a.click();
    URL.revokeObjectURL(url);
  }

  function cancelSetup() {
    setMode('status');
    setSetup(null);
    setCode('');
    setError('');
  }

  return (
    <div className="admin-twofactor">
      {error && <p className="form-error" role="alert">{error}</p>}

      {mode === 'status' && (
        <div className="admin-card admin-twofactor-status">
          {status.enabled ? (
            <>
              <p>
                <ShieldCheck size={18} strokeWidth={2} aria-hidden="true" /> <strong>Two-factor sign-in is on.</strong>{' '}
                <span className="admin-muted">{status.backup_codes_left} backup code{status.backup_codes_left === 1 ? '' : 's'} left.</span>
              </p>
              <p className="admin-muted">Every sign-in asks for the six-digit code after your password. Turning it off, or setting it up again on a new phone or vault, needs a current code or a backup code.</p>
              <div className="admin-actions">
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => { setMode('disable'); setCode(''); setError(''); }} disabled={busy}>
                  <ShieldOff size={14} strokeWidth={2} aria-hidden="true" /> Turn off
                </button>
              </div>
            </>
          ) : (
            <>
              <p>
                <ShieldOff size={18} strokeWidth={2} aria-hidden="true" /> <strong>Two-factor sign-in is off.</strong>
              </p>
              <p className="admin-muted">Add a second step to your sign-in: a six-digit code from Google or Microsoft Authenticator, Authy, 1Password, or from Zoho Vault holding the same secret. A password alone will no longer be enough.</p>
              <div className="admin-actions">
                <button type="button" className="btn btn-primary btn-sm" onClick={startSetup} disabled={busy}>
                  <ShieldCheck size={14} strokeWidth={2} aria-hidden="true" /> {busy ? 'Preparing…' : 'Set up two-factor'}
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {mode === 'setup' && setup && (
        <form onSubmit={enable} className="admin-card admin-form admin-twofactor-setup" style={{ maxWidth: 'none' }}>
          <h2>1. Add the secret to your app or vault</h2>
          <div className="admin-twofactor-grid">
            <div>
              <img src={setup.qr_png_data_url} alt="" width={180} height={180} className="admin-twofactor-qr" />
              <p className="admin-muted">Scan with Google or Microsoft Authenticator, Authy or 1Password.</p>
            </div>
            <div>
              <p><strong>Or enter the key by hand / paste into Zoho Vault</strong></p>
              <code className="admin-secret">{groupSecret(setup.secret)}</code>
              <div className="admin-actions">
                <CopyButton text={setup.secret} label="Copy key" />
                <CopyButton text={setup.otpauth_uri} label="Copy otpauth link" />
              </div>
              <p className="admin-muted">Type: time-based, 6 digits, 30 seconds. Anyone with this key can generate your codes, so store it only in your password manager.</p>
            </div>
          </div>
          <h2>2. Confirm with a code</h2>
          <label>
            Enter the six-digit code it shows now
            <input type="text" inputMode="numeric" autoComplete="one-time-code" value={code} onChange={(e) => setCode(e.target.value)} minLength={6} maxLength={7} required style={{ maxWidth: '200px', letterSpacing: '0.2em' }} />
          </label>
          <div className="admin-actions">
            <button type="submit" className="btn btn-primary btn-sm" disabled={busy || code.trim().length < 6}>{busy ? 'Checking…' : 'Turn on'}</button>
            <button type="button" className="btn btn-secondary btn-sm" onClick={cancelSetup} disabled={busy}>Cancel</button>
          </div>
        </form>
      )}

      {mode === 'codes' && (
        <div className="admin-card admin-twofactor-codes">
          <h2><KeyRound size={18} strokeWidth={2} aria-hidden="true" /> Two-factor is on. Save these backup codes now.</h2>
          <p className="admin-muted">Each code signs you in once if you lose your phone or your vault. They are shown this one time only; keep them somewhere safe, such as Zoho Vault.</p>
          <ul className="admin-backup-codes">
            {codes.map((c) => <li key={c}><code>{c}</code></li>)}
          </ul>
          <div className="admin-actions">
            <CopyButton text={codes.join('\n')} label="Copy all" />
            <button type="button" className="btn btn-secondary btn-sm" onClick={downloadCodes}>
              <Download size={14} strokeWidth={2} aria-hidden="true" /> Download
            </button>
            <button type="button" className="btn btn-primary btn-sm" onClick={() => { setCodes([]); setMode('status'); }}>Done, I have saved them</button>
          </div>
        </div>
      )}

      {mode === 'disable' && (
        <form onSubmit={disable} className="admin-card admin-form">
          <h2>Turn two-factor off</h2>
          <label>
            A current six-digit code, or one backup code
            <input type="text" inputMode="text" autoComplete="one-time-code" value={code} onChange={(e) => setCode(e.target.value)} minLength={6} maxLength={12} required style={{ maxWidth: '240px' }} />
          </label>
          <div className="admin-actions">
            <button type="submit" className="btn btn-primary btn-sm" disabled={busy || code.trim().length < 6}>{busy ? 'Checking…' : 'Turn off'}</button>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => { setMode('status'); setCode(''); setError(''); }} disabled={busy}>Cancel</button>
          </div>
        </form>
      )}
    </div>
  );
}
