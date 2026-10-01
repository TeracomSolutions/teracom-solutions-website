'use client';

import { useState } from 'react';
import Link from 'next/link';

import AdminBrand from '@/components/AdminBrand';

// Staff who have forgotten their password ask for a link here. The answer
// reads the same whether or not the address is a staff account.
export default function AdminForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setSending(true);
    setError('');
    try {
      const res = await fetch('/api/admin/password/forgot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || 'We could not send the link just now. Please try again shortly.');
        return;
      }
      setMessage(data.message);
    } catch {
      setError('We could not reach the sign-in service. Please try again in a moment.');
    } finally {
      setSending(false);
    }
  }

  return (
    <main id="main-content" className="admin-main">
      <section className="section section-spacious admin-section">
        <div className="container admin-container">
          <AdminBrand signedIn={false} />
        </div>
        <div className="container" style={{ maxWidth: '420px' }}>
          <h1>Forgot your password?</h1>
          {message ? (
            <>  
              <p className="form-note-banner" role="status">{message}</p>
              <p className="lead">Nothing after a few minutes? Check the junk folder, or ask another administrator to give you a new password from Account → Users.</p>
              <p><Link href="/admin/login">Back to sign in</Link></p>
            </>
          ) : (
            <>  
              <p className="lead">Enter your staff email address and we will email you a link to choose a new password.</p>
              <form onSubmit={handleSubmit} style={{ marginTop: '24px' }}>
                <div style={{ marginBottom: '16px' }}>
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="username"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    style={{ display: 'block', width: '100%' }}
                  />
                </div>
                {error && <p className="form-error" role="alert">{error}</p>}
                <button type="submit" className="btn btn-primary" disabled={sending}>
                  {sending ? 'Sending…' : 'Email me a link'}
                </button>
              </form>
              <p style={{ marginTop: '16px' }}><Link href="/admin/login">Back to sign in</Link></p>
            </>
          )}
        </div>
      </section>
    </main>
  );
}