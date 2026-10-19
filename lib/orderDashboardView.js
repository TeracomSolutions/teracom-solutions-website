import { cents, orderStatusLabel } from './orderView.js';

export const TILE_TONES = {
  to_prepare: 'muted',
  to_approve: 'warn',
  in_zoho: 'muted',
  to_ship: 'warn',
  shipped: 'good',
  needs_attention: 'bad',
  to_invoice: 'warn',
  po_to_send: 'warn'
};

export const TILE_LABELS = {
  to_prepare: 'To prepare',
  to_approve: 'To approve',
  in_zoho: 'In Zoho',
  to_ship: 'To ship',
  shipped: 'Shipped',
  needs_attention: 'Needs attention',
  to_invoice: 'Invoice not sent',
  po_to_send: 'Supplier purchase orders to send'
};

export function stageHref(key) {
  return '/admin/orders?stage=' + encodeURIComponent(key) + '&mode=live';
}

export function stageLabel(key) {
  return TILE_LABELS[key] || '';
}

export function tileTone(key, count) {
  if (!count) return 'muted';
  return TILE_TONES[key] || 'muted';
}

export function tiles(list) {
  return (list || []).map((item) => ({
    key: item.key,
    label: item.label,
    count: item.count || 0,
    tone: tileTone(item.key, item.count),
    href: stageHref(item.key)
  }));
}

export function recentTiles(recent) {
  const r = recent || {};
  return [
    { key: 'orders_today', label: 'Orders today', value: String(r.orders_today || 0) },
    { key: 'orders_week', label: 'Orders in the last 7 days', value: String(r.orders_week || 0) },
    { key: 'value_today', label: 'Sales today', value: cents(r.value_today_cents || 0) },
    { key: 'value_week', label: 'Sales in the last 7 days', value: cents(r.value_week_cents || 0) }
  ];
}

export function statusBars(breakdown) {
  const rows = breakdown || [];
  const total = rows.reduce((sum, row) => sum + (row.count || 0), 0);
  return rows.map((row) => ({
    status: row.status,
    label: orderStatusLabel(row.status),
    count: row.count || 0,
    percent: total ? Math.round((row.count / total) * 100) : 0
  }));
}

export function poRows(po) {
  const p = po || {};
  return [
    { key: 'draft', label: 'Drafted', count: p.draft || 0, note: '' },
    { key: 'created', label: 'Created in Zoho', count: p.created || 0, note: '' },
    { key: 'issued', label: 'Issued', count: p.issued || 0, note: '' },
    { key: 'sent', label: 'Sent to the supplier', count: p.sent || 0, note: '' },
    { key: 'failed', label: 'Failed', count: p.failed || 0, note: '' },
    { key: 'received', label: 'Received', count: null, note: 'Not tracked yet' }
  ];
}