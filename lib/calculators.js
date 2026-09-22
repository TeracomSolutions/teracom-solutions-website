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
