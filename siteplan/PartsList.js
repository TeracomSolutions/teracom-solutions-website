'use client';

import { useEffect, useState } from 'react';
import { Send, ShoppingCart } from 'lucide-react';

import { tagged } from './brand.js';
import { partsList, pricedParts } from './quote.js';

const money = (cents) => `$${(cents / 100).toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

// Parts and price (Robert, 2026-11-06): the plan as a shopping list. Each kind of device
// and each cable gets a product from the host's shop (the first suggestion unless one is
// chosen; picks are saved on the plan), then it all goes in the cart or to Sales as a
// request for an installed quote. Without a `shop` it lists the parts with shop links.
export default function PartsList({ plan, brand, shop, onChange }) {
  const lines = partsList(plan);
  const keys = lines.filter((l) => l.searchable).map((l) => l.key).join(',');
  const [options, setOptions] = useState({});
  const [signedIn, setSignedIn] = useState(true);
  // The keys the last answer was for: while they differ from the plan's, the shop is being asked.
  const [answered, setAnswered] = useState(null);
  const [note, setNote] = useState('');
  const [asking, setAsking] = useState(false);
  const [form, setForm] = useState({ site: '', phone: '', notes: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (!shop?.findParts || !keys) return undefined;
    let live = true;
    shop.findParts(keys.split(','))
      .then((answer) => {
        if (!live) return;
        setOptions(answer?.parts || {});
        setSignedIn(answer?.signedIn !== false);
      })
      .catch(() => live && setNote('The shop could not be reached, so there are no products or prices yet.'))
      .finally(() => live && setAnswered(keys));
    return () => {
      live = false;
    };
  }, [shop, keys]);

  if (!lines.length) return null;
  const loading = Boolean(shop?.findParts) && answered !== keys;
  const parts = plan.parts || {};
  const priced = pricedParts(lines, parts, options);
  const pick = (key, change) => onChange({ ...parts, [key]: { ...(parts[key] || {}), ...change } });
  const inCart = priced.rows.filter((r) => r.product && r.qty > 0);

  const addToCart = () => {
    shop.addToCart(inCart.map((r) => ({ id: r.product.id, qty: r.qty })));
    const capped = shop.maxQty ? inCart.filter((r) => r.qty > shop.maxQty).length : 0;
    setNote(`Added ${inCart.length} item${inCart.length === 1 ? '' : 's'} to your cart.${capped ? ` The online cart takes up to ${shop.maxQty} of each; ask for an installed quote for more.` : ''}`);
  };

  const send = async (event) => {
    event.preventDefault();
    setSending(true);
    setNote('');
    try {
      const answer = await shop.requestQuote({
        planName: plan.name || '',
        deviceCount: plan.devices.length,
        ...form,
        lines: priced.rows.map((r) => ({ key: r.key, qty: r.qty, productId: r.product?.id || '', ...(r.metres ? { metres: r.metres } : {}) })),
      });
      if (answer?.ok) {
        setSent(true);
        setAsking(false);
      } else setNote(answer?.error || 'It did not send. Try again, or email us.');
    } catch {
      setNote('It did not send. Try again, or email us.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="site-planner-parts">
      <div className="site-planner-schedule-head">
        <h2>Parts and price</h2>
        {shop?.addToCart ? (
          <div className="site-planner-parts-actions">
            <button type="button" className="btn btn-primary" onClick={addToCart} disabled={!inCart.length}>
              <ShoppingCart size={18} strokeWidth={2} aria-hidden="true" /> Add to cart
            </button>
            {shop.requestQuote ? (
              <button type="button" className="btn btn-secondary" onClick={() => setAsking(!asking)} aria-expanded={asking}>
                <Send size={18} strokeWidth={2} aria-hidden="true" /> Ask for an installed quote
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
      <p className="form-note">
        One line for each kind of device on the plan and each cable to order. We suggest a product from the {brand.name} store for
        each; choose another or change the quantity, and your choices are saved with the plan.
      </p>
      {!(plan.pxPerMetre > 0) && lines.some((l) => l.kind === 'cable') ? (
        <p className="form-note-banner">Set the scale on the plan to work out how much cable to order.</p>
      ) : null}
      {!signedIn ? <p className="form-note-banner"><a href="/account/login">Sign in</a> to see your prices.</p> : null}
      <div className="site-planner-table">
        <table>
          <thead>
            <tr><th>Item</th><th>Product</th><th>Qty</th><th>Each</th><th>Total</th></tr>
          </thead>
          <tbody>
            {priced.rows.map((row) => {
              const choices = options[row.key] || [];
              return (
                <tr key={row.key}>
                  <td>
                    {row.label}
                    <div className="site-planner-parts-sub">
                      {row.kind === 'cable' ? `${row.metres ? `${row.metres} m, ` : ''}in ${row.unit}${row.unit.endsWith('box') ? 'es' : 's'}` : `${lines.find((l) => l.key === row.key)?.qty} on the plan`}
                    </div>
                  </td>
                  <td>
                    {choices.length ? (
                      <>
                        <select
                          aria-label={`Product for ${row.label}`}
                          value={row.product ? row.product.id : ''}
                          onChange={(e) => pick(row.key, { id: e.target.value })}
                        >
                          {choices.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                          <option value="">None from the store (quote it for me)</option>
                        </select>
                        {row.product ? <a className="site-planner-parts-link" href={row.product.href} target="_blank" rel="noopener noreferrer">View</a> : null}
                      </>
                    ) : (
                      <span className="site-planner-missing">
                        {loading && row.searchable ? 'Looking in the store...' : 'Not in the online store yet; we quote it'}
                        {' · '}
                        <a href={tagged(brand.storeSearchUrl, 'planner', { q: row.label })} target="_blank" rel="noopener noreferrer">Search the store</a>
                      </span>
                    )}
                  </td>
                  <td>
                    <input
                      className="site-planner-parts-qty"
                      type="number"
                      min="0"
                      max="9999"
                      step="1"
                      aria-label={`Quantity of ${row.label}`}
                      value={row.qty}
                      onChange={(e) => pick(row.key, { qty: Math.max(0, Math.min(9999, Math.floor(Number(e.target.value)) || 0)) })}
                    />
                  </td>
                  <td>{row.unitCents === null ? '' : money(row.unitCents)}</td>
                  <td>{row.lineCents === null ? '' : money(row.lineCents)}</td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={4}><strong>Parts total</strong> (inc. GST, before freight and installation)</td>
              <td><strong>{money(priced.totalCents)}</strong></td>
            </tr>
          </tfoot>
        </table>
      </div>
      {priced.unpriced && signedIn ? (
        <p className="form-note">
          {priced.unpriced} line{priced.unpriced === 1 ? ' is' : 's are'} not priced online. Ask for an installed quote and we will price
          {priced.unpriced === 1 ? ' it' : ' them'} with the installation.
        </p>
      ) : null}
      {sent ? (
        <p className="form-note-banner" role="status">
          Sent. Our team has your plan&apos;s parts list and will come back to you by email. To send the plan itself, reply to that
          email with the plan file or the Excel workbook.
        </p>
      ) : null}
      {asking ? (
        <form className="site-planner-parts-form" onSubmit={send}>
          <p className="form-note">
            We will price the parts above with the cabling, installation and setting up, and come back to you by email. It goes from
            your account, so we know who to reply to.
          </p>
          <div className="field">
            <label htmlFor="quote-site">Where is the site? (suburb or address)</label>
            <input id="quote-site" type="text" maxLength={200} value={form.site} onChange={(e) => setForm({ ...form, site: e.target.value })} />
          </div>
          <div className="field">
            <label htmlFor="quote-phone">Phone (optional)</label>
            <input id="quote-phone" type="tel" maxLength={40} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div className="field">
            <label htmlFor="quote-notes">Anything we should know? (optional)</label>
            <textarea id="quote-notes" rows={3} maxLength={2000} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </div>
          <button type="submit" className="btn btn-primary" disabled={sending}>
            <Send size={18} strokeWidth={2} aria-hidden="true" /> {sending ? 'Sending...' : 'Send the quote request'}
          </button>
        </form>
      ) : null}
      {note ? <p className="form-note" role="status">{note}{note.startsWith('Added') && shop?.cartHref ? <> <a href={shop.cartHref}>Go to the cart</a></> : null}</p> : null}
    </div>
  );
}
