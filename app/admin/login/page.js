'use client';

import { useEffect, useState } from 'react';
import { BRAND } from '@/lib/brand';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import AdminBrand from '@/components/AdminBrand';
import { loginScene } from '@/lib/loginScene';

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

  const scene = loginScene(BRAND, new Date());

  return (
    <main id="main-content" className={`admin-login${BRAND.custom ? ' is-plain' : ''}`}>
      <section className="admin-login-art" style={scene ? { backgroundImage: `url(${scene.image})` } : undefined} aria-hidden={scene ? undefined : 'true'}>
        <div className="admin-login-art-shade" />
        {scene ? (
          <div className="admin-login-art-text">
            <span className="admin-login-eyebrow">Administration console</span>
            <p className="admin-login-headline">{scene.headline}</p>
            <p className="admin-login-sub">{scene.sub}</p>
          </div>
        ) : null}
      </section>
      <section className="admin-login-panel">
        <div className="admin-login-card">
          <AdminBrand signedIn={false} />
          {!challengeToken ? (
            <>
              <h1>Staff sign in</h1>
              <p className="lead">{BRAND.name} staff only. Sign in with your @{BRAND.staffDomain} account.</p>
              {notice && <p className="form-note-banner" role="status">{notice}</p>}

              <form onSubmit={handlePassword} className="admin-login-form">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  autoComplete="username"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                {error && (
                  <p className="form-error" role="alert">
                    {error}
                  </p>
                )}

                <button type="submit" className="btn btn-primary admin-login-submit" disabled={submitting}>
                  {submitting ? 'Signing in…' : 'Sign in'}
                </button>
              </form>
              <p className="admin-login-foot">
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

              <form onSubmit={handleCode} className="admin-login-form">
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
                  style={{ letterSpacing: useBackup ? 'normal' : '0.2em' }}
                />

                {error && (
                  <p className="form-error" role="alert">
                    {error}
                  </p>
                )}

                <button type="submit" className="btn btn-primary admin-login-submit" disabled={submitting || code.trim().length < 6}>
                  {submitting ? 'Checking…' : 'Continue'}
                </button>

                <p className="form-note admin-login-foot">
                  <button type="button" className="admin-link-btn" onClick={() => { setUseBackup(!useBackup); setCode(''); setError(''); }}>
                    {useBackup ? 'Use my authenticator instead' : 'Use a backup code instead'}
                  </button>
                  {' · '}
                  <button type="button" className="admin-link-btn" onClick={backToPassword}>Back</button>
                </p>
              </form>
            </>
          )}
          <p className="admin-login-secure"><span aria-hidden="true">🔒</span> Every sign-in is recorded in the Audit log.</p>
        </div>
      </section>
    </main>
  );
}
