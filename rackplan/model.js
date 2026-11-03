// Data rack layout (Robert, 2026-11-03): a front view of a 6RU to 48RU rack with
// patch panels, switches, cable management, recorders, UPS and the rest stacked in
// it, each with its own label. Positions are rack units counted from the bottom (U1
// is the lowest), as printed on the rails. Pure, with relative imports, so the
// plain Node test runner can load it and Teracom AI can lift the folder as is.

export const RACK_FORMAT = 'teracom-rack-layout';
export const RACK_STORAGE_KEY = 'teracom-rack-layout-v1';
export const RACK_SIZES = [6, 9, 12, 18, 22, 24, 27, 32, 37, 42, 45, 48];
export const RACK_DEPTHS = [300, 450, 600, 800, 1000, 1200];
export const MAX_ITEMS = 120;
export const MAX_ITEM_RU = 12;

// `art` is how the front is drawn (draw.js); `ru` the usual height; `colour` the faceplate.
export const ITEM_GROUPS = ['Patching and cable management', 'Network', 'Servers and recording', 'Power', 'Other'];
export const ITEM_TYPES = [
  { type: 'patch24', group: 'Patching and cable management', label: 'Patch panel, 24 port', ru: 1, art: 'ports24', colour: '#1f2937' },
  { type: 'patch48', group: 'Patching and cable management', label: 'Patch panel, 48 port', ru: 2, art: 'ports48', colour: '#1f2937' },
  { type: 'fibre', group: 'Patching and cable management', label: 'Fibre patch panel', ru: 1, art: 'fibre', colour: '#334155' },
  { type: 'cablemgmt', group: 'Patching and cable management', label: 'Cable management (D-rings)', ru: 1, art: 'dring', colour: '#111827' },
  { type: 'brush', group: 'Patching and cable management', label: 'Brush panel', ru: 1, art: 'brush', colour: '#111827' },
  { type: 'switch24', group: 'Network', label: 'Switch, 24 port', ru: 1, art: 'switch24', colour: '#0c4a6e' },
  { type: 'switch48', group: 'Network', label: 'Switch, 48 port', ru: 1, art: 'switch48', colour: '#0c4a6e' },
  { type: 'poeswitch', group: 'Network', label: 'PoE switch', ru: 1, art: 'switch24', colour: '#075985' },
  { type: 'router', group: 'Network', label: 'Router or firewall', ru: 1, art: 'device', colour: '#7f1d1d' },
  { type: 'modem', group: 'Network', label: 'NBN modem or NTD (on a shelf)', ru: 2, art: 'shelfbox', colour: '#374151' },
  { type: 'nvr', group: 'Servers and recording', label: 'Recorder (NVR)', ru: 2, art: 'drives', colour: '#3f3f46' },
  { type: 'server', group: 'Servers and recording', label: 'Server', ru: 2, art: 'drives', colour: '#27272a' },
  { type: 'nas', group: 'Servers and recording', label: 'NAS or storage', ru: 2, art: 'drives', colour: '#3f3f46' },
  { type: 'kvm', group: 'Servers and recording', label: 'KVM or console drawer', ru: 1, art: 'device', colour: '#27272a' },
  { type: 'amplifier', group: 'Servers and recording', label: 'Amplifier or AV processor', ru: 2, art: 'amp', colour: '#1c1917' },
  { type: 'ups', group: 'Power', label: 'UPS', ru: 2, art: 'ups', colour: '#18181b' },
  { type: 'pdu', group: 'Power', label: 'Power rail (PDU)', ru: 1, art: 'outlets', colour: '#18181b' },
  { type: 'shelf', group: 'Other', label: 'Shelf', ru: 1, art: 'shelf', colour: '#4b5563' },
  { type: 'fan', group: 'Other', label: 'Fan tray', ru: 1, art: 'fan', colour: '#1f2937' },
  { type: 'blank', group: 'Other', label: 'Blank panel', ru: 1, art: 'blank', colour: '#374151' },
  { type: 'other', group: 'Other', label: 'Other equipment', ru: 1, art: 'device', colour: '#44403c' },
];
export const itemType = (type) => ITEM_TYPES.find((t) => t.type === type) || ITEM_TYPES[ITEM_TYPES.length - 1];

const int = (value, fallback) => {
  const n = Number.parseInt(value, 10);
  return Number.isFinite(n) ? n : fallback;
};
const text = (value, max) => String(value ?? '').replace(/[\u0000-\u001f]/g, ' ').slice(0, max);

/** The top U an item reaches. */
export const topU = (item) => item.u + item.ru - 1;

/** Whether an item of `ru` units fits at `u` (its bottom unit), clear of the others. */
export function fits(rack, u, ru, ignoreId = null) {
  if (u < 1 || u + ru - 1 > rack.size) return false;
  return !rack.items.some((it) => it.id !== ignoreId && u <= topU(it) && it.u <= u + ru - 1);
}

/** The highest bottom unit where `ru` units fit, searching from the top down; 0 when full. */
export function firstFree(rack, ru, ignoreId = null) {
  for (let u = rack.size - ru + 1; u >= 1; u -= 1) if (fits(rack, u, ru, ignoreId)) return u;
  return 0;
}

/** The free gaps, top down: [{ from (top U), to (bottom U), ru }]. */
export function gaps(rack) {
  const out = [];
  let top = null;
  for (let u = rack.size; u >= 0; u -= 1) {
    const used = u === 0 || rack.items.some((it) => u >= it.u && u <= topU(it));
    if (!used && top === null) top = u;
    if (used && top !== null) {
      out.push({ from: top, to: u + 1, ru: top - u });
      top = null;
    }
  }
  return out;
}

/** Used and free rack units. */
export function usage(rack) {
  const used = rack.items.reduce((sum, it) => sum + it.ru, 0);
  return { used, free: rack.size - used, size: rack.size };
}

/** Everything in the rack top down, free space included: [{ top, bottom, ru, item | null }]. */
export function rackRows(rack) {
  const items = [...rack.items].sort((a, b) => topU(b) - topU(a)).map((item) => ({ top: topU(item), bottom: item.u, ru: item.ru, item }));
  const free = gaps(rack).map((g) => ({ top: g.from, bottom: g.to, ru: g.ru, item: null }));
  return [...items, ...free].sort((a, b) => b.top - a.top);
}

/** "U24" or "U24-U23". */
export const unitsText = (row) => (row.ru === 1 ? `U${row.top}` : `U${row.top}-U${row.bottom}`);

export function newItem(type, id, u, ru) {
  const t = itemType(type);
  return { id, type: t.type, label: t.label, ru: ru || t.ru, u, note: '' };
}

/** Add an item of a type at the first free space from the top; null when it does not fit. */
export function addItem(rack, type, id) {
  if (rack.items.length >= MAX_ITEMS) return null;
  const t = itemType(type);
  const u = firstFree(rack, t.ru);
  if (!u) return null;
  return { ...rack, items: [...rack.items, newItem(type, id, u)] };
}

/** Move an item to a bottom unit, if it fits there. */
export function moveItem(rack, id, u) {
  const item = rack.items.find((it) => it.id === id);
  if (!item || !fits(rack, u, item.ru, id)) return null;
  return { ...rack, items: rack.items.map((it) => (it.id === id ? { ...it, u } : it)) };
}

/** Change an item's height, if it still fits where it is. */
export function resizeItem(rack, id, ru) {
  const item = rack.items.find((it) => it.id === id);
  const height = Math.min(MAX_ITEM_RU, Math.max(1, int(ru, 1)));
  if (!item || !fits(rack, item.u, height, id)) return null;
  return { ...rack, items: rack.items.map((it) => (it.id === id ? { ...it, ru: height } : it)) };
}

/** Change the rack size, if everything still fits. */
export function resizeRack(rack, size) {
  const n = int(size, rack.size);
  if (!RACK_SIZES.includes(n) || rack.items.some((it) => topU(it) > n)) return null;
  return { ...rack, size: n };
}

export function emptyRack(size = 24) {
  return { format: RACK_FORMAT, version: 1, name: '', site: '', size, depth: 600, items: [] };
}

/** A tidy 24RU network and CCTV rack to start from. */
export function sampleRack() {
  const items = [
    ['fibre', 24, 'Fibre from the main building'],
    ['patch24', 23, 'Patch panel A (data points 1-24)'],
    ['cablemgmt', 22, ''],
    ['poeswitch', 21, 'PoE switch for cameras and Wi-Fi'],
    ['cablemgmt', 20, ''],
    ['patch24', 19, 'Patch panel B (cameras 1-24)'],
    ['switch24', 18, 'Core switch'],
    ['router', 17, 'Firewall'],
    ['modem', 15, 'NBN NTD and modem'],
    ['blank', 14, ''],
    ['nvr', 12, 'Recorder, 32 channel'],
    ['nas', 10, 'Backup NAS'],
    ['pdu', 4, 'Power rail'],
    ['ups', 1, 'UPS, 1500 VA'],
  ].map(([type, u, label], i) => {
    const item = newItem(type, `r${i + 1}`, u);
    return { ...item, label: label || item.label };
  });
  return { ...emptyRack(24), name: 'Comms room rack', site: 'Sample office', items };
}

/** A rack from saved or opened data, made safe; null when it is not a rack. */
export function cleanRack(raw) {
  if (!raw || typeof raw !== 'object' || raw.format !== RACK_FORMAT) return null;
  return cleanRackData(raw);
}

function cleanRackData(raw) {
  const size = RACK_SIZES.includes(int(raw.size, 0)) ? int(raw.size, 0) : 24;
  const rack = { ...emptyRack(size), name: text(raw.name, 200), site: text(raw.site, 200), depth: RACK_DEPTHS.includes(int(raw.depth, 0)) ? int(raw.depth, 0) : 600 };
  if (raw.id) rack.id = text(raw.id, 40);
  const seen = new Set();
  for (const it of Array.isArray(raw.items) ? raw.items.slice(0, MAX_ITEMS) : []) {
    if (!it || typeof it !== 'object') continue;
    const id = text(it.id, 40) || `r${rack.items.length + 1}`;
    if (seen.has(id)) continue;
    const ru = Math.min(MAX_ITEM_RU, Math.max(1, int(it.ru, 1)));
    const u = int(it.u, 0);
    if (!fits(rack, u, ru)) continue;
    seen.add(id);
    rack.items.push({ id, type: itemType(it.type).type, label: text(it.label, 80), ru, u, note: text(it.note, 200) });
  }
  return rack;
}

export function parseRack(json) {
  try {
    return cleanRack(JSON.parse(json));
  } catch {
    return null;
  }
}

// ---- A comms room: several racks side by side (Robert, 2026-11-03) ----

export const ROOM_FORMAT = 'teracom-rack-room';
export const ROOM_STORAGE_KEY = 'teracom-rack-room-v1';
export const MAX_RACKS = 12;

export function emptyRoom(size = 42) {
  return { format: ROOM_FORMAT, version: 1, name: '', site: '', racks: [{ ...emptyRack(size), id: 'k1', name: 'Rack 1' }] };
}

/** A room holding one rack (an older single-rack file or the browser's old saved rack). */
export function roomFromRack(rack) {
  const { site = '', ...rest } = rack;
  return { format: ROOM_FORMAT, version: 1, name: '', site, racks: [{ ...rest, id: rest.id || 'k1', name: rest.name || 'Rack 1' }] };
}

/** A comms room to start from: a 42RU network rack and a 24RU CCTV and power rack. */
export function sampleRoom() {
  const network = { ...sampleRack(), id: 'k1', name: 'Rack 1: network' };
  const cctv = {
    ...emptyRack(24),
    id: 'k2',
    name: 'Rack 2: CCTV and security',
    items: [
      ['patch24', 24, 'Patch panel D (cameras 25-48)'],
      ['cablemgmt', 23, ''],
      ['poeswitch', 22, 'PoE switch, cameras 25-48'],
      ['cablemgmt', 21, ''],
      ['nvr', 18, 'Recorder 2, 32 channel'],
      ['shelf', 16, 'Alarm and access controllers'],
      ['blank', 15, ''],
      ['pdu', 3, 'Power rail'],
      ['ups', 1, 'UPS, 1000 VA'],
    ].map(([type, u, label], i) => {
      const item = newItem(type, `s${i + 1}`, u);
      return { ...item, label: label || item.label };
    }),
  };
  const { site } = network;
  delete network.site;
  delete cctv.site;
  return { format: ROOM_FORMAT, version: 1, name: 'Comms room', site, racks: [network, cctv] };
}

/** A room from saved or opened data (a room, or a single rack), made safe; null when it is neither. */
export function cleanRoom(raw) {
  if (!raw || typeof raw !== 'object') return null;
  if (raw.format === RACK_FORMAT) {
    const rack = cleanRack(raw);
    return rack ? roomFromRack(rack) : null;
  }
  if (raw.format !== ROOM_FORMAT || !Array.isArray(raw.racks)) return null;
  const racks = [];
  const ids = new Set();
  for (const r of raw.racks.slice(0, MAX_RACKS)) {
    if (!r || typeof r !== 'object') continue;
    const rack = cleanRackData(r);
    delete rack.site;
    if (!rack.id || ids.has(rack.id)) rack.id = `k${racks.length + 1}`;
    while (ids.has(rack.id)) rack.id = `${rack.id}x`;
    ids.add(rack.id);
    racks.push({ ...rack, name: rack.name || `Rack ${racks.length + 1}` });
  }
  if (!racks.length) return null;
  return { format: ROOM_FORMAT, version: 1, name: text(raw.name, 200), site: text(raw.site, 200), racks };
}

export function parseRoom(json) {
  try {
    return cleanRoom(JSON.parse(json));
  } catch {
    return null;
  }
}

/** Replace one rack in the room. */
export const withRack = (room, rack) => ({ ...room, racks: room.racks.map((r) => (r.id === rack.id ? rack : r)) });

/** Add a rack after the others; null when the room is full. */
export function addRack(room, id, size = 42) {
  if (room.racks.length >= MAX_RACKS) return null;
  return { ...room, racks: [...room.racks, { ...emptyRack(size), id, name: `Rack ${room.racks.length + 1}` }] };
}

/** Move an item to another rack: same position if free there, else the highest free space; null when it does not fit. */
export function moveToRack(room, fromId, itemId, toId, newId) {
  const from = room.racks.find((r) => r.id === fromId);
  const to = room.racks.find((r) => r.id === toId);
  const item = from?.items.find((it) => it.id === itemId);
  if (!item || !to || from === to || to.items.length >= MAX_ITEMS) return null;
  const u = fits(to, item.u, item.ru) ? item.u : firstFree(to, item.ru);
  if (!u) return null;
  const id = to.items.some((it) => it.id === item.id) ? newId : item.id;
  return {
    ...room,
    racks: room.racks.map((r) => {
      if (r.id === fromId) return { ...r, items: r.items.filter((it) => it.id !== itemId) };
      if (r.id === toId) return { ...r, items: [...r.items, { ...item, id, u }] };
      return r;
    }),
  };
}

/** Used and free space across the room. */
export function roomUsage(room) {
  return room.racks.reduce((t, r) => {
    const u = usage(r);
    return { racks: t.racks + 1, used: t.used + u.used, free: t.free + u.free, items: t.items + r.items.length };
  }, { racks: 0, used: 0, free: 0, items: 0 });
}
