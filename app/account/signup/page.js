'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthSwitchLink from '@/components/AuthSwitchLink';
import { CUSTOMER_INDUSTRIES, CUSTOMER_ROLES, EMAIL_TOPICS, toggleTopic } from '@/lib/customerTopics';
import { safeNextPath } from '@/lib/safeNext';
import Link from 'next/link';
import AuthShell from '@/components/AuthShell';
import { BadgePercent, ReceiptText, ShieldCheck, ShoppingCart, UserPlus, Wrench } from 'lucide-react';

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
  const [phone, setPhone] = useState('');
  const [accountType, setAccountType] = useState('individual');
  const [company, setCompany] = useState('');
  const [abn, setAbn] = useState('');
  const [role, setRole] = useState('');
  const [industry, setIndustry] = useState('');
  const [topics, setTopics] = useState([]);
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
          captcha_answer: captchaAnswer,
          phone,
          account_type: accountType,
          company: accountType === 'business' ? company : '',
          abn: accountType === 'business' ? abn : '',
          customer_role: role || null,
          industry: industry || null,
          email_topics: topics
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Signup failed.');
        return;
      }

      router.push(safeNextPath(new URLSearchParams(window.location.search).get('next')));
      router.refresh();
    } catch {
      setError('Unable to reach the signup service.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthShell
      eyebrow="Account"
      title="Create a free account."
      lead="It takes a couple of minutes, and unlocks every free design tool, the downloads and member pricing across the store."
      icon={UserPlus}
      badges={[BadgePercent, ShoppingCart, ShieldCheck]}
      benefits={[
        { icon: Wrench, text: 'Every free design tool, with PDF and Excel exports' },
        { icon: BadgePercent, text: 'Member pricing on store items' },
        { icon: ShoppingCart, text: 'Check out without re-entering your details' },
        { icon: ReceiptText, text: 'Order confirmations and invoices by email' },
      ]}
    >
      <h2>Create account</h2>
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

            <div style={{ marginBottom: '16px' }}>
              <label htmlFor="phone">Phone</label>
              <input
                id="phone"
                type="tel"
                required
                autoComplete="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0412 345 678"
                style={{ display: 'block', width: '100%' }}
              />
            </div>

            <fieldset className="auth-choice">
              <legend>Buying for</legend>
              <label className="auth-check">
                <input type="radio" name="accountType" checked={accountType === 'business'} onChange={() => setAccountType('business')} />
                <span>A business</span>
              </label>
              <label className="auth-check">
                <input type="radio" name="accountType" checked={accountType === 'individual'} onChange={() => setAccountType('individual')} />
                <span>Myself or my home</span>
              </label>
            </fieldset>

            {accountType === 'business' ? (
              <>
                <div style={{ marginBottom: '16px' }}>
                  <label htmlFor="company">Company name</label>
                  <input id="company" type="text" required autoComplete="organization" value={company} onChange={(e) => setCompany(e.target.value)} style={{ display: 'block', width: '100%' }} />
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label htmlFor="abn">ABN (optional)</label>
                  <input id="abn" type="text" inputMode="numeric" value={abn} onChange={(e) => setAbn(e.target.value)} placeholder="11 digits" style={{ display: 'block', width: '100%' }} />
                </div>
              </>
            ) : null}

            <div style={{ marginBottom: '16px' }}>
              <label htmlFor="role">What best describes you</label>
              <select id="role" required value={role} onChange={(e) => setRole(e.target.value)} style={{ display: 'block', width: '100%' }}>
                <option value="">Choose one</option>
                {CUSTOMER_ROLES.map((r) => <option key={r.key} value={r.key}>{r.label}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label htmlFor="industry">Which industry are you in</label>
              <select id="industry" required value={industry} onChange={(e) => setIndustry(e.target.value)} style={{ display: 'block', width: '100%' }}>
                <option value="">Choose one</option>
                {CUSTOMER_INDUSTRIES.map((i) => <option key={i.key} value={i.key}>{i.label}</option>)}
              </select>
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

            <fieldset className="auth-topics">
              <legend>Email me about (optional)</legend>
              {EMAIL_TOPICS.map((t) => (
                <label key={t.key} className="auth-check">
                  <input type="checkbox" checked={topics.includes(t.key)} onChange={(e) => setTopics(toggleTopic(topics, t.key, e.target.checked))} />
                  <span>{t.label}</span>
                </label>
              ))}
              <p className="auth-fine">Only what you tick, and you can change it or unsubscribe at any time from your account or any email.</p>
            </fieldset>

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

      <p className="auth-aside">
        Already have an account? <AuthSwitchLink href="/account/login">Sign in</AuthSwitchLink>
      </p>
    </AuthShell>
  );
}