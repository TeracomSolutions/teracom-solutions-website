// Parts and quote (Robert, 2026-11-06): a finished plan becomes a parts list -- one line
// for each kind of device on it and one for each cable to order -- that the host app can
// fill with products from its shop, add to a cart, or send as a request for an installed
// quote. Pure; the searching, prices and sending are the host's (SitePlanner's `shop` prop).
import { DEVICE_TYPES, MAX_PART_LINES } from './model.js';

// Saved picks are cleaned with the plan, in model.js.
export { cleanParts } from './model.js';
import { CABLE_TYPES, cableSchedules } from './cables.js';

// What to look for in the shop for each device type: search words tried in order, the
// shop category to look in, words that mark an accessory rather than the device itself, and
// (`allow`) accessory words that are fine for this one.
// Types without an entry (a power point, "other") are left to the installer.
const ACCESSORY = ['mount', 'bracket', 'junction', 'adaptor', 'adapter', 'cover', 'sunshield', 'housing', 'pole', 'licence', 'license', 'battery', 'replacement', 'spare', 'smoked', 'conduit', 'cabinet door'];
export const PART_SEARCH = {
  camera: { q: ['turret camera', 'turret', 'eyeball camera'], category: 'CCTV' },
  dome: { q: ['dome camera'], category: 'CCTV' },
  bullet: { q: ['bullet camera'], category: 'CCTV' },
  ptz: { q: ['ptz camera', 'ptz'], category: 'CCTV', not: ['joystick', 'dongle', 'keyboard'] },
  fisheye: { q: ['fisheye camera', 'fisheye', '360 camera'], category: 'CCTV', not: ['lens', 'sensor'] },
  lpr: { q: ['lpr camera', 'lpr'], category: 'CCTV', not: ['verifier'] },
  nvr: { q: ['network video recorder', 'nvr'], not: ['instant kit'] },
  motion: { q: ['pir'], category: 'Intrusion', not: ['ceiling', 'curtain', 'kit'] },
  dualtech: { q: ['dual technology', 'dual tech', 'pir'], category: 'Intrusion', not: ['ceiling', 'kit'] },
  ceilingpir: { q: ['ceiling pir', 'ceiling mount pir', '360 pir'], category: 'Intrusion', allow: ['mount'] },
  beam: { q: ['beam'], category: 'Intrusion' },
  glassbreak: { q: ['glassbreak', 'glass break'], not: ['electronic break glass'] },
  contact: { q: ['reed', 'door contact', 'magnetic contact'], category: 'Intrusion', not: ['kit', 'pcb'] },
  vibration: { q: ['vibration', 'shock sensor'] },
  panic: { q: ['duress pendant', 'panic button', 'duress'], not: ['asset tag', 'receiver', 'locator', 'bar', 'lock', 'strike'] },
  keypad: { q: ['keypad'], category: 'Intrusion', not: ['wall plate'] },
  alarmpanel: { q: ['alarm panel', 'xr kit', 'alarm kit'], category: 'Intrusion' },
  siren: { q: ['siren', 'strobe'], category: 'Intrusion', not: ['kit', 'pcb'] },
  door: { q: ['door hub', 'single door controller', 'door controller'], category: 'Access Control', not: ['kit'] },
  reader: { q: ['card reader', 'reader'], category: 'Access Control' },
  biometric: { q: ['fingerprint reader', 'fingerprint', 'biometric', 'face reader'], not: ['usb', 'enrol'] },
  exitbutton: { q: ['exit button', 'request to exit', 'push to exit', 'access button'], not: ['panic bar', 'button extender'] },
  lock: { q: ['electric strike', 'maglock', 'magnetic lock'] },
  controller: { q: ['door controller', 'controller'], category: 'Access Control', not: ['barebone'] },
  gate: { q: ['gate hub', 'gate controller'], not: ['starter kit'] },
  turnstile: { q: ['turnstile'] },
  intercom: { q: ['door station', 'intercom'], not: ['flush', 'surface', 'recessed', 'frame', 'indoor', 'switch', 'stand', 'viewer'] },
  monitor: { q: ['indoor station', 'indoor monitor', 'indoor view', 'answering unit'], not: ['switch', 'nanostation'] },
  guardstation: { q: ['master station', 'guard station', 'concierge station'] },
  smoke: { q: ['smoke detector', 'smoke alarm'] },
  heat: { q: ['heat detector'] },
  callpoint: { q: ['manual call point'] },
  sounder: { q: ['fire sounder', 'sounder strobe'] },
  firepanel: { q: ['fire panel', 'fire indicator panel'] },
  wifi: { q: ['access point'], category: 'Networking', not: ['industrial', 'bridge', 'sector'] },
  rack: { q: ['rack cabinet', 'wall cabinet', 'data cabinet'], not: ['server', 'surveillance'] },
  switch: { q: ['poe switch', 'switch'], category: 'Networking', not: ['rail'] },
  router: { q: ['firewall', 'gateway', 'router'], category: 'Networking', not: ['5g', 'transportation'] },
  datapoint: { q: ['keystone jack', 'keystone wall plate', 'wall plate'], not: ['blank', 'coupler', 'nxg'] },
  bridge: { q: ['building bridge', 'wireless bridge', 'point to point'], not: ['call point'] },
  poeextender: { q: ['poe extender'], not: ['gate'] },
  ups: { q: ['ups', 'uninterruptible power'] },
  speaker: { q: ['ceiling speaker'], not: ['pendant'] },
  wallspeaker: { q: ['horn speaker', 'wall speaker'], not: ['explosion'] },
  amplifier: { q: ['amplifier'] },
  projector: { q: ['projector'], not: ['sound projector'] },
  junction: { q: ['junction box'], allow: ['junction'] },
  // Cable: the bulk boxes, never patch leads.
  'cable:cat6': { q: ['cat6 cable', 'category 6', 'cat6a cable'], category: 'Cable', not: ['patch', 'keystone', 'coupler', 'jack', 'outdoor'] },
  'cable:cat6ext': { q: ['outdoor cable', 'carrier outdoor'], not: ['patch', 'box', 'coupler'] },
  'cable:sec4': { q: ['4 core security cable', 'security cable'], category: 'Cable' },
  'cable:sec6': { q: ['6 core security cable', 'security cable'], category: 'Cable' },
  'cable:sec6s': { q: ['shielded security cable', 'reader cable'], category: 'Cable' },
  'cable:power2': { q: ['figure 8 cable', 'power cable 2 core'], category: 'Cable', not: ['c13', 'usb'] },
  'cable:fire2': { q: ['fire rated cable'], category: 'Cable' },
  'cable:speaker2': { q: ['speaker cable'], category: 'Cable', not: ['2n'] },
};

export { MAX_PART_LINES };
// Cable without a box size is counted in rolls of this length.
export const ROLL_METRES = 100;

/** The words that mean a product is an accessory, not the part (the search's own `not` words added). */
export function excludedWords(key) {
  const search = PART_SEARCH[key];
  if (key.startsWith('cable:')) return search?.not || [];
  const allow = search?.allow || [];
  return [...ACCESSORY.filter((word) => !allow.includes(word)), ...(search?.not || [])];
}

/**
 * The parts list for a plan: each kind of device on it with how many, then each cable with
 * the metres and how many boxes or rolls. `key` is the device type or `cable:<id>`.
 */
export function partsList(plan) {
  const devices = plan?.devices || [];
  const lines = [];
  for (const kind of DEVICE_TYPES) {
    const count = devices.filter((d) => d.type === kind.type).length;
    if (count) lines.push({ key: kind.type, kind: 'device', group: kind.group, label: kind.label, qty: count, unit: '', searchable: Boolean(PART_SEARCH[kind.type]) });
  }
  const rows = cableSchedules(plan).flatMap((s) => s.rows);
  for (const c of CABLE_TYPES) {
    const mine = rows.filter((r) => r.cable === c.id);
    if (!mine.length) continue;
    const metres = mine.reduce((sum, r) => sum + r.total, 0);
    const size = c.box || ROLL_METRES;
    lines.push({
      key: `cable:${c.id}`,
      kind: 'cable',
      group: 'Cable',
      label: c.label,
      metres,
      qty: Math.max(1, Math.ceil(metres / size)),
      unit: c.box ? `${c.box} m box` : `${ROLL_METRES} m roll`,
      searchable: Boolean(PART_SEARCH[`cable:${c.id}`]),
    });
  }
  return lines.slice(0, MAX_PART_LINES);
}

/** What a parts-list key is (its label and unit), or null for a key that is not a part. */
export function partLine(key) {
  if (typeof key !== 'string') return null;
  if (key.startsWith('cable:')) {
    const c = CABLE_TYPES.find((t) => `cable:${t.id}` === key);
    return c ? { key, kind: 'cable', group: 'Cable', label: c.label, unit: c.box ? `${c.box} m box` : `${ROLL_METRES} m roll` } : null;
  }
  const kind = DEVICE_TYPES.find((t) => t.type === key);
  return kind ? { key, kind: 'device', group: kind.group, label: kind.label, unit: '' } : null;
}

/**
 * Each line with the product chosen for it (the saved pick, else the shop's first
 * suggestion), the quantity and the price. `options` is { [key]: [product] } from the shop;
 * a product's `priceCents` is what this viewer pays, or null when they cannot see prices.
 */
export function pricedParts(lines, parts = {}, options = {}) {
  let totalCents = 0;
  let unpriced = 0;
  const rows = lines.map((line) => {
    const pick = parts[line.key] || {};
    const choices = options[line.key] || [];
    // A saved product the shop no longer suggests falls back to its first suggestion.
    const product = pick.id === '' ? null : choices.find((p) => p.id === pick.id) || choices[0] || null;
    const qty = pick.qty ?? line.qty;
    const unitCents = product && typeof product.priceCents === 'number' ? product.priceCents : null;
    const lineCents = unitCents === null ? null : unitCents * qty;
    if (lineCents === null) {
      if (qty > 0) unpriced += 1;
    } else totalCents += lineCents;
    return { ...line, qty, product, unitCents, lineCents };
  });
  return { rows, totalCents, unpriced };
}

const money = (cents) => `$${(cents / 100).toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/** The parts list as plain text, for a quote request or an email. */
export function partsText(planName, deviceCount, priced) {
  const lines = [`Site plan: ${planName || 'Untitled site plan'}`, `Devices on the plan: ${deviceCount}`, ''];
  for (const row of priced.rows) {
    if (!row.qty) continue;
    const what = row.product ? `${row.product.name}${row.product.sku ? ` (${row.product.sku})` : ''}` : 'to be quoted';
    const unit = row.kind === 'cable' ? ` x ${row.unit}${row.metres ? `, ${row.metres} m needed` : ''}` : '';
    const price = row.lineCents === null ? '' : ` -- ${money(row.lineCents)}`;
    lines.push(`${row.qty}${unit} ${row.label}: ${what}${price}`);
  }
  lines.push('');
  lines.push(`Parts priced online: ${money(priced.totalCents)} inc. GST${priced.unpriced ? ` (${priced.unpriced} line${priced.unpriced === 1 ? '' : 's'} to be quoted)` : ''}`);
  return lines.join('\n');
}
