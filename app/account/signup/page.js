'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CustomerSignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('NSW');
  const [postcode, setPostcode] = useState('');
  const [captchaQuestion, setCaptchaQuestion] = useState(null);
  const [captchaToken, setCaptchaToken] = useState('');
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadCaptcha() {
      try {
        const res = await fetch('/api/customer/captcha');
        const data = await res.json();
        if (res.ok) {
          setCaptchaQuestion(data.question);
          setCaptchaToken(data.token);
        } else {
          setError('Unable to load the verification question.');
        }
      } catch {
        setError('Unable to load the verification question.');
      }
    }

    loadCaptcha();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const res = await fetch('/api/customer/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          first_name: firstName,
          last_name: lastName,
          shipping_address_line1: addressLine1,
          shipping_address_line2: addressLine2,
          shipping_city: city,
          shipping_state: state,
          shipping_postcode: postcode,
          captcha_token: captchaToken,
          captcha_answer: captchaAnswer
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Signup failed.');
        return;
      }

      router.push('/account');
      router.refresh();
    } catch {
      setError('Unable to reach the signup service.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main>
      <section className="section section-spacious">
        <div className="container" style={{ maxWidth: '420px' }}>
          <h1>Create your account</h1>
          <p className="lead">Sign up to view pricing and use the store.</p>

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
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ display: 'block', width: '100%' }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label htmlFor="firstName">First Name</label>
              <input
                id="firstName"
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                style={{ display: 'block', width: '100%' }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label htmlFor="lastName">Last Name</label>
              <input
                id="lastName"
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                style={{ display: 'block', width: '100%' }}
              />
            </div>

            <p>We ship within Australia only -- no PO Boxes, locked bags, or parcel lockers.</p>

            <div style={{ marginBottom: '16px' }}>
              <label htmlFor="addressLine1">Address Line 1</label>
              <input
                id="addressLine1"
                type="text"
                required
                value={addressLine1}
                onChange={(e) => setAddressLine1(e.target.value)}
                style={{ display: 'block', width: '100%' }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label htmlFor="addressLine2">Address Line 2</label>
              <input
                id="addressLine2"
                type="text"
                value={addressLine2}
                onChange={(e) => setAddressLine2(e.target.value)}
                style={{ display: 'block', width: '100%' }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label htmlFor="city">City</label>
              <input
                id="city"
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                style={{ display: 'block', width: '100%' }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label htmlFor="state">State</label>
              <select
                id="state"
                value={state}
                onChange={(e) => setState(e.target.value)}
                style={{ display: 'block', width: '100%' }}
              >
                <option value="NSW">NSW</option>
                <option value="VIC">VIC</option>
                <option value="QLD">QLD</option>
                <option value="WA">WA</option>
                <option value="SA">SA</option>
                <option value="TAS">TAS</option>
                <option value="ACT">ACT</option>
                <option value="NT">NT</option>
              </select>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label htmlFor="postcode">Postcode</label>
              <input
                id="postcode"
                type="text"
                required
                value={postcode}
                onChange={(e) => setPostcode(e.target.value)}
                style={{ display: 'block', width: '100%' }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label>{captchaQuestion ? `What is ${captchaQuestion}?` : 'Loading verification question...'}</label>
              <input
                type="text"
                required
                value={captchaAnswer}
                onChange={(e) => setCaptchaAnswer(e.target.value)}
                style={{ display: 'block', width: '100%' }}
              />
            </div>

            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}

            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <p style={{ marginTop: '24px', textAlign: 'center' }}>
            Already have an account? <a href="/account/login">Sign in</a>
          </p>
        </div>
      </section>
    </main>
  );
}