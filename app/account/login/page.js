'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CustomerLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const res = await fetch('/api/customer/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login failed.');
        return;
      }

      router.push('/account');
      router.refresh();
    } catch {
      setError('Unable to reach the login service.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main>
      <section className="section section-spacious">
        <div className="container" style={{ maxWidth: '420px' }}>
          <h1>Sign in</h1>
          <p className="lead">Access your account to view pricing and use the store.</p>

          <form onSubmit={handleSubmit} style={{ marginTop: '24px' }}>
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

          <p style={{ marginTop: '24px', textAlign: 'center' }}>
            Don&apos;t have an account? <a href="/account/signup">Sign up</a>
          </p>
        </div>
      </section>
    </main>
  );
}