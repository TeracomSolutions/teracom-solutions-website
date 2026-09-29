'use client';

import { useState } from 'react';

import { formatMoney } from '@/lib/products';

// Store -> Freight. Money is typed in dollars here and sent in cents.
function dollars(cents) {
  return cents == null ? '' : (cents / 100).toFixed(2);
}

function cents(value) {
  return Math.round(Number(value || 0) * 100);
}

function toggle(list, key) {
  return list.includes(key) ? list.filter((k) => k !== key) : [...list, key];
}

function formFrom(s) {
  return {
    minFee: dollars(s.min_fee_cents),
    includedKg: String(s.included_kg ?? ''),
    perKg: dollars(s.per_kg_cents),
    ownEnabled: Boolean(s.own_rate_enabled),
    ownLabel: s.own_rate_label || '',
    cubic: String(s.cubic_kg_per_m3 ?? ''),
    weight: String(s.default_weight_kg ?? ''),
    length: String(s.default_length_cm ?? ''),
    width: String(s.default_width_cm ?? ''),
    height: String(s.default_height_cm ?? ''),
    origin: s.origin_postcode || '',
    auspostEnabled: Boolean(s.auspost_enabled),
    auspostServices: s.auspost_services || [],
    auspostKey: '',
    startrackEnabled: Boolean(s.startrack_enabled),
    startrackProducts: s.startrack_products || [],
    stKey: '',
    stPassword: '',
    stAccount: '',
  };
}

export default function AdminFreightSettings({ initial }) {
  const [saved, setSaved] = useState(initial);
  const [form, setForm] = useState(() => formFrom(initial));
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [test, setTest] = useState({ postcode: '2000', weight: '', length: '', width: '', height: '', quantity: '1' });
  const [testResult, setTestResult] = useState(null);
  const [testError, setTestError] = useState('');

  const set = (key) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setForm((current) => ({ ...current, [key]: value }));
  };
  const setT = (key) => (event) => setTest((current) => ({ ...current, [key]: event.target.value }));

  async function send(body, label) {
    setBusy(label);
    setError('');
    setNotice('');
    try {
      const res = await fetch('/api/admin/freight/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || data.detail || 'That did not save.');
        return;
      }
      setSaved(data);
      setForm(formFrom(data));
      setNotice('Saved. The store uses these prices straight away.');
    } catch {
      setError('That did not save. Check your connection and try again.');
    } finally {
      setBusy('');
    }
  }

  function save(event) {
    event.preventDefault();
    send({
      min_fee_cents: cents(form.minFee),
      included_kg: Number(form.includedKg || 0),
      per_kg_cents: cents(form.perKg),
      own_rate_enabled: form.ownEnabled,
      own_rate_label: form.ownLabel,
      cubic_kg_per_m3: Number(form.cubic || 0),
      default_weight_kg: Number(form.weight || 0),
      default_length_cm: Number(form.length || 0),
      default_width_cm: Number(form.width || 0),
      default_height_cm: Number(form.height || 0),
      origin_postcode: form.origin,
      auspost_enabled: form.auspostEnabled,
      auspost_services: form.auspostServices,
      startrack_enabled: form.startrackEnabled,
      startrack_products: form.startrackProducts,
      ...(form.auspostKey ? { auspost_key: form.auspostKey } : {}),
      ...(form.stKey ? { startrack_api_key: form.stKey } : {}),
      ...(form.stPassword ? { startrack_password: form.stPassword } : {}),
      ...(form.stAccount ? { startrack_account_number: form.stAccount } : {}),
    }, 'save');
  }

  function clearAuspost() {
    if (!window.confirm('Remove the saved Australia Post key? Australia Post prices stop until a new key is saved.')) return;
    send({ clear_auspost_key: true }, 'clear-auspost');
  }

  function clearStartrack() {
    if (!window.confirm('Remove the saved StarTrack details? StarTrack prices stop until new ones are saved.')) return;
    send({ clear_startrack: true }, 'clear-startrack');
  }

  async function tryQuote(event) {
    event.preventDefault();
    setBusy('quote');
    setTestError('');
    setTestResult(null);
    try {
      const res = await fetch('/api/admin/freight/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postcode: test.postcode,
          item: { quantity: test.quantity, weight_kg: test.weight, length_cm: test.length, width_cm: test.width, height_cm: test.height },
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setTestError(data.error || data.detail || 'That did not work.');
        return;
      }
      setTestResult(data);
    } catch {
      setTestError('That did not work. Check your connection and try again.');
    } finally {
      setBusy('');
    }
  }

  const auspostChoices = Object.entries(saved.auspost_service_choices || {});
  const startrackChoices = Object.entries(saved.startrack_product_choices || {});

  return (
    <div className="admin-freight">
      <form className="admin-form admin-freight-form" onSubmit={save}>
        <fieldset className="admin-card admin-freight-group">
          <legend>Our own rate</legend>
          <p className="admin-muted">Used for every order unless a carrier below is switched on, and always used when no carrier answers. Worked out from the chargeable weight of the order.</p>
          <label>
            Minimum charge ($, including GST)
            <input type="number" min="0" step="0.01" required value={form.minFee} onChange={set('minFee')} />
          </label>
          <label>
            Weight covered by the minimum (kg)
            <input type="number" min="0" step="0.1" required value={form.includedKg} onChange={set('includedKg')} />
          </label>
          <label>
            Each extra kilo or part of one ($)
            <input type="number" min="0" step="0.01" required value={form.perKg} onChange={set('perKg')} />
          </label>
          <label>
            Name customers see
            <input type="text" maxLength={60} required value={form.ownLabel} onChange={set('ownLabel')} />
          </label>
          <label className="admin-check">
            <input type="checkbox" checked={form.ownEnabled} onChange={set('ownEnabled')} />
            Offer our own rate at checkout
          </label>
        </fieldset>

        <fieldset className="admin-card admin-freight-group">
          <legend>Size and weight</legend>
          <p className="admin-muted">Carriers charge on whichever is more: the real weight or the cubic weight (length × width × height in metres × the factor). A product with no weight or size yet is sent as the default parcel.</p>
          <label>
            Cubic weight factor (kg per cubic metre)
            <input type="number" min="0" step="1" required value={form.cubic} onChange={set('cubic')} />
          </label>
          <div className="admin-freight-row">
            <label>
              Default weight (kg)
              <input type="number" min="0.01" step="0.01" required value={form.weight} onChange={set('weight')} />
            </label>
            <label>
              Length (cm)
              <input type="number" min="0.1" step="0.1" required value={form.length} onChange={set('length')} />
            </label>
            <label>
              Width (cm)
              <input type="number" min="0.1" step="0.1" required value={form.width} onChange={set('width')} />
            </label>
            <label>
              Height (cm)
              <input type="number" min="0.1" step="0.1" required value={form.height} onChange={set('height')} />
            </label>
          </div>
          <label>
            Sent from postcode
            <input type="text" inputMode="numeric" pattern="\d{4}" maxLength={4} required value={form.origin} onChange={set('origin')} />
          </label>
        </fieldset>

        <fieldset className="admin-card admin-freight-group">
          <legend>Australia Post</legend>
          <p className="admin-muted">Live prices from Australia Post&apos;s Postage Assessment Calculator. The key is free from developers.auspost.com.au. Parcels over 22 kg or 105 cm are not offered.</p>
          <label className="admin-check">
            <input type="checkbox" checked={form.auspostEnabled} onChange={set('auspostEnabled')} />
            Offer Australia Post at checkout
          </label>
          <div className="admin-freight-choices">
            {auspostChoices.map(([key, label]) => (
              <label className="admin-check" key={key}>
                <input
                  type="checkbox"
                  checked={form.auspostServices.includes(key)}
                  onChange={() => setForm((current) => ({ ...current, auspostServices: toggle(current.auspostServices, key) }))}
                />
                {label}
              </label>
            ))}
          </div>
          <label>
            API key {saved.auspost_key_set ? <span className="admin-muted">(saved; leave blank to keep it)</span> : null}
            <input type="password" autoComplete="off" value={form.auspostKey} onChange={set('auspostKey')} />
          </label>
          {saved.auspost_key_set ? (
            <div className="admin-actions">
              <button type="button" className="btn btn-secondary btn-sm" onClick={clearAuspost} disabled={Boolean(busy)}>Remove key</button>
            </div>
          ) : null}
        </fieldset>

        <fieldset className="admin-card admin-freight-group">
          <legend>StarTrack</legend>
          <p className="admin-muted">Live prices from a StarTrack business account, through the Australia Post developer centre linked to that account.</p>
          <label className="admin-check">
            <input type="checkbox" checked={form.startrackEnabled} onChange={set('startrackEnabled')} />
            Offer StarTrack at checkout
          </label>
          <div className="admin-freight-choices">
            {startrackChoices.map(([key, label]) => (
              <label className="admin-check" key={key}>
                <input
                  type="checkbox"
                  checked={form.startrackProducts.includes(key)}
                  onChange={() => setForm((current) => ({ ...current, startrackProducts: toggle(current.startrackProducts, key) }))}
                />
                {label}
              </label>
            ))}
          </div>
          {saved.startrack_set ? <p className="admin-muted">Saved for account {saved.startrack_account_hint || ''}. Leave the boxes blank to keep the saved details.</p> : null}
          <label>
            API key
            <input type="password" autoComplete="off" value={form.stKey} onChange={set('stKey')} />
          </label>
          <label>
            API password
            <input type="password" autoComplete="off" value={form.stPassword} onChange={set('stPassword')} />
          </label>
          <label>
            Account number
            <input type="text" autoComplete="off" value={form.stAccount} onChange={set('stAccount')} />
          </label>
          {saved.startrack_set ? (
            <div className="admin-actions">
              <button type="button" className="btn btn-secondary btn-sm" onClick={clearStartrack} disabled={Boolean(busy)}>Remove StarTrack details</button>
            </div>
          ) : null}
        </fieldset>

        <div className="admin-freight-messages" aria-live="polite">
          {error && <p className="form-error" role="alert">{error}</p>}
          {notice && <p className="form-note-banner" role="status">{notice}</p>}
        </div>
        <div className="admin-actions">
          <button type="submit" className="btn btn-primary" disabled={Boolean(busy)}>{busy === 'save' ? 'Saving…' : 'Save freight settings'}</button>
        </div>
      </form>

      <form className="admin-form admin-card admin-freight-try" onSubmit={tryQuote}>
        <h2>Try a quote</h2>
        <p className="admin-muted">What a customer would be offered for one product sent to a postcode, using the saved settings. Leave the size blank to use the default parcel.</p>
        <div className="admin-freight-row">
          <label>
            Postcode
            <input type="text" inputMode="numeric" maxLength={4} required value={test.postcode} onChange={setT('postcode')} />
          </label>
          <label>
            Quantity
            <input type="number" min="1" max="100" required value={test.quantity} onChange={setT('quantity')} />
          </label>
          <label>
            Weight (kg)
            <input type="number" min="0" step="0.01" value={test.weight} onChange={setT('weight')} />
          </label>
          <label>
            Length (cm)
            <input type="number" min="0" step="0.1" value={test.length} onChange={setT('length')} />
          </label>
          <label>
            Width (cm)
            <input type="number" min="0" step="0.1" value={test.width} onChange={setT('width')} />
          </label>
          <label>
            Height (cm)
            <input type="number" min="0" step="0.1" value={test.height} onChange={setT('height')} />
          </label>
        </div>
        <div className="admin-freight-messages" aria-live="polite">
          {testError && <p className="form-error" role="alert">{testError}</p>}
          {testResult ? (
            <div className="admin-freight-result">
              <p className="admin-muted">Chargeable weight {testResult.chargeable_kg} kg to {testResult.postcode}.</p>
              <ul>
                {(testResult.options || []).map((option) => (
                  <li key={option.key}>
                    <strong>{option.label}</strong>: {formatMoney(option.cents)}
                    {option.note ? <span className="admin-muted"> ({option.note})</span> : null}
                  </li>
                ))}
              </ul>
              {(testResult.errors || []).map((message) => (
                <p className="form-error" key={message}>{message}</p>
              ))}
            </div>
          ) : null}
        </div>
        <div className="admin-actions">
          <button type="submit" className="btn btn-secondary" disabled={Boolean(busy)}>{busy === 'quote' ? 'Pricing…' : 'Get prices'}</button>
        </div>
      </form>
    </div>
  );
}