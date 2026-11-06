// Site plan designer (Robert, 2026-11-02): a floor plan with equipment dropped on it --
// cameras with their DORI field of view, motion detectors, ceiling speakers, Wi-Fi
// access points, access-controlled doors and more. Pure functions here; the drawing is
// in components/tools/SitePlanner.js. The plan lives in the visitor's browser.

export const PLAN_FORMAT = 'teracom-site-plan';
export const OLD_PLAN_FORMAT = 'teracom-camera-plan';
export const PLAN_STORAGE_KEY = 'teracom-site-plan-v2';
export const OLD_PLAN_STORAGE_KEY = 'teracom-camera-plan-v1';
export const MAX_DEVICES = 200;

// The grid shown before a plan is uploaded, in plan pixels.
export const BLANK_PLAN = { width: 1600, height: 1000 };
// The sample plan shipped with the site: 40 px to the metre.
export const SAMPLE_IMAGE = { src: '/tools/sample-floor-plan.png', width: 1600, height: 1000 };

// What can be dropped on a plan, in groups for the Add list. `coverage` decides what is
// drawn around it: dori = camera bands, wedge = a fan (detectors, wall speakers, links),
// speaker = a ceiling speaker's circle, circle = a radius, none = the icon only.
// `defaults` overrides the coverage defaults; `code` is the letter on a saved picture.
// The type ids from the first version (camera, motion, speaker, wifi, door, reader,
// keypad, siren, intercom, other) must keep their meaning: saved plans use them.
export const DEVICE_GROUPS = ['CCTV', 'Alarm and intrusion', 'Access control', 'Intercom', 'Fire', 'Network and IT', 'Audio and display', 'Power and other'];

export const DEVICE_TYPES = [
  { type: 'camera', group: 'CCTV', label: 'CCTV camera (turret)', colour: '#ef4444', coverage: 'dori', turns: true, code: 'C' },
  { type: 'dome', group: 'CCTV', label: 'Dome camera', colour: '#ef4444', coverage: 'dori', turns: true, code: 'C' },
  { type: 'bullet', group: 'CCTV', label: 'Bullet camera', colour: '#ef4444', coverage: 'dori', turns: true, code: 'C', defaults: { focal: '4' } },
  { type: 'ptz', group: 'CCTV', label: 'PTZ camera', colour: '#dc2626', coverage: 'dori', turns: true, code: 'P', defaults: { focal: '10' } },
  { type: 'fisheye', group: 'CCTV', label: 'Fisheye (360°) camera', colour: '#ef4444', coverage: 'dori', turns: true, code: 'F', defaults: { fovMode: 'fov', hfov: '179', resolution: '2880' } },
  { type: 'lpr', group: 'CCTV', label: 'Number plate (LPR) camera', colour: '#b91c1c', coverage: 'dori', turns: true, code: 'L', defaults: { focal: '12', resolution: '1920' } },
  { type: 'nvr', group: 'CCTV', label: 'Recorder (NVR)', colour: '#991b1b', coverage: 'none', code: 'N' },

  { type: 'motion', group: 'Alarm and intrusion', label: 'Motion detector (PIR)', colour: '#a855f7', coverage: 'wedge', turns: true, code: 'M' },
  { type: 'dualtech', group: 'Alarm and intrusion', label: 'Dual-tech detector', colour: '#9333ea', coverage: 'wedge', turns: true, code: 'M', defaults: { range: '15' } },
  { type: 'ceilingpir', group: 'Alarm and intrusion', label: '360° ceiling detector', colour: '#a855f7', coverage: 'circle', code: 'M', defaults: { radius: '6' } },
  { type: 'beam', group: 'Alarm and intrusion', label: 'Beam detector', colour: '#7e22ce', coverage: 'wedge', turns: true, code: 'B', defaults: { range: '30', angle: '3' } },
  { type: 'glassbreak', group: 'Alarm and intrusion', label: 'Glass-break detector', colour: '#c084fc', coverage: 'circle', code: 'G', defaults: { radius: '6' } },
  { type: 'contact', group: 'Alarm and intrusion', label: 'Door or window contact', colour: '#8b5cf6', coverage: 'none', code: 'R' },
  { type: 'vibration', group: 'Alarm and intrusion', label: 'Vibration detector', colour: '#8b5cf6', coverage: 'none', code: 'V' },
  { type: 'panic', group: 'Alarm and intrusion', label: 'Panic or duress button', colour: '#e11d48', coverage: 'none', code: '!' },
  { type: 'keypad', group: 'Alarm and intrusion', label: 'Alarm keypad', colour: '#6366f1', coverage: 'none', code: 'K' },
  { type: 'alarmpanel', group: 'Alarm and intrusion', label: 'Alarm panel', colour: '#4f46e5', coverage: 'none', code: 'A' },
  { type: 'siren', group: 'Alarm and intrusion', label: 'Siren or strobe', colour: '#f43f5e', coverage: 'none', code: 'S' },

  { type: 'door', group: 'Access control', label: 'Access-controlled door', colour: '#10b981', coverage: 'none', code: 'D' },
  { type: 'reader', group: 'Access control', label: 'Card reader', colour: '#14b8a6', coverage: 'none', code: 'R' },
  { type: 'biometric', group: 'Access control', label: 'Fingerprint or face reader', colour: '#0d9488', coverage: 'none', code: 'B' },
  { type: 'exitbutton', group: 'Access control', label: 'Exit button (REX)', colour: '#34d399', coverage: 'none', code: 'E' },
  { type: 'lock', group: 'Access control', label: 'Electric strike or maglock', colour: '#059669', coverage: 'none', code: 'L' },
  { type: 'controller', group: 'Access control', label: 'Door controller', colour: '#047857', coverage: 'none', code: 'C' },
  { type: 'gate', group: 'Access control', label: 'Gate or boom gate', colour: '#065f46', coverage: 'none', code: 'G' },
  { type: 'turnstile', group: 'Access control', label: 'Turnstile', colour: '#065f46', coverage: 'none', code: 'T' },

  { type: 'intercom', group: 'Intercom', label: 'Intercom door station', colour: '#22c55e', coverage: 'none', code: 'I' },
  { type: 'monitor', group: 'Intercom', label: 'Indoor monitor', colour: '#16a34a', coverage: 'none', code: 'I' },
  { type: 'guardstation', group: 'Intercom', label: 'Guard or concierge station', colour: '#15803d', coverage: 'none', code: 'G' },

  { type: 'smoke', group: 'Fire', label: 'Smoke detector', colour: '#f97316', coverage: 'circle', code: 'S', defaults: { radius: '0' } },
  { type: 'heat', group: 'Fire', label: 'Heat detector', colour: '#ea580c', coverage: 'circle', code: 'H', defaults: { radius: '0' } },
  { type: 'callpoint', group: 'Fire', label: 'Manual call point', colour: '#dc2626', coverage: 'none', code: 'P' },
  { type: 'sounder', group: 'Fire', label: 'Sounder or strobe', colour: '#fb923c', coverage: 'none', code: 'S' },
  { type: 'firepanel', group: 'Fire', label: 'Fire panel', colour: '#c2410c', coverage: 'none', code: 'F' },

  { type: 'wifi', group: 'Network and IT', label: 'Wi-Fi access point', colour: '#0ea5e9', coverage: 'circle', code: 'W' },
  { type: 'rack', group: 'Network and IT', label: 'Data rack or comms cabinet', colour: '#0369a1', coverage: 'none', code: 'R' },
  { type: 'switch', group: 'Network and IT', label: 'Network switch', colour: '#0284c7', coverage: 'none', code: 'S' },
  { type: 'router', group: 'Network and IT', label: 'Router or firewall', colour: '#075985', coverage: 'none', code: 'F' },
  { type: 'datapoint', group: 'Network and IT', label: 'Data point (outlet)', colour: '#38bdf8', coverage: 'none', code: 'D' },
  { type: 'bridge', group: 'Network and IT', label: 'Wireless bridge', colour: '#0ea5e9', coverage: 'wedge', turns: true, code: 'B', defaults: { range: '100', angle: '15' } },
  { type: 'poeextender', group: 'Network and IT', label: 'PoE extender', colour: '#0284c7', coverage: 'none', code: 'X' },
  { type: 'ups', group: 'Network and IT', label: 'UPS', colour: '#1e40af', coverage: 'none', code: 'U' },

  { type: 'speaker', group: 'Audio and display', label: 'Ceiling speaker', colour: '#f59e0b', coverage: 'speaker', code: 'S' },
  { type: 'wallspeaker', group: 'Audio and display', label: 'Wall or horn speaker', colour: '#d97706', coverage: 'wedge', turns: true, code: 'S', defaults: { range: '10', angle: '90' } },
  { type: 'amplifier', group: 'Audio and display', label: 'Amplifier', colour: '#b45309', coverage: 'none', code: 'A' },
  { type: 'microphone', group: 'Audio and display', label: 'Paging microphone', colour: '#f59e0b', coverage: 'none', code: 'M' },
  { type: 'display', group: 'Audio and display', label: 'Display or TV', colour: '#eab308', coverage: 'none', code: 'T' },
  { type: 'projector', group: 'Audio and display', label: 'Projector', colour: '#ca8a04', coverage: 'none', code: 'P' },

  { type: 'powerpoint', group: 'Power and other', label: 'Power point', colour: '#64748b', coverage: 'none', code: 'P' },
  { type: 'junction', group: 'Power and other', label: 'Junction box', colour: '#64748b', coverage: 'none', code: 'J' },
  { type: 'other', group: 'Power and other', label: 'Other device', colour: '#64748b', coverage: 'circle', code: 'O', defaults: { radius: '0' } },
];

export const deviceType = (type) => DEVICE_TYPES.find((t) => t.type === type) || DEVICE_TYPES[DEVICE_TYPES.length - 1];

// Nominal sensor widths (mm) for the common CCTV sensor formats.
export const SENSORS = [
  { value: '4.8', label: '1/3"' },
  { value: '5.4', label: '1/2.8" or 1/2.7"' },
  { value: '6.4', label: '1/2"' },
  { value: '7.2', label: '1/1.8"' },
  { value: '8.8', label: '2/3"' },
  { value: '10.7', label: '1/1.2"' },
];

export const RESOLUTIONS = [
  { value: '1920', label: '2MP (1920 px)' },
  { value: '2560', label: '4MP (2560 px)' },
  { value: '2880', label: '5MP (2880 px)' },
  { value: '3840', label: '8MP / 4K (3840 px)' },
];

// IEC 62676-4 (DORI) pixel densities, from the widest band to the closest.
export const DORI = [
  { id: 'detect', label: 'Detect', ppm: 25 },
  { id: 'observe', label: 'Observe', ppm: 62.5 },
  { id: 'recognise', label: 'Recognise', ppm: 125 },
  { id: 'identify', label: 'Identify', ppm: 250 },
];

const num = (value, fallback = 0) => {
  const n = Number.parseFloat(value);
  return Number.isFinite(n) ? n : fallback;
};
const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));
const text = (value, max = 200) => String(value ?? '').slice(0, max);

/** Horizontal field of view in degrees from the lens focal length and sensor width. */
export function fovFromLens(focalMm, sensorWidthMm) {
  const f = num(focalMm);
  const w = num(sensorWidthMm);
  if (f <= 0 || w <= 0) return 0;
  return (2 * Math.atan(w / (2 * f)) * 180) / Math.PI;
}

/** A camera's horizontal field of view, from the datasheet figure or the lens. */
export function cameraFov(device) {
  const fov = device.fovMode === 'fov' ? num(device.hfov) : fovFromLens(device.focal, device.sensor);
  return clamp(fov, 1, 179);
}

/** Furthest distance (m) at which each DORI level is reached. */
export function doriDistances(horizontalPixels, fovDegrees) {
  const px = num(horizontalPixels);
  const half = (clamp(num(fovDegrees), 1, 179) / 2) * (Math.PI / 180);
  return DORI.map((level) => ({ ...level, metres: px > 0 ? px / (level.ppm * 2 * Math.tan(half)) : 0 }));
}

/** Radius (m) a ceiling speaker covers at listening height. */
export function speakerRadius(ceilingM, listenM, angleDegrees) {
  const drop = num(ceilingM) - num(listenM);
  const angle = clamp(num(angleDegrees), 1, 170);
  return drop > 0 ? drop * Math.tan(((angle / 2) * Math.PI) / 180) : 0;
}

/** SVG path for a ring sector: centre (x, y), radii in px, facing `rotation` degrees (0 = right, clockwise). */
export function sectorPath(x, y, inner, outer, rotation, fov) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const a1 = toRad(rotation - fov / 2);
  const a2 = toRad(rotation + fov / 2);
  const large = fov > 180 ? 1 : 0;
  const pt = (r, a) => `${(x + r * Math.cos(a)).toFixed(1)} ${(y + r * Math.sin(a)).toFixed(1)}`;
  if (inner <= 0) return `M ${x.toFixed(1)} ${y.toFixed(1)} L ${pt(outer, a1)} A ${outer.toFixed(1)} ${outer.toFixed(1)} 0 ${large} 1 ${pt(outer, a2)} Z`;
  return `M ${pt(inner, a1)} L ${pt(outer, a1)} A ${outer.toFixed(1)} ${outer.toFixed(1)} 0 ${large} 1 ${pt(outer, a2)} L ${pt(inner, a2)} A ${inner.toFixed(1)} ${inner.toFixed(1)} 0 ${large} 0 ${pt(inner, a1)} Z`;
}

/**
 * The shapes to draw around a device, in plan pixels: [{ key, path | circle, colour, opacity }].
 * Distances are metres x pixels per metre.
 */
export function coverageShapes(device, pxPerMetre) {
  const kind = deviceType(device.type);
  const { x, y } = device;
  if (kind.coverage === 'dori') {
    const fov = cameraFov(device);
    const d = doriDistances(device.resolution, fov);
    const opacity = { detect: 0.1, observe: 0.18, recognise: 0.28, identify: 0.38 };
    const colour = { detect: '#3b82f6', observe: '#22c55e', recognise: '#f59e0b', identify: '#ef4444' };
    return d.map((level, i) => ({
      key: level.id,
      path: sectorPath(x, y, (d[i + 1]?.metres || 0) * pxPerMetre, level.metres * pxPerMetre, device.rotation, fov),
      colour: colour[level.id],
      opacity: opacity[level.id],
    }));
  }
  if (kind.coverage === 'wedge') {
    return [{ key: 'range', path: sectorPath(x, y, 0, num(device.range) * pxPerMetre, device.rotation, clamp(num(device.angle), 1, 360)), colour: kind.colour, opacity: 0.22 }];
  }
  if (kind.coverage === 'speaker') {
    return [{ key: 'range', circle: { cx: x, cy: y, r: speakerRadius(device.ceiling, device.listen, device.angle) * pxPerMetre }, colour: kind.colour, opacity: 0.25 }];
  }
  if (kind.coverage === 'circle' && num(device.radius) > 0) {
    return [{ key: 'range', circle: { cx: x, cy: y, r: num(device.radius) * pxPerMetre }, colour: kind.colour, opacity: 0.1 }];
  }
  return [];
}

/** One line describing a device's coverage, for the schedule. */
export function coverageText(device) {
  const kind = deviceType(device.type);
  if (kind.coverage === 'dori') {
    const fov = cameraFov(device);
    const [detect, , recognise, identify] = doriDistances(device.resolution, fov);
    return `${fov.toFixed(0)}° view; identify ${identify.metres.toFixed(1)} m, recognise ${recognise.metres.toFixed(1)} m, detect ${detect.metres.toFixed(1)} m`;
  }
  if (kind.coverage === 'wedge') return `${num(device.range)} m range, ${num(device.angle)}° wide`;
  if (kind.coverage === 'speaker') return `Covers ${(speakerRadius(device.ceiling, device.listen, device.angle) * 2).toFixed(1)} m across at ${num(device.listen)} m`;
  if (kind.coverage === 'circle' && num(device.radius) > 0) return `${num(device.radius)} m radius`;
  return '';
}

const COVERAGE_DEFAULTS = {
  dori: { rotation: 0, resolution: '2560', fovMode: 'lens', focal: '2.8', sensor: '5.4', hfov: '90' },
  wedge: { rotation: 0, range: '12', angle: '90' },
  speaker: { ceiling: '3', listen: '1.2', angle: '90' },
  circle: { radius: '12' },
};

/** The starting figures for a new device: its coverage kind's, then its own. */
export function defaultsFor(kind) {
  return { ...(COVERAGE_DEFAULTS[kind.coverage] || {}), ...(kind.defaults || {}) };
}

export function newDevice(type, id, x, y, number) {
  const kind = deviceType(type);
  return { id, type: kind.type, name: `${kind.label} ${number}`, x, y, rotation: 0, ...defaultsFor(kind) };
}

export function emptyPlan() {
  return { format: PLAN_FORMAT, version: 2, name: '', image: null, pxPerMetre: 0, devices: [] };
}

function cleanImage(image) {
  if (!image || typeof image !== 'object') return null;
  if (image.src === SAMPLE_IMAGE.src) return { ...SAMPLE_IMAGE };
  if (typeof image.dataUrl === 'string' && /^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(image.dataUrl)) {
    return { dataUrl: image.dataUrl, width: clamp(num(image.width), 1, 10000), height: clamp(num(image.height), 1, 10000) };
  }
  return null;
}

const KEEP = ['resolution', 'fovMode', 'focal', 'sensor', 'hfov', 'range', 'angle', 'ceiling', 'listen', 'radius'];

/** Checks and tidies a plan read from storage or an imported file; null if it is not one. Reads the older camera-only plans too. */
// The parts list (siteplan/quote.js) has at most this many lines.
export const MAX_PART_LINES = 80;

const whole = (value, max) => {
  const n = Math.floor(Number(value));
  return Number.isFinite(n) && n >= 0 ? Math.min(n, max) : null;
};

/** The parts chosen on a plan, as saved: { [key]: { id, qty } }. An id of '' means none from the shop. */
export function cleanParts(raw) {
  const out = {};
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return out;
  const types = new Set(DEVICE_TYPES.map((t) => t.type));
  for (const [key, pick] of Object.entries(raw).slice(0, MAX_PART_LINES)) {
    // A device type, or a cable (cables.js imports this file, so its ids are not checked here).
    if (!(types.has(key) || /^cable:[a-z0-9]{1,20}$/.test(key)) || !pick || typeof pick !== 'object') continue;
    const entry = {};
    if (typeof pick.id === 'string') entry.id = pick.id.slice(0, 120);
    const qty = whole(pick.qty, 9999);
    if (qty !== null) entry.qty = qty;
    if (Object.keys(entry).length) out[key] = entry;
  }
  return out;
}

export function cleanPlan(raw) {
  if (!raw || typeof raw !== 'object' || (raw.format !== PLAN_FORMAT && raw.format !== OLD_PLAN_FORMAT)) return null;
  const list = Array.isArray(raw.devices) ? raw.devices : Array.isArray(raw.cameras) ? raw.cameras.map((c) => ({ ...c, type: 'camera' })) : [];
  const devices = list.slice(0, MAX_DEVICES).map((d, i) => {
    const kind = deviceType(d.type);
    const device = {
      ...defaultsFor(kind),
      id: text(d.id, 40) || `d${i + 1}`,
      type: kind.type,
      name: text(d.name, 80) || `${kind.label} ${i + 1}`,
      x: num(d.x),
      y: num(d.y),
      rotation: ((num(d.rotation) % 360) + 360) % 360,
    };
    for (const key of KEEP) if (d[key] !== undefined && key in device) device[key] = text(d[key], 12);
    if (device.fovMode !== undefined) device.fovMode = d.fovMode === 'fov' ? 'fov' : 'lens';
    // Cabling chosen on the device (siteplan/cables.js); absent means the usual.
    for (const [key, max] of [['cable', 20], ['cableTo', 40], ['cableRuns', 4], ['cableExtra', 8]]) {
      if (d[key] !== undefined && d[key] !== null && d[key] !== '') device[key] = text(d[key], max);
    }
    return device;
  });
  const plan = { format: PLAN_FORMAT, version: 2, name: text(raw.name), image: cleanImage(raw.image), pxPerMetre: Math.max(0, num(raw.pxPerMetre)), devices };
  // The products chosen in Parts and price (siteplan/quote.js), when any were.
  const parts = cleanParts(raw.parts);
  if (Object.keys(parts).length) plan.parts = parts;
  return plan;
}

export function parsePlan(json) {
  try {
    return cleanPlan(JSON.parse(json));
  } catch {
    return null;
  }
}

/** Pixels per metre from two points on the plan and the real distance between them. */
export function scaleFromPoints(a, b, metres) {
  const m = num(metres);
  const px = Math.hypot(b.x - a.x, b.y - a.y);
  return m > 0 && px > 0 ? px / m : 0;
}

/** Without a scale, assume the plan is 40 m across so the coverage still means something. */
export function effectiveScale(plan) {
  if (plan.pxPerMetre > 0) return plan.pxPerMetre;
  return (plan.image ? plan.image.width : BLANK_PLAN.width) / 40;
}

/** The plan shown on a first visit: an office and warehouse with a few devices on it. */
export function samplePlan() {
  const d = (type, id, x, y, extra = {}) => ({ ...newDevice(type, id, x, y, 1), ...extra });
  return {
    ...emptyPlan(),
    name: 'Sample office and warehouse',
    image: { ...SAMPLE_IMAGE },
    pxPerMetre: 40,
    devices: [
      d('camera', 's1', 60, 60, { name: 'Reception camera', rotation: 40 }),
      d('camera', 's2', 1540, 60, { name: 'Warehouse camera', rotation: 120, focal: '4' }),
      d('camera', 's3', 1540, 940, { name: 'Roller door camera', rotation: 225, focal: '6', resolution: '1920' }),
      d('motion', 's4', 60, 940, { name: 'Open office detector', rotation: 315 }),
      d('motion', 's5', 1020, 60, { name: 'Warehouse detector', rotation: 45, range: '15' }),
      d('speaker', 's6', 200, 560, { name: 'Speaker 1' }),
      d('speaker', 's7', 520, 560, { name: 'Speaker 2' }),
      d('speaker', 's8', 200, 780, { name: 'Speaker 3' }),
      d('speaker', 's9', 520, 780, { name: 'Speaker 4' }),
      d('wifi', 's10', 400, 660, { name: 'Office access point', radius: '8' }),
      d('wifi', 's11', 1280, 500, { name: 'Warehouse access point', radius: '10' }),
      d('door', 's12', 40, 210, { name: 'Front entry' }),
      d('reader', 's13', 70, 290, { name: 'Entry reader' }),
      d('keypad', 's14', 110, 330, { name: 'Alarm keypad' }),
      d('door', 's15', 775, 620, { name: 'Server room door' }),
      d('siren', 's16', 1530, 580, { name: 'Warehouse siren' }),
      d('intercom', 's17', 70, 130, { name: 'Front intercom' }),
      d('rack', 's18', 775, 665, { name: 'Comms rack' }),
      d('switch', 's19', 775, 715, { name: 'PoE switch' }),
      d('nvr', 's20', 775, 765, { name: 'Recorder' }),
      d('alarmpanel', 's21', 775, 815, { name: 'Alarm panel' }),
      d('controller', 's22', 775, 865, { name: 'Door controller' }),
      d('amplifier', 's23', 775, 915, { name: 'PA amplifier' }),
    ],
  };
}
