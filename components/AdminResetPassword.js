'use client';

import { useState } from 'react';
import Link from 'next/link';

// The page behind the emailed link. The rules are the same as Change
// password (12 or more characters, not the email name, letters as well as
// numbers); the backend lists every problem at once.
export default function AdminResetPassword({ token }) {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    if (password !== confirm) {
      setError('The two passwords are not the same.');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch('/api/admin/password/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, new_password: password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || 'We could not change the password just now. Please try again shortly.');
        return;
      }
      setDone(data.message);
      setPassword('');
      setConfirm('');
    } catch {
      setError('We could not reach the sign-in service. Please try again in a moment.');
    } finally {
      setSaving(false);
    }
  }

  if (!token) {
    return (
      <>
        <p className="form-error" role="alert">This page needs the link from the email. Open it again from the email, or ask for a new one.</p>
        <p><Link href="/admin/forgot-password">Ask for a new link</Link></p>
      </>
    );
  }

  if (done) {
    return (
      <>
        <p className="form-note-banner" role="status">{done}</p>
        <p><Link href="/admin/login" className="btn btn-primary">Sign in</Link></p>
      </>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '24px' }}>
      <div style={{ marginBottom: '16px' }}>
        <label htmlFor="new-password">New password</label>
        <input
          id="new-password"
          type="password"
          autoComplete="new-password"
          required
          minLength={12}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          style={{ display: 'block', width: '100%' }}
        />
      </div>
      <div style={{ marginBottom: '16px' }}>
        <label htmlFor="confirm-password">Type it again</label>
        <input
          id="confirm-password"
          type="password"
          autoComplete="new-password"
          required
          value={confirm}
          onChange={(event) => setConfirm(event.target.value)}
          style={{ display: 'block', width: '100%' }}
        />
      </div>
      <p className="admin-muted">At least 12 characters, not your email name, with letters as well as numbers. Every other signed-in session is signed out.</p>
      {error && <p className="form-error" role="alert">{error}</p>}
      <button type="submit" className="btn btn-primary" disabled={saving}>
        {saving ? 'Saving…' : 'Change password'}
      </button>
      {error && error.startsWith('That link is no longer valid') && (
        <p style={{ marginTop: '16px' }}><Link href="/admin/forgot-password">Ask for a new link</Link></p>
      )}
    </form>
  );
}