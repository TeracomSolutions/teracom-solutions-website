'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { BadgePercent, Check, Pencil, Plus, X } from 'lucide-react';

// Issuing a discount by hand.
//
// Deliberately narrow: the two things Robert actually described are "give a
// customer a particular discount" and "a code for a promotion". Everything
// the backend can express is not on this form -- a screen with fifteen
// optional fields is how someone accidentally creates a code with no expiry
// and no limit.

import { couponToForm, couponPatch } from '@/lib/couponEdit';

const BLANK = {
  code: '',
  label: '',
  discount_type: 'percent',
  discount_value: '',
  max_discount_cents: '',
  min_subtotal_cents: '',
  expires_at: '',
  max_redemptions: '',
  restricted_to_tier: '',
  internal_note: '',
};

function money(cents) {
  return '$' + ((cents || 0) / 100).toFixed(2);
}

function dollarsToCents(value) {
  const n = Number(String(value).replace(/[^0-9.]/g, ''));
  return Number.isFinite(n) && n > 0 ? Math.round(n * 100) : null;
}

export default function AdminCouponManager({ initialCoupons = [] }) {
  const [coupons, setCoupons] = useState(initialCoupons);
  const [form, setForm] = useState(BLANK);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [editing, setEditing] = useState(null);
  const formRef = useRef(null);

  const set = (field) => (event) => setForm((f) => ({ ...f, [field]: event.target.value }));

  function startEdit(coupon) {
    setError('');
    setNotice('');
    setEditing(coupon);
    setForm({
      ...BLANK,
      code: coupon.code,
      discount_type: coupon.discount_type,
      discount_value: String(coupon.discount_type === 'percent' ? coupon.discount_value : (coupon.discount_value / 100).toFixed(2)),
      restricted_to_tier: coupon.restricted_to_tier || '',
      ...couponToForm(coupon)
    });
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  function cancelEdit() {
    setEditing(null);
    setForm(BLANK);
    setError('');
    setNotice('');
  }

  const refresh = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/coupons');
      const data = await res.json();
      if (res.ok) setCoupons(data.coupons || []);
    } catch {
      // Leave the list as it was; the page still works for creating.
    }
  }, []);

  useEffect(() => {
    if (initialCoupons.length === 0) refresh();
  }, [initialCoupons.length, refresh]);

  async function handleCreate(event) {
    event.preventDefault();
    setError('');
    setNotice('');

    const value = Number(form.discount_value);
    if (!Number.isFinite(value) || value <= 0) {
      setError('Enter a discount amount.');
      return;
    }
    if (form.discount_type === 'percent' && value > 100) {
      setError('A percentage cannot be more than 100.');
      return;
    }

    const payload = {
      code: form.code.trim().toUpperCase(),
      label: form.label.trim(),
      discount_type: form.discount_type,
      // Percent is a whole number; a fixed amount is typed in dollars and
      // stored in cents, because money in this system is always cents.
      discount_value: form.discount_type === 'percent' ? Math.round(value) : Math.round(value * 100),
    };

    if (form.max_discount_cents) payload.max_discount_cents = dollarsToCents(form.max_discount_cents);
    if (form.min_subtotal_cents) payload.min_subtotal_cents = dollarsToCents(form.min_subtotal_cents);
    if (form.max_redemptions) payload.max_redemptions = Number(form.max_redemptions);
    if (form.restricted_to_tier) payload.restricted_to_tier = form.restricted_to_tier;
    if (form.internal_note.trim()) payload.internal_note = form.internal_note.trim();
    if (form.expires_at) {
      // A date with no time expires at the end of that day, not the start --
      // "expires 31 October" should include the 31st.
      payload.expires_at = new Date(`${form.expires_at}T23:59:59`).toISOString();
    }

    setStatus('saving');
    try {
      const res = await fetch('/api/admin/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Could not create that code.');
        setStatus('idle');
        return;
      }
      setNotice(`${data.code} created.`);
      setForm(BLANK);
      setStatus('idle');
      refresh();
    } catch {
      setError('Could not reach the coupon service.');
      setStatus('idle');
    }
  }

  async function handleSave(event) {
    event.preventDefault();
    if (!editing) return handleCreate(event);

    const patch = couponPatch(editing, form);
    if (Object.keys(patch).length === 0) {
      cancelEdit();
      return;
    }

    setStatus('saving');
    try {
      const res = await fetch('/api/admin/coupons', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: editing.code, ...patch }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Could not save that code.');
        setStatus('idle');
        return;
      }
      setNotice(`${editing.code} updated.`);
      setEditing(null);
      setForm(BLANK);
      setStatus('idle');
      refresh();
    } catch {
      setError('Could not reach the coupon service.');
      setStatus('idle');
    }
  }

  async function toggle(coupon) {
    setError('');
    setNotice('');
    try {
      const res = await fetch('/api/admin/coupons', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: coupon.code, active: !coupon.active }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'Could not change that code.');
        return;
      }
      setNotice(`${coupon.code} ${coupon.active ? 'switched off' : 'switched on'}.`);
      refresh();
    } catch {
      setError('Could not reach the coupon service.');
    }
  }

  return (
    <>
      <form ref={formRef} className="coupon-admin-form" onSubmit={handleSave}>
        <h2>
          {editing ? (
            <>
              <Pencil size={18} strokeWidth={2} aria-hidden="true" /> Edit {editing.code}
            </>
          ) : (
            <>
              <Plus size={18} strokeWidth={2} aria-hidden="true" /> New discount code
            </>
          )}
        </h2>

        <div className="coupon-admin-grid">
          <label>
            Code
            <input
              required
              value={form.code}
              onChange={set('code')}
              placeholder="SPRING25"
              autoCapitalize="characters"
              spellCheck="false"
              disabled={!!editing}
            />
            {editing && (
              <small>Cannot change on an existing code. Switch it off and create a new one instead.</small>
            )}
          </label>

          <label>
            What the customer sees
            <input required value={form.label} onChange={set('label')} placeholder="25% off this spring" />
          </label>

          <label>
            Type
            <select value={form.discount_type} onChange={set('discount_type')} disabled={!!editing}>
              <option value="percent">Percentage off</option>
              <option value="fixed">Fixed amount off</option>
            </select>
          </label>

          <label>
            {form.discount_type === 'percent' ? 'Percent off' : 'Amount off (dollars)'}
            <input
              required
              inputMode="decimal"
              value={form.discount_value}
              onChange={set('discount_value')}
              placeholder={form.discount_type === 'percent' ? '10' : '50'}
              disabled={!!editing}
            />
          </label>

          {form.discount_type === 'percent' ? (
            <label>
              Most it can take off (optional)
              <input
                inputMode="decimal"
                value={form.max_discount_cents}
                onChange={set('max_discount_cents')}
                placeholder="200"
              />
              <small>Dollars. Stops 20% off becoming thousands on a big order.</small>
            </label>
          ) : null}

          <label>
            Minimum order (optional)
            <input
              inputMode="decimal"
              value={form.min_subtotal_cents}
              onChange={set('min_subtotal_cents')}
              placeholder="500"
            />
            <small>Dollars.</small>
          </label>

          <label>
            Expires (optional)
            <input type="date" value={form.expires_at} onChange={set('expires_at')} />
            <small>Works until the end of this day.</small>
          </label>

          <label>
            Total uses (optional)
            <input
              inputMode="numeric"
              value={form.max_redemptions}
              onChange={set('max_redemptions')}
              placeholder="1"
            />
            <small>Leave blank for unlimited. 1 = single use.</small>
          </label>

          <label>
            Only for a trade tier (optional)
            <select value={form.restricted_to_tier} onChange={set('restricted_to_tier')} disabled={!!editing}>
              <option value="">Anyone</option>
              <option value="Silver">Silver only</option>
              <option value="Gold">Gold only</option>
              <option value="Platinum">Platinum only</option>
            </select>
          </label>

          <label className="coupon-admin-wide">
            Note to yourself (optional)
            <input
              value={form.internal_note}
              onChange={set('internal_note')}
              placeholder="Agreed with Dave at the trade night"
            />
            <small>Never shown to the customer.</small>
          </label>
        </div>

        {error ? (
          <p className="form-error" role="alert">
            {error}
          </p>
        ) : null}
        {notice ? (
          <p className="auth-sent" role="status">
            {notice}
          </p>
        ) : null}

        {editing ? (
        <>
          <button type="submit" className="btn btn-primary" disabled={status === 'saving'}>
            {status === 'saving' ? 'Saving…' : 'Save changes'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={cancelEdit}>Cancel</button>
        </>
      ) : (
        <button type="submit" className="btn btn-primary" disabled={status === 'saving'}>
          {status === 'saving' ? 'Creating…' : 'Create code'}
        </button>
      )}
      </form>

      <h2 className="coupon-admin-list-heading">
        <BadgePercent size={18} strokeWidth={2} aria-hidden="true" /> Existing codes
      </h2>

      {coupons.length === 0 ? (
        <p className="form-note">No codes yet.</p>
      ) : (
        <div className="coupon-admin-table-wrap">
          <table className="coupon-admin-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Discount</th>
                <th>Limits</th>
                <th>Used</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {coupons.map((c) => (
                <tr key={c.id} className={c.active ? '' : 'coupon-admin-off'}>
                  <td>
                    <strong>{c.code}</strong>
                    <br />
                    <small>{c.label}</small>
                  </td>
                  <td>
                    {c.discount_type === 'percent' ? `${c.discount_value}%` : money(c.discount_value)}
                  </td>
                  <td>
                    <small>
                      {c.expires_at ? `Until ${c.expires_at.slice(0, 10)}` : 'No expiry'}
                      {c.max_redemptions ? ` · max ${c.max_redemptions}` : ''}
                      {c.restricted_to_tier ? ` · ${c.restricted_to_tier} only` : ''}
                      {c.restricted_to_customer_id ? ' · one customer' : ''}
                    </small>
                  </td>
                  <td>{c.redemptions}</td>
                  <td>{c.active ? 'Active' : 'Off'}</td>
                  <td>
                    <button type="button" className="btn btn-secondary coupon-admin-toggle" onClick={() => startEdit(c)}><Pencil size={14} strokeWidth={2.2} aria-hidden="true" /> Edit</button>
                    <button type="button" className="btn btn-secondary coupon-admin-toggle" onClick={() => toggle(c)}>
                      {c.active ? (
                        <>
                          <X size={14} strokeWidth={2.2} aria-hidden="true" /> Switch off
                        </>
                      ) : (
                        <>
                          <Check size={14} strokeWidth={2.2} aria-hidden="true" /> Switch on
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
