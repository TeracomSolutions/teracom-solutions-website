// Field/result definitions for the camera calculators, rendered by
// components/tools/ConfigCalculator.js like the rest of lib/toolConfigs.js.
import { fmt, metresText } from '@/lib/calcFormat';
import { ASPECT_RATIOS } from '@/lib/calculators';
import { CODECS, RESOLUTIONS, SCENE_ACTIVITY, cameraBitrate, cameraDataUsage, mountingCoverage } from '@/lib/videoCalculators';

const optionsOf = (list) => list.map((item) => ({ value: item.id, label: item.label }));

export const videoToolConfigs = {
  'cctv-bitrate-calculator': {
    fields: [
      { id: 'resolution', label: 'Camera resolution', type: 'select', default: '4mp', options: optionsOf(RESOLUTIONS) },
      { id: 'fps', label: 'Frame rate (fps)', type: 'number', default: '15', step: '1', hint: '15 fps is common for surveillance; 25 or 30 fps gives smoother motion.' },
      { id: 'codec', label: 'Compression', type: 'select', default: 'h265', options: optionsOf(CODECS) },
      { id: 'activity', label: 'How busy the scene is', type: 'select', default: 'low', options: optionsOf(SCENE_ACTIVITY) },
    ],
    compute: (v) => cameraBitrate(v),
    results: (r) => [
      { label: 'Estimated bitrate', value: `${fmt(r.bitrateMbps, 1)} Mbps` },
      { label: 'Continuous recording per camera per day', value: `${fmt(r.gbPerDay, 0)} GB` },
    ],
    note: "A planning estimate: use the camera maker's bitrate when you have it. Smart codecs such as H.265+ can cut a mostly still scene much further. Take the bitrate to the CCTV Storage or Bandwidth calculator.",
  },

  'cctv-mounting-height-calculator': {
    fields: [
      { id: 'heightMetres', label: 'Mounting height (m)', type: 'number', default: '3', step: '0.1' },
      { id: 'tiltDegrees', label: 'Tilt below horizontal (degrees)', type: 'number', default: '35', step: '1', hint: 'Measured to the centre of the image.' },
      { id: 'horizontalFovDegrees', label: 'Horizontal field of view (degrees)', type: 'number', default: '90', step: '1', hint: 'From the camera or lens datasheet.' },
      { id: 'aspect', label: 'Image shape', type: 'select', default: '16:9', options: ASPECT_RATIOS.map((a) => ({ value: a.id, label: a.id })) },
      { id: 'targetHeightMetres', label: 'Height to check (m)', type: 'number', default: '1.7', step: '0.1', hint: '1.7 m is about head height.' },
    ],
    compute: (v) => mountingCoverage(v),
    results: (r, v) => [
      { label: 'Vertical field of view', value: `${fmt(r.verticalFovDegrees, 0)}°` },
      { label: 'Ground in view', value: `${metresText(r.ground.nearMetres)} to ${metresText(r.ground.farMetres)}` },
      { label: 'Blind spot under the camera', value: metresText(r.ground.nearMetres) },
      ...(r.atTarget
        ? [{ label: `In view at ${fmt(Number(v.targetHeightMetres) || 0, 1)} m high`, value: `${metresText(r.atTarget.nearMetres)} to ${metresText(r.atTarget.farMetres)}` }]
        : []),
      ...(r.seesHorizon ? [{ warn: 'The top of the image reaches the horizon, so sky and distant background take up part of the picture. Tilt down for more useful detail.' }] : []),
    ],
    note: 'Distances are along level ground from the point under the camera. Use the CCTV Lens calculator to check the detail you get at those distances.',
  },

  '4g-cctv-data-calculator': {
    fields: [
      { id: 'liveMinutesPerDay', label: 'Live viewing per day (minutes)', type: 'number', default: '10', step: '1' },
      { id: 'liveMbps', label: 'Live view bitrate (Mbps)', type: 'number', default: '0.5', step: '0.1', hint: 'The sub-stream most apps use for live view.' },
      { id: 'eventsPerDay', label: 'Events uploaded per day', type: 'number', default: '20', step: '1' },
      { id: 'clipSeconds', label: 'Clip length (seconds)', type: 'number', default: '20', step: '1' },
      { id: 'clipMbps', label: 'Clip bitrate (Mbps)', type: 'number', default: '2', step: '0.1' },
      { id: 'uploadHoursPerDay', label: 'Continuous cloud upload (hours per day)', type: 'number', default: '0', step: '1', hint: 'Leave at 0 if the camera records to its own SD card.' },
      { id: 'uploadMbps', label: 'Cloud upload bitrate (Mbps)', type: 'number', default: '1', step: '0.1' },
      { id: 'overheadPercent', label: 'Overhead allowance (%)', type: 'number', default: '10', step: '1' },
      { id: 'daysPerMonth', label: 'Days in the month', type: 'number', default: '30', step: '1' },
    ],
    compute: (v) => cameraDataUsage(v),
    results: (r) => [
      { label: 'Live viewing per day', value: `${fmt(r.liveMB, 0)} MB` },
      { label: 'Event clips per day', value: `${fmt(r.clipsMB, 0)} MB` },
      { label: 'Continuous upload per day', value: `${fmt(r.uploadMB, 0)} MB` },
      { label: 'Total per month', value: `${fmt(r.perMonthGB, 1)} GB` },
      { label: 'Plan size with 20% spare', value: `${fmt(r.perMonthGB * 1.2, 1)} GB` },
    ],
    note: 'Counted in decimal units (1 GB = 1,000 MB). Firmware updates and app check-ins add a little more.',
  },
};
