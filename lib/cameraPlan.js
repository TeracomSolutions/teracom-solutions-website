// Camera plan designer (Robert, 2026-11-02): a floor plan with cameras dropped on
// it, each showing its field of view and how far it can detect, observe, recognise
// and identify a person. Pure functions here; the drawing is in
// components/tools/CameraPlanner.js. The plan lives in the visitor's browser.

export const PLAN_FORMAT = 'teracom-camera-plan';
export const PLAN_STORAGE_KEY = 'teracom-camera-plan-v1';
export const MAX_CAMERAS = 100;
// The grid shown before a plan is uploaded, in plan pixels.
export const BLANK_PLAN = { width: 1600, height: 1000 };

// Nominal sensor widths (mm) for the common CCTV sensor formats. Real cameras
// crop differently, so the datasheet's horizontal field of view wins when known.
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

/** Horizontal field of view in degrees from the lens focal length and sensor width. */
export function fovFromLens(focalMm, sensorWidthMm) {
  const f = num(focalMm);
  const w = num(sensorWidthMm);
  if (f <= 0 || w <= 0) return 0;
  return (2 * Math.atan(w / (2 * f)) * 180) / Math.PI;
}

/** The camera's horizontal field of view, from the datasheet figure or the lens. */
export function cameraFov(camera) {
  const fov = camera.fovMode === 'fov' ? num(camera.hfov) : fovFromLens(camera.focal, camera.sensor);
  return clamp(fov, 1, 179);
}

/** Furthest distance (m) at which each DORI level is reached. */
export function doriDistances(horizontalPixels, fovDegrees) {
  const px = num(horizontalPixels);
  const half = (clamp(num(fovDegrees), 1, 179) / 2) * (Math.PI / 180);
  return DORI.map((level) => ({ ...level, metres: px > 0 ? px / (level.ppm * 2 * Math.tan(half)) : 0 }));
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

export function newCamera(id, x, y, number) {
  return { id, name: `Camera ${number}`, x, y, rotation: 0, resolution: '2560', fovMode: 'lens', focal: '2.8', sensor: '5.4', hfov: '90' };
}

export function emptyPlan() {
  return { format: PLAN_FORMAT, version: 1, name: '', image: null, pxPerMetre: 0, cameras: [] };
}

const text = (value, max = 200) => String(value ?? '').slice(0, max);

/** Checks and tidies a plan read from storage or an imported file; null if it is not one. */
export function cleanPlan(raw) {
  if (!raw || typeof raw !== 'object' || raw.format !== PLAN_FORMAT) return null;
  const image =
    raw.image && typeof raw.image.dataUrl === 'string' && /^data:image\/(png|jpeg|webp);base64,/.test(raw.image.dataUrl)
      ? { dataUrl: raw.image.dataUrl, width: clamp(num(raw.image.width), 1, 10000), height: clamp(num(raw.image.height), 1, 10000) }
      : null;
  const cameras = (Array.isArray(raw.cameras) ? raw.cameras : []).slice(0, MAX_CAMERAS).map((c, i) => ({
    id: text(c.id, 40) || `c${i + 1}`,
    name: text(c.name, 80) || `Camera ${i + 1}`,
    x: num(c.x),
    y: num(c.y),
    rotation: ((num(c.rotation) % 360) + 360) % 360,
    resolution: text(c.resolution, 6) || '2560',
    fovMode: c.fovMode === 'fov' ? 'fov' : 'lens',
    focal: text(c.focal, 8) || '2.8',
    sensor: text(c.sensor, 8) || '5.4',
    hfov: text(c.hfov, 8) || '90',
  }));
  return { format: PLAN_FORMAT, version: 1, name: text(raw.name), image, pxPerMetre: Math.max(0, num(raw.pxPerMetre)), cameras };
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

/** Without a scale, assume the plan is 40 m across so the cones still mean something. */
export function effectiveScale(plan) {
  if (plan.pxPerMetre > 0) return plan.pxPerMetre;
  return (plan.image ? plan.image.width : BLANK_PLAN.width) / 40;
}
