'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { safeNextPath } from '@/lib/safeNext';
import Link from 'next/link';
import AuthShell from '@/components/AuthShell';
import { BadgePercent, LockKeyhole, ReceiptText, ShoppingCart, Zap } from 'lucide-react';

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

      router.push(safeNextPath(new URLSearchParams(window.location.search).get('next')));
      router.refresh();
    } catch {
      setError('Unable to reach the login service.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthShell
      eyebrow="Account"
      title="Sign in."
      lead="Sign in for member pricing and to check out in the Teracom Store."
      icon={LockKeyhole}
      badges={[BadgePercent, ShoppingCart, ReceiptText]}
      benefits={[
        { icon: BadgePercent, text: 'Member pricing on store items' },
        { icon: Zap, text: 'Faster checkout -- your details are already there' },
        { icon: ReceiptText, text: 'Order confirmations and invoices by email' },
      ]}
    >
      <h2>Sign in</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
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

      <p className="auth-aside">
        Don&apos;t have an account? <Link href="/account/signup">Create a free account</Link>
      </p>
    </AuthShell>
  );
}