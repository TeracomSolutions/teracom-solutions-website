// Off-grid and running-cost maths for the free tools (fields in
// lib/powerToolConfigs.js).
import { num } from './calculators.js';

export const BATTERY_TYPES = [
  { id: 'lithium', label: 'Lithium (LiFePO4), 80% usable', usable: 0.8 },
  { id: 'agm', label: 'AGM or gel, 50% usable', usable: 0.5 },
];

export function solarCamera({ loadWatts, hoursPerDay = 24, systemVolts = 12, autonomyDays, batteryType = 'lithium', sunHours, lossesPercent = 25 }) {
  const dailyWh = num(loadWatts) * Math.min(num(hoursPerDay), 24);
  const usable = (BATTERY_TYPES.find((b) => b.id === batteryType) || BATTERY_TYPES[0]).usable;
  const volts = num(systemVolts);
  const batteryWh = (dailyWh * num(autonomyDays)) / usable;
  const derate = 1 - Math.min(num(lossesPercent), 90) / 100;
  const panelWatts = num(sunHours) > 0 ? dailyWh / (num(sunHours) * derate) : 0;
  return {
    dailyWh,
    batteryWh,
    batteryAh: volts > 0 ? batteryWh / volts : 0,
    panelWatts,
    // The panel's current at the system voltage, plus 25%.
    controllerAmps: volts > 0 ? (panelWatts / volts) * 1.25 : 0,
  };
}

export function runningCost({ devices = [], centsPerKwh }) {
  let watts = 0;
  let kwhPerDay = 0;
  for (const device of devices) {
    const lineWatts = num(device.watts) * num(device.quantity);
    watts += lineWatts;
    kwhPerDay += (lineWatts * Math.min(num(device.hoursPerDay), 24)) / 1000;
  }
  const kwhPerYear = kwhPerDay * 365;
  const dollarsPerYear = (kwhPerYear * num(centsPerKwh)) / 100;
  return {
    watts,
    kwhPerDay,
    kwhPerYear,
    dollarsPerYear,
    dollarsPerQuarter: dollarsPerYear / 4,
  };
}