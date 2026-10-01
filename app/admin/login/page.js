'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import AdminBrand from '@/components/AdminBrand';

// Staff sign-in in two steps: password, then (for an account with two-factor
// on) the six-digit code from an authenticator app or Zoho Vault, or one
// backup code. The password step hands back a short-lived challenge token;
// no session exists until the code is accepted.
export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [challengeToken, setChallengeToken] = useState('');
  const [code, setCode] = useState('');
  const [useBackup, setUseBackup] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  // Sent here by the automatic sign-out (or an ended session): say why.
  useEffect(() => {
    const reason = new URLSearchParams(window.location.search).get('reason');
    if (reason === 'idle') setNotice('You were signed out after a period of inactivity. Sign in again to carry on.');
    else if (reason === 'expired') setNotice('Your session has ended. Please sign in again.');
  }, []);
  const [submitting, setSubmitting] = useState(false);

  async function handlePassword(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Login failed.');
        return;
      }
      if (data.mfaRequired) {
        setChallengeToken(data.challengeToken);
        setCode('');
        return;
      }
      router.push('/admin');
      router.refresh();
    } catch {
      setError('Unable to reach the login service.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleCode(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/login/mfa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ challengeToken, code: code.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'That code is not right.');
        if (res.status === 401 && /sign in again/i.test(data.error || '')) {
          setChallengeToken('');
        }
        return;
      }
      router.push('/admin');
      router.refresh();
    } catch {
      setError('Unable to reach the login service.');
    } finally {
      setSubmitting(false);
    }
  }

  function backToPassword() {
    setChallengeToken('');
    setCode('');
    setError('');
    setUseBackup(false);
  }

  return (
    <main id="main-content" className="admin-main">
      <section className="section section-spacious admin-section">
        <div className="container admin-container">
          <AdminBrand signedIn={false} />
        </div>
        <div className="container" style={{ maxWidth: '420px' }}>
          {!challengeToken ? (
            <>
              <h1>Staff Login</h1>
              <p className="lead">Teracom Solutions staff only. Sign in with your @teracomsolutions.com.au account.</p>
              {notice && <p className="form-note-banner" role="status">{notice}</p>}

              <form onSubmit={handlePassword} style={{ marginTop: '24px' }}>
                <div style={{ marginBottom: '16px' }}>
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="username"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ display: 'block', width: '100%' }}
                  />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label htmlFor="password">Password</label>
                  <input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ display: 'block', width: '100%' }}
                  />
                </div>

                {error && (
                  <p className="form-error" role="alert">
                    {error}
                  </p>
                )}

                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Signing in…' : 'Sign in'}
                </button>
              </form>
              <p style={{ marginTop: '16px' }}>
                <Link href="/admin/forgot-password">Forgot your password?</Link>
              </p>
            </>
          ) : (
            <>
              <h1>Enter your code</h1>
              <p className="lead">
                {useBackup
                  ? 'Enter one of your backup codes. Each works once.'
                  : 'The six-digit code from your authenticator app or Zoho Vault.'}
              </p>

              <form onSubmit={handleCode} style={{ marginTop: '24px' }}>
                <div style={{ marginBottom: '16px' }}>
                  <label htmlFor="code">{useBackup ? 'Backup code (xxxxx-xxxxx)' : 'Six-digit code'}</label>
                  <input
                    id="code"
                    type="text"
                    inputMode={useBackup ? 'text' : 'numeric'}
                    autoComplete="one-time-code"
                    autoFocus
                    required
                    minLength={6}
                    maxLength={12}
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    style={{ display: 'block', width: '100%', letterSpacing: useBackup ? 'normal' : '0.2em' }}
                  />
                </div>

                {error && (
                  <p className="form-error" role="alert">
                    {error}
                  </p>
                )}

                <button type="submit" className="btn btn-primary" disabled={submitting || code.trim().length < 6}>
                  {submitting ? 'Checking…' : 'Continue'}
                </button>

                <p className="form-note" style={{ marginTop: '16px' }}>
                  <button type="button" className="admin-link-btn" onClick={() => { setUseBackup(!useBackup); setCode(''); setError(''); }}>
                    {useBackup ? 'Use my authenticator instead' : 'Use a backup code instead'}
                  </button>
                  {' · '}
                  <button type="button" className="admin-link-btn" onClick={backToPassword}>Back</button>
                </p>
              </form>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
