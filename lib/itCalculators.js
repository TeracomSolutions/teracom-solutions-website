// PC, server and rack maths for the free tools (fields in
// lib/itToolConfigs.js). Robert, 2026-10-05: "calculate PC or server
// configuration".
import { num } from './calculators.js';

// Common ATX and server power supply ratings, in watts.
export const PSU_SIZES = [450, 550, 650, 750, 850, 1000, 1200, 1300, 1600, 2000];
// Rack heights sold in Australia, in rack units.
export const RACK_SIZES = [6, 9, 12, 18, 22, 27, 37, 42, 45, 48];
// Total memory a server is commonly fitted with, in GB.
export const RAM_SIZES = [8, 16, 32, 64, 96, 128, 192, 256, 384, 512, 768, 1024, 1536, 2048];
export const RAID_CHOICES = [
  { id: 'none', label: 'No RAID', parity: 0, min: 1 },
  { id: 'raid5', label: 'RAID 5 (one drive of parity)', parity: 1, min: 3 },
  { id: 'raid6', label: 'RAID 6 (two drives of parity)', parity: 2, min: 4 },
  { id: 'raid10', label: 'RAID 10 (mirrored pairs)', parity: 0, min: 4, mirror: true },
];

// Typical draw of the parts a PSU feeds, in watts.
const HDD_WATTS = 8;
const SSD_WATTS = 4;
const RAM_STICK_WATTS = 4;
const FAN_WATTS = 3;
// A watt is 3.412 BTU/h of heat; UPS sizing assumes a 0.9 power factor.
const BTU_PER_WATT = 3.412;
const UPS_POWER_FACTOR = 0.9;

function nextSize(sizes, value) {
  return sizes.find((size) => size >= value) || null;
}

export function pcPowerSupply({ cpuWatts, cpus = 1, gpuWatts = 0, gpus = 1, hdds = 0, ssds = 0, ramSticks = 2, fans = 3, boardWatts = 50, headroomPercent = 30 }) {
  const cpu = num(cpuWatts) * Math.max(num(cpus), 0);
  const gpu = num(gpuWatts) * Math.max(num(gpus), 0);
  const drives = num(hdds) * HDD_WATTS + num(ssds) * SSD_WATTS;
  const other = num(ramSticks) * RAM_STICK_WATTS + num(fans) * FAN_WATTS + num(boardWatts);
  const loadWatts = cpu + gpu + drives + other;
  const neededWatts = loadWatts * (1 + num(headroomPercent) / 100);
  const psuWatts = nextSize(PSU_SIZES, neededWatts);
  return {
    loadWatts,
    neededWatts,
    psuWatts,
    // At about 90% efficiency the wall supplies a little more than the parts use.
    wallWatts: loadWatts / 0.9,
    upsVa: (loadWatts / 0.9 / UPS_POWER_FACTOR) * 1.25,
  };
}

export function recordingServer({ cameras, bitrateMbps, hoursPerDay = 24, days, driveTb, raid = 'raid5' }) {
  const totalMbps = num(cameras) * num(bitrateMbps);
  const hours = Math.min(Math.max(num(hoursPerDay), 0), 24);
  // Mbps x seconds / 8 gives MB; /1e6 gives TB. 10% for the file system and indexes.
  const storageTb = ((totalMbps * 3600 * hours * num(days)) / 8 / 1e6) * 1.1;
  const choice = RAID_CHOICES.find((r) => r.id === raid) || RAID_CHOICES[1];
  const size = num(driveTb);
  let drives = 0;
  if (size > 0 && storageTb > 0) {
    const dataDrives = Math.ceil(storageTb / size);
    drives = Math.max(choice.min, choice.mirror ? dataDrives * 2 : dataDrives + choice.parity);
  }
  return {
    totalMbps,
    writeMBps: totalMbps / 8,
    storageTb,
    drives,
    raidLabel: choice.label,
    // 1 GbE is comfortable to about 600 Mbps of recording plus viewing.
    network: totalMbps <= 600 ? '1 GbE' : totalMbps <= 6000 ? '10 GbE' : '25 GbE or more',
    // A rule of thumb for a recording server: 8 GB, plus 1 GB for every 16 cameras.
    ramGb: nextSize(RAM_SIZES, 8 + Math.ceil(num(cameras) / 16)),
  };
}

export function virtualServer({ vms, vcpusPerVm, ramPerVmGb, storagePerVmGb, vcpuRatio = 4, hostRamGb = 8, headroomPercent = 20 }) {
  const count = Math.max(num(vms), 0);
  const ratio = Math.max(num(vcpuRatio), 1);
  const grow = 1 + num(headroomPercent) / 100;
  const vcpus = count * num(vcpusPerVm);
  const cores = Math.ceil((vcpus * grow) / ratio);
  const ramGb = (count * num(ramPerVmGb) + num(hostRamGb)) * grow;
  const storageTb = (count * num(storagePerVmGb) * grow) / 1000;
  return {
    vcpus,
    cores,
    ramGb,
    ramFitted: nextSize(RAM_SIZES, ramGb),
    storageTb,
  };
}

export function rackSizeHeat({ equipmentU, equipmentWatts, sparePercent = 25, volts = 230 }) {
  const neededU = Math.ceil(num(equipmentU) * (1 + num(sparePercent) / 100));
  const watts = num(equipmentWatts);
  const v = num(volts) || 230;
  return {
    neededU,
    rackU: nextSize(RACK_SIZES, neededU),
    kw: watts / 1000,
    amps: watts / v,
    btuPerHour: watts * BTU_PER_WATT,
    upsVa: (watts / UPS_POWER_FACTOR) * 1.25,
  };
}