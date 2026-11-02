// Field/result definitions for the alarms & access, Wi-Fi, downtime and backup
// tools, rendered by components/tools/ConfigCalculator.js. The maths is in
// lib/siteCalculators.js.
import { fmt } from '@/lib/calcFormat';
import {
  WIFI_BUILDINGS,
  WIFI_USAGE,
  accessControlPlanner,
  backupStorage,
  downtimeCost,
  falseAlarmCost,
  wifiAccessPoints,
} from '@/lib/siteCalculators';

const money = (n) => `$${fmt(n, 0)}`;
const size = (gb) => (gb >= 1000 ? `${fmt(gb / 1000, 2)} TB` : `${fmt(gb, 0)} GB`);

export const siteToolConfigs = {
  'access-control-planner': {
    fields: [
      { id: 'doors', label: 'Doors to control', type: 'number', default: '8', step: '1' },
      {
        id: 'exit',
        label: 'Leaving through the door',
        type: 'select',
        default: 'button',
        options: [
          { value: 'button', label: 'Exit button (free to leave)' },
          { value: 'reader', label: 'Reader on both sides (badge out)' },
        ],
      },
      { id: 'doorsPerController', label: 'Doors per controller', type: 'number', default: '2', step: '1', hint: 'Usually 1, 2 or 4; check the controller datasheet.' },
      { id: 'users', label: 'People who need access', type: 'number', default: '60', step: '1' },
      { id: 'sparePercent', label: 'Spare cards or fobs (%)', type: 'number', default: '20', step: '5' },
      { id: 'lockAmps', label: 'Current per lock (A)', type: 'number', default: '0.5', step: '0.05', hint: 'Electric strikes are often 0.2-0.5 A; magnetic locks 0.25-0.5 A at 12 V.' },
      { id: 'readerAmps', label: 'Current per reader (A)', type: 'number', default: '0.12', step: '0.01' },
      { id: 'controllerAmps', label: 'Current per controller (A)', type: 'number', default: '0.3', step: '0.05' },
    ],
    compute: (v) => accessControlPlanner(v),
    results: (r) => [
      { label: 'Readers', value: fmt(r.readers, 0) },
      { label: 'Locks', value: fmt(r.locks, 0) },
      { label: 'Exit buttons', value: fmt(r.exitButtons, 0) },
      { label: 'Door position contacts', value: fmt(r.doorContacts, 0) },
      { label: 'Controllers', value: fmt(r.controllers, 0) },
      { label: 'Cards or fobs', value: fmt(r.credentials, 0) },
      { label: 'Total current', value: `${fmt(r.loadAmps, 2)} A` },
    ],
    note: 'Size the power supply with the Access Control Power Supply Calculator and the backup battery with the Battery Standby Calculator. Fire doors and exit paths have to meet the building code: locks must release on a fire alarm and in a power failure where required.',
  },

  'false-alarm-cost-calculator': {
    fields: [
      { id: 'alarmsPerYear', label: 'False alarms a year', type: 'number', default: '6', step: '1' },
      { id: 'chargePerAlarm', label: 'Charge per false alarm ($)', type: 'number', default: '90', step: '5', hint: 'Patrol attendance, a fire brigade call-out fee or a monitoring charge -- whatever your site is billed.' },
      { id: 'freeAlarms', label: 'False alarms a year before charges apply', type: 'number', default: '0', step: '1' },
      { id: 'staffHours', label: 'Staff hours lost per alarm', type: 'number', default: '1.5', step: '0.5', hint: 'The key holder driving in at 2am, plus the next morning.' },
      { id: 'hourlyCost', label: 'Cost of an hour of staff time ($)', type: 'number', default: '55', step: '1' },
      { id: 'lostPerAlarm', label: 'Other loss per alarm ($)', type: 'number', default: '0', step: '10', hint: 'Lost trade, an evacuation, overtime.' },
    ],
    compute: (v) => falseAlarmCost(v),
    results: (r) => [
      { label: 'Charges', value: `${money(r.charges)} (${fmt(r.charged, 0)} charged)` },
      { label: 'Staff time', value: money(r.staff) },
      { label: 'Other losses', value: money(r.lost) },
      { label: 'Cost per false alarm', value: money(r.perAlarm) },
      { label: 'Cost a year', value: money(r.year) },
      { label: 'Over three years', value: money(r.threeYears) },
    ],
    note: 'Most false alarms come from a few causes: a door not shut, a detector in the wrong place, a flat battery or a user code mistake. Finding the cause, and checking a camera before anyone is sent, usually costs less than one year of call-outs.',
  },

  'wifi-access-point-calculator': {
    fields: [
      { id: 'areaM2', label: 'Floor area to cover (m²)', type: 'number', default: '800', step: '10' },
      { id: 'building', label: 'Building', type: 'select', default: 'office', options: WIFI_BUILDINGS.map(({ value, label }) => ({ value, label })) },
      { id: 'devices', label: 'Devices on Wi-Fi at the same time', type: 'number', default: '120', step: '5', hint: 'Count phones and laptops: most people carry two.' },
      { id: 'usage', label: 'How it is used', type: 'select', default: 'office', options: WIFI_USAGE.map(({ value, label }) => ({ value, label })) },
      { id: 'poeWatts', label: 'Power per access point (W)', type: 'number', default: '25.5', step: '0.5', hint: 'Wi-Fi 6 and 7 access points usually need PoE+ (25.5 W) or more.' },
    ],
    compute: (v) => wifiAccessPoints(v),
    results: (r) => [
      { label: 'Access points for coverage', value: fmt(r.byCoverage, 0) },
      { label: 'Access points for the number of devices', value: fmt(r.byCapacity, 0) },
      { label: 'Access points to plan for', value: `${fmt(r.recommended, 0)} (set by ${r.limitedBy})` },
      { label: 'Devices per access point', value: fmt(r.devicesPerAp, 0) },
      { label: 'PoE power for the access points', value: `${fmt(r.poeTotal, 0)} W` },
    ],
    note: 'Rules of thumb from vendor planning guides. Walls, ceilings, racking and neighbouring networks change the answer, so confirm it with a site survey before buying. Check the switch with the PoE Power Budget Calculator.',
  },

  'downtime-cost-calculator': {
    fields: [
      { id: 'staff', label: 'Staff who cannot work properly', type: 'number', default: '15', step: '1' },
      { id: 'hourlyCost', label: 'Cost of an hour of staff time ($)', type: 'number', default: '55', step: '1', hint: 'Wage plus super, leave and overheads.' },
      { id: 'productivityLostPercent', label: 'Share of their work lost (%)', type: 'number', default: '75', step: '5' },
      { id: 'revenuePerHour', label: 'Revenue an hour while open ($)', type: 'number', default: '600', step: '50' },
      { id: 'revenueLostPercent', label: 'Share of revenue lost while down (%)', type: 'number', default: '40', step: '5', hint: 'Some customers wait and come back; some go elsewhere.' },
      { id: 'hoursPerIncident', label: 'Hours down per incident', type: 'number', default: '4', step: '0.5' },
      { id: 'incidentsPerYear', label: 'Incidents a year', type: 'number', default: '3', step: '1' },
      { id: 'recoveryCost', label: 'Repair and catch-up cost per incident ($)', type: 'number', default: '500', step: '50' },
    ],
    compute: (v) => downtimeCost(v),
    results: (r) => [
      { label: 'Lost staff time an hour', value: money(r.staffPerHour) },
      { label: 'Lost revenue an hour', value: money(r.revenuePerHour) },
      { label: 'Cost an hour', value: `${money(r.perHour)} (${money(r.perMinute)} a minute)` },
      { label: 'Cost per incident', value: money(r.perIncident) },
      { label: 'Cost a year', value: money(r.year) },
    ],
    note: 'Leaves out harder-to-count costs: missed deadlines, customers who do not come back, and data that cannot be recovered. Compare the yearly figure with the cost of a spare, a backup internet service, a UPS or monitoring.',
  },

  'backup-storage-calculator': {
    fields: [
      { id: 'dataGb', label: 'Data to back up (GB)', type: 'number', default: '2000', step: '100', hint: '1 TB is 1,000 GB.' },
      { id: 'changePercent', label: 'Data that changes each day (%)', type: 'number', default: '3', step: '0.5', hint: 'Usually 1-5% for office files and servers.' },
      { id: 'dailyKept', label: 'Daily backups kept', type: 'number', default: '14', step: '1' },
      { id: 'weeklyKept', label: 'Weekly backups kept', type: 'number', default: '8', step: '1' },
      { id: 'monthlyKept', label: 'Monthly backups kept', type: 'number', default: '12', step: '1' },
      { id: 'reductionRatio', label: 'Compression and deduplication (x : 1)', type: 'number', default: '1.5', step: '0.1', hint: 'Use 1 for photos and video, which do not compress.' },
      { id: 'copies', label: 'Backup copies (besides the original)', type: 'number', default: '2', step: '1', hint: 'The 3-2-1 rule: three copies in all, on two kinds of storage, one away from the site.' },
      { id: 'growthPercent', label: 'Room to grow (%)', type: 'number', default: '25', step: '5' },
    ],
    compute: (v) => backupStorage(v),
    results: (r) => [
      { label: 'One full backup', value: size(r.fullGb) },
      { label: 'One daily change', value: size(r.incrementalGb) },
      { label: 'Full backups kept', value: fmt(r.fulls, 0) },
      { label: 'Storage per backup copy', value: size(r.perCopyGb) },
      { label: `Storage for ${fmt(r.copies, 0)} ${r.copies === 1 ? 'copy' : 'copies'}`, value: size(r.totalGb) },
      ...(r.meets321 ? [] : [{ warn: 'One backup copy is not 3-2-1. Keep a second copy away from the site, ideally one that cannot be changed or deleted.' }]),
    ],
    note: 'Assumes every weekly and monthly backup is a full copy. Storage that shares blocks between backups (most modern backup software and NAS units) needs much less, so this is the safe upper figure.',
  },
};
