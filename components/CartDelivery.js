'use client';

import { useCallback, useEffect, useState } from 'react';
import { Truck } from 'lucide-react';

import { formatMoney } from '@/lib/products';
import { cleanPostcode } from '@/lib/freightParcels';
import { readPostcode, writePostcode } from '@/lib/cartPostcode';

// The cart's delivery price. The customer types their postcode and sees
// every option we offer; the cheapest goes in the order summary. They pick
// the option itself when they pay, and checkout prices it again on the
// server from the same postcode.
export default function CartDelivery({ lines, savedPostcode = '', onQuote }) {
  const [postcode, setPostcode] = useState('');
  const [options, setOptions] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const cartKey = JSON.stringify(lines.map((line) => ({ productId: line.productId, quantity: line.quantity })));

  const fetchQuote = useCallback(
    async (code) => {
      const clean = cleanPostcode(code);
      if (!clean) {
        setError('Enter a four-digit Australian postcode.');
        return;
      }
      setBusy(true);
      setError('');
      try {
        const res = await fetch('/api/freight/quote', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ postcode: clean, items: JSON.parse(cartKey) }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setOptions(null);
          onQuote({ postcode: '', cents: null });
          setError(data.error || 'We could not price delivery just now.');
          return;
        }
        const list = data.options || [];
        setOptions(list);
        writePostcode(clean);
        onQuote({ postcode: clean, cents: list.length ? list[0].cents : null });
      } catch {
        setError('We could not price delivery just now. Check your connection and try again.');
      } finally {
        setBusy(false);
      }
    },
    [cartKey, onQuote]
  );

  // Start from the postcode priced last time, or the one on the account,
  // and price again whenever the cart changes.
  useEffect(() => {
    const start = readPostcode() || cleanPostcode(savedPostcode);
    if (start) {
      setPostcode(start);
      fetchQuote(start);
    }
  }, [fetchQuote, savedPostcode]);

  function submit(event) {
    event.preventDefault();
    fetchQuote(postcode);
  }

  return (
    <form className="cart-delivery" onSubmit={submit}>
      <label htmlFor="cart-postcode">
        <Truck size={16} strokeWidth={1.9} aria-hidden="true" /> Delivery postcode
      </label>
      <div className="cart-delivery-row">
        <input
          id="cart-postcode"
          type="text"
          inputMode="numeric"
          autoComplete="postal-code"
          maxLength={4}
          placeholder="e.g. 3000"
          value={postcode}
          onChange={(event) => setPostcode(event.target.value)}
        />
        <button type="submit" className="btn btn-secondary btn-sm" disabled={busy}>
          {busy ? 'Pricing…' : 'Get price'}
        </button>
      </div>
      {error ? <p className="form-error" role="alert">{error}</p> : null}
      {options && options.length ? (
        <>
          <ul className="cart-delivery-options">
            {options.map((option) => (
              <li key={option.key}>
                <span>{option.label}</span>
                <strong>{formatMoney(option.cents)}</strong>
              </li>
            ))}
          </ul>
          <p className="cart-delivery-note">You choose the delivery option when you pay.</p>
        </>
      ) : null}
    </form>
  );
}