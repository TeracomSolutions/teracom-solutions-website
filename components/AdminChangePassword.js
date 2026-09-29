'use client';

import { useState } from 'react';

export default function AdminChangePassword({ mfaEnabled }) {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  async function submit(event) {
    event.preventDefault();
    setError('');
    setNotice('');

    // Validation
    if (!current) {
      setError('Enter your current password.');
      return;
    }
    if (next.length < 12) {
      setError('Use at least 12 characters.');
      return;
    }
    if (next !== confirm) {
      setError('The new passwords do not match.');
      return;
    }
    if (mfaEnabled && !code) {
      setError('Enter your two-factor code.');
      return;
    }

    setBusy(true);
    try {
      const res = await fetch('/api/admin/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          current_password: current,
          new_password: next,
          code: code || undefined, // only send if enabled
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || data.detail || 'The password was not changed.');
      
      // Clear all fields on success
      setCurrent('');
      setNext('');
      setConfirm('');
      setCode('');
      
      // Set notice with session information if applicable
      let message = 'Your password has been changed.';
      if (data.other_sessions_signed_out && data.other_sessions_signed_out > 0) {
        message += ` ${data.other_sessions_signed_out} other signed-in session(s) were signed out.`;
      }
      setNotice(message);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="admin-form admin-card" onSubmit={submit}>
      <h2>Change password</h2>
      <label>
        Current password
        <input 
          type="password" 
          autoComplete="current-password" 
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          maxLength={200} 
        />
      </label>
      <label>
        New password
        <input 
          type="password" 
          autoComplete="new-password" 
          value={next}
          onChange={(e) => setNext(e.target.value)}
          maxLength={200} 
        />
        <span className="admin-muted">At least 12 characters, a mix of letters and other characters, not your email name.</span>
      </label>
      <label>
        Confirm new password
        <input 
          type="password" 
          autoComplete="new-password" 
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          maxLength={200} 
        />
      </label>
      {mfaEnabled && (
        <label>
          Two-factor code
          <input 
            type="text" 
            inputMode="numeric" 
            autoComplete="one-time-code" 
            value={code}
            onChange={(e) => setCode(e.target.value)}
            maxLength={20} 
          />
          <span className="admin-muted">The six-digit code from your authenticator app or Zoho Vault, or a backup code.</span>
        </label>
      )}
      {error && <p className="form-error" role="alert">{error}</p>}
      {notice && <p className="form-note-banner" role="status">{notice}</p>}
      <div className="admin-actions">
        <button type="submit" className="btn btn-primary btn-sm" disabled={busy}>{busy ? 'Saving…' : 'Change password'}</button>
      </div>
    </form>
  );
}