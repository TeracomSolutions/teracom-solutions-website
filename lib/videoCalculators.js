// Camera planning maths for the free tools (fields in lib/videoToolConfigs.js).
import { ASPECT_RATIOS, num } from './calculators.js';

export const RESOLUTIONS = [
  { id: '2mp', label: '2MP (1920 x 1080)', width: 1920, height: 1080 },
  { id: '4mp', label: '4MP (2560 x 1440)', width: 2560, height: 1440 },
  { id: '5mp', label: '5MP (2592 x 1944)', width: 2592, height: 1944 },
  { id: '8mp', label: '8MP / 4K (3840 x 2160)', width: 3840, height: 2160 },
  { id: '12mp', label: '12MP (4000 x 3000)', width: 4000, height: 3000 },
];

// The Kush gauge's motion ranks.
export const SCENE_ACTIVITY = [
  { id: 'low', label: 'Low: a quiet corridor, yard or car park', factor: 1 },
  { id: 'medium', label: 'Medium: an entrance, office or shop floor', factor: 2 },
  { id: 'high', label: 'High: a busy street, crowds, trees or traffic', factor: 4 },
];

// H.265 usually needs 25-50% less than H.264 for the same picture; 0.6 is
// the middle of that range.
export const CODECS = [
  { id: 'h264', label: 'H.264', factor: 1 },
  { id: 'h265', label: 'H.265', factor: 0.6 },
];

const KUSH_BITS_PER_PIXEL = 0.07;

export function cameraBitrate({ resolution = '4mp', fps, codec = 'h265', activity = 'low' }) {
  const res = RESOLUTIONS.find((r) => r.id === resolution) || RESOLUTIONS[1];
  const motion = (SCENE_ACTIVITY.find((a) => a.id === activity) || SCENE_ACTIVITY[0]).factor;
  const codecFactor = (CODECS.find((c) => c.id === codec) || CODECS[1]).factor;
  const bitrateMbps = (res.width * res.height * num(fps) * motion * KUSH_BITS_PER_PIXEL * codecFactor) / 1e6;
  return {
    bitrateMbps,
    gbPerDay: (bitrateMbps * 1e6 / 8) * 86400 / 1e9,
  };
}

const rad = (degrees) => (degrees * Math.PI) / 180;
const deg = (radians) => (radians * 180) / Math.PI;

// Where the bottom and top edges of the image meet a level surface `drop`
// metres below the camera. Infinity means the top edge reaches the horizon.
function span(drop, tiltDegrees, verticalFovDegrees) {
  const near = tiltDegrees + verticalFovDegrees / 2;
  const far = tiltDegrees - verticalFovDegrees / 2;
  return {
    nearMetres: near >= 90 ? 0 : drop / Math.tan(rad(near)),
    farMetres: far <= 0 ? Infinity : drop / Math.tan(rad(far)),
  };
}

export function mountingCoverage({ heightMetres, tiltDegrees, horizontalFovDegrees, aspect = '16:9', targetHeightMetres = 1.7 }) {
  const height = num(heightMetres);
  const tilt = Math.min(num(tiltDegrees), 90);
  const horizontalFov = Math.min(num(horizontalFovDegrees), 179);
  const a = ASPECT_RATIOS.find((x) => x.id === aspect) || ASPECT_RATIOS[0];
  const verticalFovDegrees = deg(2 * Math.atan((Math.tan(rad(horizontalFov / 2)) * a.h) / a.w));
  const target = num(targetHeightMetres);
  return {
    verticalFovDegrees,
    ground: span(height, tilt, verticalFovDegrees),
    atTarget: target > 0 && target < height ? span(height - target, tilt, verticalFovDegrees) : null,
    seesHorizon: tilt - verticalFovDegrees / 2 <= 0,
  };
}

export function cameraDataUsage({
  liveMinutesPerDay,
  liveMbps,
  eventsPerDay,
  clipSeconds,
  clipMbps,
  uploadHoursPerDay,
  uploadMbps,
  overheadPercent = 10,
  daysPerMonth = 30,
}) {
  // Megabits per second x seconds / 8 = megabytes.
  const megabytes = (mbps, seconds) => (num(mbps) * seconds) / 8;
  const liveMB = megabytes(liveMbps, num(liveMinutesPerDay) * 60);
  const clipsMB = megabytes(clipMbps, num(eventsPerDay) * num(clipSeconds));
  const uploadMB = megabytes(uploadMbps, Math.min(num(uploadHoursPerDay), 24) * 3600);
  const perDayMB = (liveMB + clipsMB + uploadMB) * (1 + num(overheadPercent) / 100);
  return {
    liveMB,
    clipsMB,
    uploadMB,
    perDayMB,
    perMonthGB: (perDayMB * num(daysPerMonth)) / 1000,
  };
}