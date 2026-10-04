// Wireless link and transfer-time maths for the free tools (fields in
// lib/networkToolConfigs.js).
import { num } from './calculators.js';

// Radio planning uses an effective earth radius of 4/3 the real one.
export const EARTH_RADIUS_KM = 6371;
export const K_FACTOR = 4 / 3;

export const LINK_FREQUENCIES_GHZ = ['2.4', '5.8', '24', '60'];

export function wirelessLink({ distanceKm, frequencyGHz, clearancePercent = 60, txPowerDbm, antennaGainDbi }) {
  const d = num(distanceKm);
  const f = num(frequencyGHz);
  const ok = d > 0 && f > 0;
  // First Fresnel zone radius at the midpoint: 17.32 x sqrt(d / (4f)), in metres.
  const fresnelMetres = ok ? 17.32 * Math.sqrt(d / (4 * f)) : 0;
  const clearanceMetres = (fresnelMetres * num(clearancePercent)) / 100;
  // Earth bulge at the midpoint: d squared / (8kR), in km, x 1000 for metres.
  const earthBulgeMetres = (d * d * 1000) / (8 * K_FACTOR * EARTH_RADIUS_KM);
  const pathLossDb = ok ? 20 * Math.log10(d) + 20 * Math.log10(f) + 92.45 : 0;
  return {
    fresnelMetres,
    clearanceMetres,
    earthBulgeMetres,
    totalClearanceMetres: clearanceMetres + earthBulgeMetres,
    pathLossDb,
    receivedDbm: num(txPowerDbm) + 2 * num(antennaGainDbi) - pathLossDb,
  };
}

export const SIZE_UNITS = [
  { id: 'GB', bytes: 1e9 },
  { id: 'TB', bytes: 1e12 },
];

export const SPEED_UNITS = [
  { id: 'Mbps', bitsPerSecond: 1e6 },
  { id: 'Gbps', bitsPerSecond: 1e9 },
];

export function transferTime({ size, sizeUnit = 'TB', speed, speedUnit = 'Gbps', efficiencyPercent = 90 }) {
  const bytes = num(size) * (SIZE_UNITS.find((u) => u.id === sizeUnit) || SIZE_UNITS[1]).bytes;
  const unit = SPEED_UNITS.find((u) => u.id === speedUnit) || SPEED_UNITS[1];
  const bitsPerSecond = (num(speed) * unit.bitsPerSecond * Math.min(num(efficiencyPercent), 100)) / 100;
  return {
    seconds: bitsPerSecond > 0 ? (bytes * 8) / bitsPerSecond : 0,
    tbPerDay: (bitsPerSecond * 86400) / 8 / 1e12,
  };
}