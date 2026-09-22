// Blank, non-numeric or negative inputs count as 0 so a half-typed form never shows NaN.
const num = (v) => {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : 0;
};

export const BITRATE_PRESETS = [
  { id: '2mp', label: '2MP (1080p)', h264Mbps: 4, h265Mbps: 2 },
  { id: '4mp', label: '4MP (1440p)', h264Mbps: 6, h265Mbps: 3 },
  { id: '5mp', label: '5MP', h264Mbps: 8, h265Mbps: 4 },
  { id: '8mp', label: '8MP (4K)', h264Mbps: 12, h265Mbps: 6 }
];

export function cctvStorage({ cameras, bitrateMbps, hoursPerDay, activityPercent, retentionDays }) {
  // Handle invalid/negative inputs
  cameras = num(cameras);
  bitrateMbps = num(bitrateMbps);
  hoursPerDay = num(hoursPerDay);
  activityPercent = num(activityPercent);
  retentionDays = num(retentionDays);

  const bytesPerSecondPerCamera = bitrateMbps * 1e6 / 8;
  const secondsPerDay = hoursPerDay * 3600 * (activityPercent / 100);
  const gbPerCameraPerDay = bytesPerSecondPerCamera * secondsPerDay / 1e9;
  const totalTB = gbPerCameraPerDay * cameras * retentionDays / 1000;

  return {
    gbPerCameraPerDay,
    totalTB
  };
}

export const POE_TYPES = [
  { id: 'af', label: '802.3af (PoE)', watts: 15.4 },
  { id: 'at', label: '802.3at (PoE+)', watts: 30 },
  { id: 'bt3', label: '802.3bt Type 3', watts: 60 },
  { id: 'bt4', label: '802.3bt Type 4', watts: 90 }
];

export function poeBudget({ devices, switchBudgetWatts, switchPorts }) {
  // Handle invalid inputs
  switchBudgetWatts = num(switchBudgetWatts);
  switchPorts = num(switchPorts);

  let totalWatts = 0;
  let portsUsed = 0;

  for (const device of devices) {
    const quantity = num(device.quantity);
    const watts = num(device.watts);
    totalWatts += quantity * watts;
    portsUsed += quantity;
  }

  const utilisationPercent = switchBudgetWatts > 0 ? totalWatts / switchBudgetWatts * 100 : 0;
  const remainingWatts = switchBudgetWatts - totalWatts;
  const overBudget = totalWatts > switchBudgetWatts;
  const overPorts = switchPorts > 0 && portsUsed > switchPorts;
  const lowHeadroom = !overBudget && utilisationPercent > 80;

  return {
    totalWatts,
    portsUsed,
    utilisationPercent,
    remainingWatts,
    overBudget,
    overPorts,
    lowHeadroom
  };
}

export const BATTERY_SIZES_AH = [1.2, 2.3, 7, 9, 12, 18, 26, 40, 65, 100];

export function batteryStandby({ standbyAmps, standbyHours, alarmAmps, alarmHours, derating = 1.25 }) {
  // Handle invalid inputs
  standbyAmps = num(standbyAmps);
  standbyHours = num(standbyHours);
  alarmAmps = num(alarmAmps);
  alarmHours = num(alarmHours);
  derating = num(derating);

  const requiredAh = (standbyAmps * standbyHours + alarmAmps * alarmHours) * derating;
  
  let recommendedAh = null;
  for (const size of BATTERY_SIZES_AH) {
    if (requiredAh <= size) {
      recommendedAh = size;
      break;
    }
  }
  
  // If requiredAh is greater than the largest battery size, return null
  if (requiredAh > 100) {
    recommendedAh = null;
  }

  return {
    requiredAh,
    recommendedAh
  };
}

// Copper resistivity at 20 degC, ohm.mm2/m.
export const COPPER_RESISTIVITY = 0.0172;

// Common copper conductor sizes for low-voltage security runs (stranding in brackets).
export const CABLE_SIZES_MM2 = [
  { mm2: 0.22, label: '0.22 mm² (7/0.20)' },
  { mm2: 0.44, label: '0.44 mm² (14/0.20)' },
  { mm2: 0.5, label: '0.5 mm² (16/0.20)' },
  { mm2: 0.75, label: '0.75 mm² (24/0.20)' },
  { mm2: 1, label: '1.0 mm² (32/0.20)' },
  { mm2: 1.5, label: '1.5 mm²' },
  { mm2: 2.5, label: '2.5 mm²' },
  { mm2: 4, label: '4 mm²' },
  { mm2: 6, label: '6 mm²' },
];

// Two-wire DC run: current flows out and back, so the loop length is twice the one-way length.
export function voltageDrop({ supplyVolts, currentAmps, lengthMetres, conductorMm2, maxDropPercent = 10 }) {
  supplyVolts = num(supplyVolts);
  currentAmps = num(currentAmps);
  lengthMetres = num(lengthMetres);
  conductorMm2 = num(conductorMm2);
  maxDropPercent = num(maxDropPercent);

  const resistanceOhms = conductorMm2 > 0 ? (2 * lengthMetres * COPPER_RESISTIVITY) / conductorMm2 : 0;
  const dropVolts = currentAmps * resistanceOhms;
  const dropPercent = supplyVolts > 0 ? (dropVolts / supplyVolts) * 100 : 0;
  const loadVolts = Math.max(0, supplyVolts - dropVolts);
  const withinLimit = conductorMm2 > 0 && dropPercent <= maxDropPercent;
  const allowedDropVolts = (supplyVolts * maxDropPercent) / 100;
  const minConductorMm2 = allowedDropVolts > 0 ? (2 * lengthMetres * currentAmps * COPPER_RESISTIVITY) / allowedDropVolts : 0;
  const suggested = CABLE_SIZES_MM2.find((c) => c.mm2 >= minConductorMm2);

  return {
    resistanceOhms,
    dropVolts,
    dropPercent,
    loadVolts,
    withinLimit,
    minConductorMm2,
    suggestedMm2: suggested ? suggested.mm2 : null,
  };
}

// ---------------------------------------------------------------------------
// CCTV lens coverage and pixel density (DORI levels per IEC 62676-4)
// ---------------------------------------------------------------------------
export const DORI_LEVELS = [
  { id: 'identify', label: 'Identify', ppm: 250 },
  { id: 'recognise', label: 'Recognise', ppm: 125 },
  { id: 'observe', label: 'Observe', ppm: 62.5 },
  { id: 'detect', label: 'Detect', ppm: 25 },
];

export function lensCoverage({ horizontalPixels, horizontalFovDegrees, distanceMetres }) {
  const px = num(horizontalPixels);
  const fov = Math.min(num(horizontalFovDegrees), 179);
  const d = num(distanceMetres);
  const halfTan = Math.tan((fov * Math.PI) / 360);
  const sceneWidthMetres = 2 * d * halfTan;
  const pixelsPerMetre = sceneWidthMetres > 0 ? px / sceneWidthMetres : 0;
  const achieved = DORI_LEVELS.find((l) => pixelsPerMetre >= l.ppm);
  const maxDistances = DORI_LEVELS.map((l) => ({ ...l, metres: halfTan > 0 ? px / (l.ppm * 2 * halfTan) : 0 }));
  return { sceneWidthMetres, pixelsPerMetre, level: achieved ? achieved.label : null, maxDistances };
}

// ---------------------------------------------------------------------------
// CCTV network bandwidth
// ---------------------------------------------------------------------------
export function cctvBandwidth({ cameras, bitrateMbps, remoteStreams, remoteBitrateMbps, overheadPercent = 10 }) {
  const factor = 1 + num(overheadPercent) / 100;
  const recordingMbps = num(cameras) * num(bitrateMbps) * factor;
  const remoteMbps = num(remoteStreams) * num(remoteBitrateMbps) * factor;
  const totalMbps = recordingMbps + remoteMbps;
  return { recordingMbps, remoteMbps, totalMbps, gigabitPercent: (totalMbps / 1000) * 100 };
}

// ---------------------------------------------------------------------------
// NVR drives and RAID
// ---------------------------------------------------------------------------
export const DRIVE_SIZES_TB = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24];

export const RAID_LEVELS = [
  { id: 'none', label: 'No RAID (individual drives)', minDrives: 1 },
  { id: 'raid1', label: 'RAID 1 (mirrored pairs)', minDrives: 2 },
  { id: 'raid5', label: 'RAID 5 (one drive of parity)', minDrives: 3 },
  { id: 'raid6', label: 'RAID 6 (two drives of parity)', minDrives: 4 },
  { id: 'raid10', label: 'RAID 10 (striped mirrors)', minDrives: 4 },
];

function raidUsableDrives(raid, n) {
  if (raid === 'raid1' || raid === 'raid10') return n / 2;
  if (raid === 'raid5') return n - 1;
  if (raid === 'raid6') return n - 2;
  return n;
}

export function raidPlanner({ requiredTB, driveTB, raid = 'raid5', hotSpares = 0 }) {
  const need = num(requiredTB);
  const size = num(driveTB);
  const level = RAID_LEVELS.find((l) => l.id === raid) || RAID_LEVELS[0];
  const spares = Math.floor(num(hotSpares));
  if (size <= 0) return { arrayDrives: 0, totalDrives: 0, usableTB: 0, rawTB: 0 };
  const dataDrives = Math.ceil(need / size);
  let arrayDrives;
  if (level.id === 'raid1' || level.id === 'raid10') arrayDrives = 2 * dataDrives;
  else if (level.id === 'raid5') arrayDrives = dataDrives + 1;
  else if (level.id === 'raid6') arrayDrives = dataDrives + 2;
  else arrayDrives = dataDrives;
  arrayDrives = Math.max(level.minDrives, arrayDrives);
  const totalDrives = arrayDrives + spares;
  return {
    arrayDrives,
    totalDrives,
    usableTB: raidUsableDrives(level.id, arrayDrives) * size,
    rawTB: totalDrives * size,
  };
}

// ---------------------------------------------------------------------------
// Access control power supply
// ---------------------------------------------------------------------------
export const PSU_SIZES_A = [1, 1.5, 2, 3, 4, 5, 6, 8, 10];

export function psuLoad({ devices = [], headroomPercent = 20 }) {
  const totalAmps = devices.reduce((sum, d) => sum + num(d.quantity) * num(d.amps), 0);
  const requiredAmps = totalAmps * (1 + num(headroomPercent) / 100);
  const suggested = PSU_SIZES_A.find((a) => a >= requiredAmps);
  return { totalAmps, requiredAmps, suggestedAmps: suggested === undefined ? null : suggested };
}

// ---------------------------------------------------------------------------
// UPS runtime and sizing
// ---------------------------------------------------------------------------
export const UPS_SIZES_VA = [600, 1000, 1500, 2000, 3000, 5000, 6000, 10000];

export function upsRuntime({ loadWatts, batteryVolts, batteryAh, batteryCount, efficiencyPercent = 90, powerFactor = 0.9, headroomPercent = 25 }) {
  const load = num(loadWatts);
  const batteryWh = num(batteryVolts) * num(batteryAh) * num(batteryCount);
  const usableWh = batteryWh * (num(efficiencyPercent) / 100);
  const runtimeMinutes = load > 0 ? (usableWh / load) * 60 : 0;
  const pf = num(powerFactor);
  const requiredVA = pf > 0 ? (load / pf) * (1 + num(headroomPercent) / 100) : 0;
  const suggested = UPS_SIZES_VA.find((va) => va >= requiredVA);
  return { batteryWh, runtimeMinutes, requiredVA, suggestedVA: suggested === undefined ? null : suggested };
}

// ---------------------------------------------------------------------------
// 100 V / 70 V line speaker load
// ---------------------------------------------------------------------------
export function speakerLoad({ speakers = [], lineVolts = 100, amplifierWatts, headroomPercent = 20 }) {
  const totalWatts = speakers.reduce((sum, s) => sum + num(s.quantity) * num(s.watts), 0);
  const minAmplifierWatts = totalWatts * (1 + num(headroomPercent) / 100);
  const amp = num(amplifierWatts);
  const volts = num(lineVolts);
  return {
    totalWatts,
    minAmplifierWatts,
    utilisationPercent: amp > 0 ? (totalWatts / amp) * 100 : 0,
    amplifierOk: amp > 0 && amp >= minAmplifierWatts,
    lineImpedanceOhms: totalWatts > 0 ? (volts * volts) / totalWatts : 0,
  };
}

// ---------------------------------------------------------------------------
// Projector throw and image size
// ---------------------------------------------------------------------------
export const ASPECT_RATIOS = [
  { id: '16:9', w: 16, h: 9 },
  { id: '16:10', w: 16, h: 10 },
  { id: '4:3', w: 4, h: 3 },
];

export function projectorThrow({ throwRatio, distanceMetres, aspect = '16:9', targetWidthMetres = 0 }) {
  const ratio = num(throwRatio);
  const d = num(distanceMetres);
  const a = ASPECT_RATIOS.find((x) => x.id === aspect) || ASPECT_RATIOS[0];
  const widthMetres = ratio > 0 ? d / ratio : 0;
  const heightMetres = (widthMetres * a.h) / a.w;
  return {
    widthMetres,
    heightMetres,
    diagonalInches: Math.hypot(widthMetres, heightMetres) / 0.0254,
    distanceForTargetMetres: num(targetWidthMetres) * ratio,
  };
}

// ---------------------------------------------------------------------------
// IPv4 subnet
// ---------------------------------------------------------------------------
const toDotted = (n) => [n >>> 24, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join('.');

export function prefixToMask(prefix) {
  const p = Math.floor(num(prefix));
  return toDotted(p === 0 ? 0 : (0xffffffff << (32 - p)) >>> 0);
}

export function ipSubnet({ address, prefix }) {
  const parts = String(address || '').trim().split('.');
  const p = Math.floor(num(prefix));
  if (parts.length !== 4 || parts.some((x) => !/^\d{1,3}$/.test(x) || Number(x) > 255) || p < 8 || p > 30) {
    return { valid: false };
  }
  const ip = parts.reduce((acc, x) => acc * 256 + Number(x), 0);
  const mask = (0xffffffff << (32 - p)) >>> 0;
  const network = (ip & mask) >>> 0;
  const broadcast = (network | (~mask >>> 0)) >>> 0;
  return {
    valid: true,
    mask: toDotted(mask),
    network: toDotted(network),
    broadcast: toDotted(broadcast),
    firstHost: toDotted(network + 1),
    lastHost: toDotted(broadcast - 1),
    usableHosts: 2 ** (32 - p) - 2,
  };
}
