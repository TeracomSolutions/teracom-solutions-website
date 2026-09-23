'use client';

import { useState } from 'react';
import Link from 'next/link';
import AuthShell from '@/components/AuthShell';
import TurnstileWidget from '@/components/TurnstileWidget';
import { KeyRound, Mail, ShieldCheck, Store } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setStatus('sending');

    try {
      const res = await fetch('/api/customer/request-password-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, turnstileToken }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.');
        setStatus('idle');
        return;
      }

      setMessage(data.message);
      setStatus('sent');
    } catch {
      setError('Unable to reach the account service. Please try again in a moment.');
      setStatus('idle');
    }
  }

  return (
    <AuthShell
      eyebrow="Account"
      title="Set your password."
      lead="Whether you are new here or moved across from our previous store, we will email you a link."
      icon={KeyRound}
      badges={[Mail, ShieldCheck, Store]}
      benefits={[
        { icon: Store, text: 'Moved from our old store? Your details came with you' },
        { icon: Mail, text: 'We email a link -- no password needed to start' },
        { icon: ShieldCheck, text: 'The link works once and expires in 24 hours' },
      ]}
    >
      {status === 'sent' ? (
        <>
          <h2>Check your email</h2>
          <p className="auth-sent" role="status">
            {message}
          </p>
          <p className="auth-aside">
            Nothing arrived after a few minutes? Check your junk folder, or email{' '}
            <a href="mailto:support@teracomsolutions.com.au">support@teracomsolutions.com.au</a> and
            we will sort it out.
          </p>
          <p className="auth-aside">
            <Link href="/account/login">Back to sign in</Link>
          </p>
        </>
      ) : (
        <>
          <h2>Set or reset your password</h2>
          <p className="auth-intro">
            Enter the email address on your account and we will send you a link to choose a
            password.
          </p>

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

            <TurnstileWidget onToken={setTurnstileToken} />

            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}

            <button type="submit" className="btn btn-primary" disabled={status === 'sending'}>
              {status === 'sending' ? 'Sending…' : 'Email me a link'}
            </button>
          </form>

          <p className="auth-aside">
            Remembered it? <Link href="/account/login">Sign in</Link>
          </p>
        </>
      )}
    </AuthShell>
  );
}
