// Field/result definitions for the calculators rendered by
// components/tools/ConfigCalculator.js. All the maths lives in
// lib/calculators.js (unit-tested); this file only describes the inputs and
// how each result is worded. Field values are the strings the visitor typed.
import {
  ASPECT_RATIOS,
  DRIVE_SIZES_TB,
  RAID_LEVELS,
  cctvBandwidth,
  ipSubnet,
  lensCoverage,
  prefixToMask,
  projectorThrow,
  psuLoad,
  raidPlanner,
  speakerLoad,
  upsRuntime,
} from '@/lib/calculators';

const fmt = (n, dp = 2) =>
  Number.isFinite(n) ? n.toLocaleString('en-AU', { minimumFractionDigits: dp, maximumFractionDigits: dp }) : '0';

const minutesToText = (mins) => {
  const total = Math.round(mins);
  const h = Math.floor(total / 60);
  const m = total % 60;
  return h > 0 ? `${h} h ${m} min` : `${m} min`;
};

export const toolConfigs = {
  'cctv-lens-calculator': {
    fields: [
      {
        id: 'horizontalPixels',
        label: 'Horizontal resolution',
        type: 'select',
        default: '2560',
        options: [
          { value: '1920', label: '1920 px (2MP / 1080p)' },
          { value: '2560', label: '2560 px (4MP)' },
          { value: '2592', label: '2592 px (5MP)' },
          { value: '3840', label: '3840 px (8MP / 4K)' },
        ],
      },
      {
        id: 'horizontalFovDegrees',
        label: 'Horizontal field of view (degrees)',
        type: 'number',
        default: '90',
        step: '1',
        hint: 'From the camera or lens datasheet, at the focal length you will use.',
      },
      { id: 'distanceMetres', label: 'Distance to the target (m)', type: 'number', default: '10', step: '0.5' },
    ],
    compute: (v) => lensCoverage(v),
    results: (r) => [
      { label: 'Scene width at that distance', value: `${fmt(r.sceneWidthMetres)} m` },
      { label: 'Pixel density', value: `${fmt(r.pixelsPerMetre, 0)} px/m` },
      { label: 'Detail level', value: r.level || 'Below detection (under 25 px/m)' },
      ...r.maxDistances.map((l) => ({
        label: `Furthest distance to ${l.label.toLowerCase()} (${l.ppm} px/m)`,
        value: `${fmt(l.metres, 1)} m`,
      })),
    ],
    note: 'Detail levels use the IEC 62676-4 (DORI) pixel-density thresholds. Real results also depend on lighting, lens quality, compression and mounting angle.',
  },

  'cctv-bandwidth-calculator': {
    fields: [
      { id: 'cameras', label: 'Number of cameras', type: 'number', default: '16', step: '1' },
      {
        id: 'bitrateMbps',
        label: 'Recording bitrate per camera (Mbps)',
        type: 'number',
        default: '4',
        step: '0.5',
        hint: 'Use the camera datasheet figure; as a starting point, 2MP is around 2-4 Mbps and 4MP around 3-6 Mbps at 15 fps.',
      },
      { id: 'remoteStreams', label: 'Streams viewed remotely at the same time', type: 'number', default: '4', step: '1' },
      { id: 'remoteBitrateMbps', label: 'Remote viewing (sub-stream) bitrate (Mbps)', type: 'number', default: '0.5', step: '0.1' },
      { id: 'overheadPercent', label: 'Network overhead allowance (%)', type: 'number', default: '10', step: '1' },
    ],
    compute: (v) => cctvBandwidth(v),
    results: (r) => [
      { label: 'Cameras to the recorder', value: `${fmt(r.recordingMbps, 1)} Mbps` },
      { label: 'Remote viewing (site upload needed)', value: `${fmt(r.remoteMbps, 1)} Mbps` },
      { label: 'Total', value: `${fmt(r.totalMbps, 1)} Mbps` },
      { label: 'Share of a 1 Gbps link', value: `${fmt(r.gigabitPercent, 1)}%` },
      ...(r.gigabitPercent > 70
        ? [{ warn: 'Over 70% of a 1 Gbps link -- consider a 10 Gbps uplink or splitting cameras across switches.' }]
        : []),
    ],
    note: 'The remote viewing figure is the upload speed the site internet connection needs to support.',
  },

  'nvr-raid-planner': {
    fields: [
      {
        id: 'requiredTB',
        label: 'Storage needed (TB)',
        type: 'number',
        default: '30',
        step: '1',
        hint: 'Use the result from the CCTV Storage Calculator.',
      },
      {
        id: 'driveTB',
        label: 'Drive size',
        type: 'select',
        default: '8',
        options: DRIVE_SIZES_TB.map((tb) => ({ value: String(tb), label: `${tb} TB` })),
      },
      {
        id: 'raid',
        label: 'RAID level',
        type: 'select',
        default: 'raid5',
        options: RAID_LEVELS.map((l) => ({ value: l.id, label: l.label })),
      },
      { id: 'hotSpares', label: 'Hot spare drives', type: 'number', default: '0', step: '1' },
    ],
    compute: (v) => raidPlanner(v),
    results: (r) => [
      { label: 'Drives needed', value: `${r.totalDrives}${r.totalDrives !== r.arrayDrives ? ` (${r.arrayDrives} in the array + ${r.totalDrives - r.arrayDrives} spare)` : ''}` },
      { label: 'Usable capacity', value: `${fmt(r.usableTB, 0)} TB` },
      { label: 'Raw capacity', value: `${fmt(r.rawTB, 0)} TB` },
    ],
    note: 'Drive makers quote decimal terabytes, so the recorder will report roughly 9% less. Check the NVR has enough drive bays and supports the RAID level you pick.',
  },

  'access-control-psu-calculator': {
    fields: [
      { id: 'headroomPercent', label: 'Headroom (%)', type: 'number', default: '20', step: '5' },
    ],
    rows: {
      label: 'Devices',
      addLabel: 'Add device',
      columns: [
        { id: 'name', label: 'Device', type: 'text' },
        { id: 'amps', label: 'Current each (A)', type: 'number', step: '0.01' },
        { id: 'quantity', label: 'Quantity', type: 'number', step: '1' },
      ],
      defaults: [
        { name: 'Card readers', amps: '0.15', quantity: '2' },
        { name: 'Maglocks', amps: '0.5', quantity: '2' },
        { name: 'Door controller', amps: '0.3', quantity: '1' },
      ],
      blank: { name: '', amps: '0', quantity: '1' },
    },
    compute: (v, rows) => psuLoad({ devices: rows, headroomPercent: v.headroomPercent }),
    results: (r) => [
      { label: 'Total load', value: `${fmt(r.totalAmps)} A` },
      { label: 'Required rating with headroom', value: `${fmt(r.requiredAmps)} A` },
      {
        label: 'Suggested power supply',
        value: r.suggestedAmps === null ? 'Over 10 A -- split the load across supplies' : `${fmt(r.suggestedAmps, 1)} A`,
      },
    ],
    note: 'The starting values are examples only -- use the current draw from each device datasheet (locks at their holding current). The total load is also the standby/alarm current for the Battery Standby Calculator.',
  },

  'ups-runtime-calculator': {
    fields: [
      { id: 'loadWatts', label: 'Load (W)', type: 'number', default: '200', step: '10' },
      { id: 'batteryVolts', label: 'Battery voltage (V)', type: 'number', default: '12', step: '1' },
      { id: 'batteryAh', label: 'Battery capacity (Ah)', type: 'number', default: '9', step: '1' },
      { id: 'batteryCount', label: 'Number of batteries', type: 'number', default: '2', step: '1' },
      { id: 'efficiencyPercent', label: 'Inverter efficiency (%)', type: 'number', default: '90', step: '1' },
      { id: 'powerFactor', label: 'Load power factor', type: 'number', default: '0.9', step: '0.05' },
      { id: 'headroomPercent', label: 'Sizing headroom (%)', type: 'number', default: '25', step: '5' },
    ],
    compute: (v) => upsRuntime(v),
    results: (r) => [
      { label: 'Battery energy', value: `${fmt(r.batteryWh, 0)} Wh` },
      { label: 'Estimated runtime', value: minutesToText(r.runtimeMinutes) },
      { label: 'Minimum UPS rating', value: `${fmt(r.requiredVA, 0)} VA` },
      {
        label: 'Suggested UPS size',
        value: r.suggestedVA === null ? 'Over 10,000 VA -- consider multiple UPS units' : `${r.suggestedVA.toLocaleString('en-AU')} VA`,
      },
    ],
    note: 'Runtime is an estimate: batteries deliver less at high loads, low temperatures and as they age. Check the UPS maker\'s runtime chart for the final figure.',
  },

  'speaker-load-calculator': {
    fields: [
      {
        id: 'lineVolts',
        label: 'Line voltage',
        type: 'select',
        default: '100',
        options: [
          { value: '100', label: '100 V line' },
          { value: '70', label: '70 V line' },
        ],
      },
      { id: 'amplifierWatts', label: 'Amplifier rating (W)', type: 'number', default: '240', step: '10' },
      { id: 'headroomPercent', label: 'Headroom (%)', type: 'number', default: '20', step: '5' },
    ],
    rows: {
      label: 'Speakers',
      addLabel: 'Add speakers',
      columns: [
        { id: 'name', label: 'Speakers', type: 'text' },
        { id: 'watts', label: 'Tap setting (W)', type: 'number', step: '0.5' },
        { id: 'quantity', label: 'Quantity', type: 'number', step: '1' },
      ],
      defaults: [
        { name: 'Ceiling speakers', watts: '6', quantity: '10' },
        { name: 'Horn speakers', watts: '10', quantity: '4' },
      ],
      blank: { name: '', watts: '0', quantity: '1' },
    },
    compute: (v, rows) => speakerLoad({ ...v, speakers: rows }),
    results: (r) => [
      { label: 'Total tap load', value: `${fmt(r.totalWatts, 1)} W` },
      { label: 'Minimum amplifier with headroom', value: `${fmt(r.minAmplifierWatts, 0)} W` },
      { label: 'Amplifier loading', value: `${fmt(r.utilisationPercent, 0)}%` },
      { label: 'Line impedance', value: `${fmt(r.lineImpedanceOhms, 1)} Ω` },
      ...(r.amplifierOk ? [] : [{ warn: `The amplifier is smaller than the load plus headroom -- choose at least ${fmt(r.minAmplifierWatts, 0)} W.` }]),
    ],
    note: 'Line impedance is the line voltage squared divided by the total tap load. Keep the amplifier within its rated minimum load impedance.',
  },

  'projector-throw-calculator': {
    fields: [
      { id: 'throwRatio', label: 'Throw ratio', type: 'number', default: '1.5', step: '0.01', hint: 'From the projector datasheet (distance divided by image width).' },
      { id: 'distanceMetres', label: 'Throw distance (m)', type: 'number', default: '4.5', step: '0.1' },
      {
        id: 'aspect',
        label: 'Aspect ratio',
        type: 'select',
        default: '16:9',
        options: ASPECT_RATIOS.map((a) => ({ value: a.id, label: a.id })),
      },
      { id: 'targetWidthMetres', label: 'Screen width you want (m, optional)', type: 'number', default: '2.5', step: '0.1' },
    ],
    compute: (v) => projectorThrow(v),
    results: (r, v) => [
      { label: 'Image width', value: `${fmt(r.widthMetres)} m` },
      { label: 'Image height', value: `${fmt(r.heightMetres)} m` },
      { label: 'Image diagonal', value: `${fmt(r.diagonalInches, 0)} in` },
      { label: `Distance for a ${fmt(Number(v.targetWidthMetres) || 0, 1)} m wide image`, value: `${fmt(r.distanceForTargetMetres)} m` },
    ],
    note: 'Zoom lenses have a throw-ratio range -- run the numbers at both ends of it.',
  },

  'ip-subnet-calculator': {
    fields: [
      { id: 'address', label: 'IP address', type: 'text', default: '192.168.1.64' },
      {
        id: 'prefix',
        label: 'Prefix length',
        type: 'select',
        default: '24',
        options: Array.from({ length: 23 }, (_, i) => i + 8).map((p) => ({ value: String(p), label: `/${p} (${prefixToMask(p)})` })),
      },
    ],
    compute: (v) => ipSubnet(v),
    results: (r) =>
      r.valid
        ? [
            { label: 'Subnet mask', value: r.mask },
            { label: 'Network address', value: r.network },
            { label: 'Broadcast address', value: r.broadcast },
            { label: 'Usable addresses', value: `${r.firstHost} to ${r.lastHost}` },
            { label: 'Usable hosts', value: r.usableHosts.toLocaleString('en-AU') },
          ]
        : [{ warn: 'Enter a valid IPv4 address, e.g. 192.168.1.64.' }],
    note: 'Leave room for growth -- a camera network often ends up with more devices than planned.',
  },
};
