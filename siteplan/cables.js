// Cable schedules for a site plan (Robert, 2026-11-03): one schedule per system
// (CCTV, alarm, access control, intercom, fire, network, audio and display),
// worked out from the devices on the plan. Each device is cabled back to the
// nearest head end of its system (a camera to the recorder or switch, a detector
// to the alarm panel, a reader to the door controller), with the cable that job
// normally takes. Any device can be given its own cable, head end, number of
// runs and extra metres. Pure, with relative imports, so the plain Node test
// runner can load this file and it can be lifted into another app as is.
import { DEVICE_GROUPS, deviceType } from './model.js';

export const CABLE_TYPES = [
  { id: 'cat6', label: 'Cat6 U/UTP', box: 305, shop: 'cat6 cable' },
  { id: 'cat6ext', label: 'Cat6 outdoor (UV rated)', box: 305, shop: 'outdoor cat6 cable' },
  { id: 'sec4', label: '4-core security cable', shop: 'security cable' },
  { id: 'sec6', label: '6-core security cable', shop: 'security cable' },
  { id: 'sec6s', label: '6-core shielded (reader) cable', shop: 'shielded cable' },
  { id: 'power2', label: '2-core power, 1.0 mm² (figure 8)', shop: 'figure 8 cable' },
  { id: 'fire2', label: '2-core fire-rated, 1.5 mm²', shop: 'fire rated cable' },
  { id: 'speaker2', label: '2-core speaker cable, 1.5 mm²', shop: 'speaker cable' },
];
export const cableType = (id) => CABLE_TYPES.find((c) => c.id === id) || null;

// One schedule per device group, with a short prefix for the cable numbers.
export const SYSTEMS = [
  { group: 'CCTV', label: 'CCTV', prefix: 'CC' },
  { group: 'Alarm and intrusion', label: 'Alarm', prefix: 'AL' },
  { group: 'Access control', label: 'Access control', prefix: 'AC' },
  { group: 'Intercom', label: 'Intercom', prefix: 'IC' },
  { group: 'Fire', label: 'Fire', prefix: 'FI', note: 'Fire detection is wired in loops or zones to the fire designer’s layout; these runs are point to panel, for estimating only.' },
  { group: 'Network and IT', label: 'Network', prefix: 'NW' },
  { group: 'Audio and display', label: 'Audio and display', prefix: 'AV' },
].filter((s) => DEVICE_GROUPS.includes(s.group));

const NET = ['switch', 'rack', 'router'];
// What each device type is cabled with and where it runs to, nearest first among
// the head-end types listed (in order of preference). No entry: no cable.
export const CABLE_RULES = {
  camera: { cable: 'cat6', to: ['nvr', ...NET] },
  dome: { cable: 'cat6', to: ['nvr', ...NET] },
  bullet: { cable: 'cat6', to: ['nvr', ...NET] },
  ptz: { cable: 'cat6', to: ['nvr', ...NET] },
  fisheye: { cable: 'cat6', to: ['nvr', ...NET] },
  lpr: { cable: 'cat6ext', to: ['nvr', ...NET] },
  nvr: { cable: 'cat6', to: NET },

  motion: { cable: 'sec4', to: ['alarmpanel'] },
  dualtech: { cable: 'sec4', to: ['alarmpanel'] },
  ceilingpir: { cable: 'sec4', to: ['alarmpanel'] },
  beam: { cable: 'sec6', to: ['alarmpanel'] },
  glassbreak: { cable: 'sec4', to: ['alarmpanel'] },
  contact: { cable: 'sec4', to: ['alarmpanel'] },
  vibration: { cable: 'sec4', to: ['alarmpanel'] },
  panic: { cable: 'sec4', to: ['alarmpanel'] },
  keypad: { cable: 'sec4', to: ['alarmpanel'] },
  siren: { cable: 'sec4', to: ['alarmpanel'] },
  alarmpanel: { cable: 'cat6', to: NET },

  door: { cable: 'sec4', to: ['controller'] },
  reader: { cable: 'sec6s', to: ['controller'] },
  biometric: { cable: 'sec6s', to: ['controller'] },
  exitbutton: { cable: 'sec4', to: ['controller'] },
  lock: { cable: 'power2', to: ['controller'] },
  gate: { cable: 'sec6', to: ['controller'] },
  turnstile: { cable: 'sec6', to: ['controller'] },
  controller: { cable: 'cat6', to: NET },

  intercom: { cable: 'cat6', to: [...NET, 'monitor'] },
  monitor: { cable: 'cat6', to: NET },
  guardstation: { cable: 'cat6', to: NET },

  smoke: { cable: 'fire2', to: ['firepanel'] },
  heat: { cable: 'fire2', to: ['firepanel'] },
  callpoint: { cable: 'fire2', to: ['firepanel'] },
  sounder: { cable: 'fire2', to: ['firepanel'] },

  wifi: { cable: 'cat6', to: NET },
  datapoint: { cable: 'cat6', to: ['rack', 'switch'] },
  bridge: { cable: 'cat6ext', to: NET },
  poeextender: { cable: 'cat6', to: NET },
  switch: { cable: 'cat6', to: ['rack', 'router'] },
  router: { cable: 'cat6', to: ['rack'] },

  speaker: { cable: 'speaker2', to: ['amplifier'] },
  wallspeaker: { cable: 'speaker2', to: ['amplifier'] },
  microphone: { cable: 'cat6', to: ['amplifier'] },
  display: { cable: 'cat6', to: ['rack', 'switch'] },
  projector: { cable: 'cat6', to: ['rack', 'switch'] },
};

// Allowance on every run: the drops at both ends and the tails to terminate.
export const DROP_METRES = 4;
export const SLACK = 0.1;

const num = (value, fallback = 0) => {
  const n = Number.parseFloat(value);
  return Number.isFinite(n) ? n : fallback;
};

/** Metres along the walls and ceiling between two points: across, then along. */
export function routeMetres(a, b, pxPerMetre) {
  if (!(pxPerMetre > 0)) return 0;
  return (Math.abs(a.x - b.x) + Math.abs(a.y - b.y)) / pxPerMetre;
}

/** Length to order for one run: the route plus the drops, plus 10 %, rounded up to the metre. */
export function runLength(routeM, extraM = 0) {
  return Math.ceil((num(routeM) + DROP_METRES) * (1 + SLACK) + Math.max(0, num(extraM)));
}

/** The head end a device is cabled to: the one chosen on it, or the nearest of the preferred kinds. */
export function headEndFor(device, devices) {
  if (device.cableTo) {
    const chosen = devices.find((d) => d.id === device.cableTo && d.id !== device.id);
    if (chosen) return chosen;
  }
  const rule = CABLE_RULES[device.type];
  if (!rule) return null;
  for (const type of rule.to) {
    const candidates = devices.filter((d) => d.type === type && d.id !== device.id);
    if (candidates.length) {
      return candidates.reduce((best, d) => (routeMetres(device, d, 1) < routeMetres(device, best, 1) ? d : best));
    }
  }
  return null;
}

/** The cable type id a device takes: its own choice, else its rule; '' for none. */
export function cableFor(device) {
  if (device.cable === 'none') return '';
  if (device.cable && cableType(device.cable)) return device.cable;
  return CABLE_RULES[device.type]?.cable || '';
}

/**
 * Every cable on the plan, as one schedule per system that has any:
 * [{ system, label, prefix, note, rows: [...], totals: [{ cable, label, metres, boxes }] }].
 * A row: { id, deviceId, from, to, toId, cable, cableLabel, runs, each, total, note }.
 * Lengths are 0 when the plan has no scale.
 */
export function cableSchedules(plan) {
  const devices = plan?.devices || [];
  const scale = num(plan?.pxPerMetre);
  const out = [];
  for (const system of SYSTEMS) {
    const rows = [];
    for (const device of devices) {
      if (deviceType(device.type).group !== system.group) continue;
      const cable = cableFor(device);
      if (!cable) continue;
      const end = headEndFor(device, devices);
      const runs = Math.min(8, Math.max(1, Math.round(num(device.cableRuns, 1)) || 1));
      const each = end && scale > 0 ? runLength(routeMetres(device, end, scale), device.cableExtra) : 0;
      const kinds = (CABLE_RULES[device.type]?.to || []).map((t) => deviceType(t).label.toLowerCase());
      rows.push({
        id: `${system.prefix}-${String(rows.length + 1).padStart(2, '0')}`,
        deviceId: device.id,
        from: device.name,
        to: end ? end.name : '',
        toId: end ? end.id : '',
        cable,
        cableLabel: cableType(cable).label,
        runs,
        each,
        total: each * runs,
        note: end ? '' : kinds.length ? `Add ${/^[aeiou]/.test(kinds[0]) ? 'an' : 'a'} ${kinds[0]} to the plan, or choose where it runs to` : 'Choose where it runs to',
      });
    }
    if (!rows.length) continue;
    const totals = CABLE_TYPES.map((c) => {
      const metres = rows.filter((r) => r.cable === c.id).reduce((sum, r) => sum + r.total, 0);
      const count = rows.filter((r) => r.cable === c.id).length;
      return { cable: c.id, label: c.label, runs: count, metres, box: c.box || 0, boxes: c.box && metres ? Math.ceil(metres / c.box) : 0 };
    }).filter((t) => t.runs);
    out.push({ system: system.group, label: system.label, prefix: system.prefix, note: system.note || '', rows, totals });
  }
  return out;
}

const csvCell = (value) => {
  const s = String(value ?? '');
  // A leading = + - @ would be read as a formula by a spreadsheet.
  const safe = /^[=+\-@]/.test(s) ? `'${s}` : s;
  return /[",\n]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe;
};

/** A CSV of the given schedules (one system or all), for a spreadsheet or the cabler. */
export function schedulesCsv(schedules) {
  const lines = [['Cable', 'System', 'From', 'To', 'Cable type', 'Runs', 'Length each (m)', 'Total (m)', 'Note']];
  for (const s of schedules) {
    for (const r of s.rows) lines.push([r.id, s.label, r.from, r.to || 'Not placed', r.cableLabel, r.runs, r.each || '', r.total || '', r.note]);
  }
  return lines.map((line) => line.map(csvCell).join(',')).join('\r\n') + '\r\n';
}
