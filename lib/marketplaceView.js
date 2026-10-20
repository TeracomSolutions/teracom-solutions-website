import { cents } from './orderView.js';

export function statusSentences(status) {
  if (!status || status.mode === 'off' || !status.mode) {
    return ['Marketplace connections are switched off. Nothing is searched or ordered.'];
  }
  const sentences = [];
  sentences.push(status.mode === 'live'
    ? 'Marketplace connections are on.'
    : 'Marketplace connections are read only: you can search and import drafts.');
  sentences.push(status.orders_enabled
    ? 'Sending orders to suppliers is switched on; each order still needs your approval.'
    : 'Sending orders to suppliers is switched off.');
  if (!status.privacy_updated) {
    sentences.push('Real overseas suppliers stay blocked until the privacy policy update setting is switched on.');
  }
  return sentences;
}

export function productStatusLabel(s) {
  if (s === 'draft') return 'Waiting for your approval';
  if (s === 'approved') return 'Approved';
  if (s === 'rejected') return 'Rejected';
  return String(s || '');
}

export function orderStatusLabel(s) {
  if (s === 'pending') return 'Ready to send';
  if (s === 'submitted') return 'Sent to the supplier';
  if (s === 'shipped') return 'Shipped';
  if (s === 'failed') return 'Failed';
  return String(s || '');
}

export function priceSummary(price) {
  if (!price) return { text: '', blocked: false };
  if (price.blocked) return { text: price.reason || 'The price is at or below cost.', blocked: true };
  const margin = cents(price.margin_cents);
  const pct = price.margin_percent == null ? '' : ' (' + price.margin_percent + '%)';
  return { text: 'Sell at ' + cents(price.price_cents) + ' inc GST. Margin ' + margin + pct + ' ex GST.', blocked: false };
}

export function originNote(country) {
  if (!country || country === 'AU') return '';
  return 'Ships from overseas (' + country + '): say so on the product page and show an honest delivery time.';
}

export function orderPreview(payload) {
  const p = payload || {};
  const reference = p.order_ref || '';
  const items = (p.items || []).map(function(item) {
    return item.quantity + ' x ' + item.provider_product_id;
  });
  const r = p.recipient || {};
  const lines = [];
  if (r.name) lines.push(r.name);
  if (r.phone) lines.push(r.phone);
  if (r.email) lines.push(r.email);
  const addr = r.address || {};
  const parts = [addr.line1, addr.line2, addr.city, addr.state, addr.postcode, addr.country].filter(Boolean);
  if (parts.length) lines.push(parts.join(', '));
  return { reference: reference, items: items, recipient: lines };
}

export function canSubmit(order, status) {
  return !!order && ['pending', 'failed'].includes(order.status) && !!status && status.orders_enabled === true && status.mode !== 'off';
}
