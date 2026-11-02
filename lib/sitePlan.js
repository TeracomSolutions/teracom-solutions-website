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

// What can be dropped on a plan. `coverage` decides what is drawn around it:
// dori = camera bands, wedge = a fan (detectors), circle = a radius, none = the icon only.
export const DEVICE_TYPES = [
  { type: 'camera', label: 'CCTV camera', colour: '#ef4444', coverage: 'dori', turns: true },
  { type: 'motion', label: 'Motion detector', colour: '#a855f7', coverage: 'wedge', turns: true },
  { type: 'speaker', label: 'Ceiling speaker', colour: '#f59e0b', coverage: 'speaker' },
  { type: 'wifi', label: 'Wi-Fi access point', colour: '#0ea5e9', coverage: 'circle' },
  { type: 'door', label: 'Access-controlled door', colour: '#10b981', coverage: 'none' },
  { type: 'reader', label: 'Card reader', colour: '#14b8a6', coverage: 'none' },
  { type: 'keypad', label: 'Alarm keypad', colour: '#6366f1', coverage: 'none' },
  { type: 'siren', label: 'Siren or strobe', colour: '#f43f5e', coverage: 'none' },
  { type: 'intercom', label: 'Intercom', colour: '#22c55e', coverage: 'none' },
  { type: 'other', label: 'Other device', colour: '#64748b', coverage: 'circle' },
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

const DEFAULTS = {
  camera: { rotation: 0, resolution: '2560', fovMode: 'lens', focal: '2.8', sensor: '5.4', hfov: '90' },
  motion: { rotation: 0, range: '12', angle: '90' },
  speaker: { ceiling: '3', listen: '1.2', angle: '90' },
  wifi: { radius: '12' },
  other: { radius: '0' },
};

export function newDevice(type, id, x, y, number) {
  const kind = deviceType(type);
  return { id, type: kind.type, name: `${kind.label} ${number}`, x, y, rotation: 0, ...(DEFAULTS[kind.type] || {}) };
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
export function cleanPlan(raw) {
  if (!raw || typeof raw !== 'object' || (raw.format !== PLAN_FORMAT && raw.format !== OLD_PLAN_FORMAT)) return null;
  const list = Array.isArray(raw.devices) ? raw.devices : Array.isArray(raw.cameras) ? raw.cameras.map((c) => ({ ...c, type: 'camera' })) : [];
  const devices = list.slice(0, MAX_DEVICES).map((d, i) => {
    const kind = deviceType(d.type);
    const device = {
      ...(DEFAULTS[kind.type] || {}),
      id: text(d.id, 40) || `d${i + 1}`,
      type: kind.type,
      name: text(d.name, 80) || `${kind.label} ${i + 1}`,
      x: num(d.x),
      y: num(d.y),
      rotation: ((num(d.rotation) % 360) + 360) % 360,
    };
    for (const key of KEEP) if (d[key] !== undefined && key in device) device[key] = text(d[key], 12);
    if (device.fovMode !== undefined) device.fovMode = d.fovMode === 'fov' ? 'fov' : 'lens';
    return device;
  });
  return { format: PLAN_FORMAT, version: 2, name: text(raw.name), image: cleanImage(raw.image), pxPerMetre: Math.max(0, num(raw.pxPerMetre)), devices };
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
    ],
  };
}
