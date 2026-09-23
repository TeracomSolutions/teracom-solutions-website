'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthShell from '@/components/AuthShell';
import { BadgePercent, KeyRound, LockKeyhole, ShieldCheck } from 'lucide-react';

const MIN_LENGTH = 8;

export default function SetPasswordPage() {
  const router = useRouter();
  // Read from window rather than useSearchParams: the same pattern the login
  // page uses, and it keeps this page out of a Suspense boundary.
  const [token, setToken] = useState(null);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    setToken(new URLSearchParams(window.location.search).get('token') || '');
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (password.length < MIN_LENGTH) {
      setError(`Please choose a password of at least ${MIN_LENGTH} characters.`);
      return;
    }
    if (password !== confirm) {
      setError('Those two passwords do not match.');
      return;
    }

    setStatus('saving');
    try {
      const res = await fetch('/api/customer/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'That link is no longer valid. Please request a new one.');
        setStatus('idle');
        return;
      }

      setStatus('done');
    } catch {
      setError('Unable to reach the account service. Please try again in a moment.');
      setStatus('idle');
    }
  }

  const shell = {
    eyebrow: 'Account',
    title: 'Choose a password.',
    icon: KeyRound,
    badges: [LockKeyhole, ShieldCheck, BadgePercent],
    benefits: [
      { icon: ShieldCheck, text: 'At least 8 characters' },
      { icon: LockKeyhole, text: 'This link works once, then stops working' },
      { icon: BadgePercent, text: 'Member pricing applies as soon as you sign in' },
    ],
  };

  if (status === 'done') {
    return (
      <AuthShell {...shell} lead="You are all set.">
        <h2>Password set</h2>
        <p className="auth-sent" role="status">
          Your password has been saved. You can sign in with it now.
        </p>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => router.push('/account/login')}
        >
          Go to sign in
        </button>
      </AuthShell>
    );
  }

  // token is null only for the instant before the effect runs.
  if (token === '') {
    return (
      <AuthShell {...shell} lead="That link is missing something.">
        <h2>This link is not complete</h2>
        <p className="form-error" role="alert">
          This page needs the link from your email. Copy the whole address across, or request a
          fresh one.
        </p>
        <p className="auth-aside">
          <Link href="/account/forgot-password">Email me a new link</Link>
        </p>
      </AuthShell>
    );
  }

  return (
    <AuthShell {...shell} lead="Choose a password for your Teracom Solutions account.">
      <h2>Choose a password</h2>

      <form className="auth-form" onSubmit={handleSubmit}>
        <div style={{ marginBottom: '16px' }}>
          <label htmlFor="password">New password</label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={MIN_LENGTH}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ display: 'block', width: '100%' }}
          />
          <small className="field-hint">At least {MIN_LENGTH} characters.</small>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label htmlFor="confirm">Confirm password</label>
          <input
            id="confirm"
            type="password"
            autoComplete="new-password"
            required
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            style={{ display: 'block', width: '100%' }}
          />
        </div>

        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}

        <button type="submit" className="btn btn-primary" disabled={status === 'saving' || token === null}>
          {status === 'saving' ? 'Saving…' : 'Save password'}
        </button>
      </form>

      <p className="auth-aside">
        Link expired? <Link href="/account/forgot-password">Request a new one</Link>
      </p>
    </AuthShell>
  );
}
