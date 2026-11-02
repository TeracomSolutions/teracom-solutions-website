// Maths for the alarms & access, Wi-Fi, downtime and backup tools on /tools
// (Robert, 2026-11-02). Pure functions over the strings the visitor typed.

const num = (value) => {
  const n = Number.parseFloat(value);
  return Number.isFinite(n) && n > 0 ? n : 0;
};
const whole = (value) => Math.floor(num(value));

// Floor area one access point covers, by building; rules of thumb from the
// vendor planning guides. A site survey always beats them.
export const WIFI_BUILDINGS = [
  { value: 'open', label: 'Open plan, plasterboard walls', m2: 250 },
  { value: 'office', label: 'Offices and meeting rooms', m2: 150 },
  { value: 'dense', label: 'Brick, block or concrete walls', m2: 100 },
  { value: 'warehouse', label: 'Warehouse or factory floor', m2: 400 },
];

// Busy devices one access point serves well.
export const WIFI_USAGE = [
  { value: 'light', label: 'Light -- email, browsing, scanners', devices: 50 },
  { value: 'office', label: 'Office -- cloud apps and some video calls', devices: 40 },
  { value: 'heavy', label: 'Heavy -- video calls, streaming, crowds', devices: 25 },
];

export function wifiAccessPoints(v) {
  const area = num(v.areaM2);
  const devices = num(v.devices);
  const building = WIFI_BUILDINGS.find((b) => b.value === v.building) || WIFI_BUILDINGS[1];
  const usage = WIFI_USAGE.find((u) => u.value === v.usage) || WIFI_USAGE[1];
  const poeWatts = num(v.poeWatts);
  const byCoverage = area ? Math.ceil(area / building.m2) : 0;
  const byCapacity = devices ? Math.ceil(devices / usage.devices) : 0;
  const recommended = Math.max(byCoverage, byCapacity, area || devices ? 1 : 0);
  return {
    byCoverage,
    byCapacity,
    recommended,
    limitedBy: byCapacity > byCoverage ? 'capacity' : 'coverage',
    poeTotal: recommended * poeWatts,
    devicesPerAp: recommended ? devices / recommended : 0,
  };
}

export function accessControlPlanner(v) {
  const doors = whole(v.doors);
  const readersOut = v.exit === 'reader';
  const perController = Math.max(1, whole(v.doorsPerController));
  const users = whole(v.users);
  const spare = num(v.sparePercent) / 100;
  const lockAmps = num(v.lockAmps);
  const readerAmps = num(v.readerAmps);
  const controllerAmps = num(v.controllerAmps);

  const readers = doors * (readersOut ? 2 : 1);
  const exitButtons = readersOut ? 0 : doors;
  const controllers = doors ? Math.ceil(doors / perController) : 0;
  const credentials = Math.ceil(users * (1 + spare));
  const loadAmps = doors * lockAmps + readers * readerAmps + controllers * controllerAmps;
  return { doors, readers, exitButtons, controllers, credentials, loadAmps, locks: doors, doorContacts: doors };
}

export function falseAlarmCost(v) {
  const alarms = num(v.alarmsPerYear);
  const free = num(v.freeAlarms);
  const charge = num(v.chargePerAlarm);
  const staffHours = num(v.staffHours);
  const hourly = num(v.hourlyCost);
  const lost = num(v.lostPerAlarm);

  const charged = Math.max(0, alarms - free);
  const charges = charged * charge;
  const staff = alarms * staffHours * hourly;
  const lostTotal = alarms * lost;
  const year = charges + staff + lostTotal;
  return { charged, charges, staff, lost: lostTotal, year, perAlarm: alarms ? year / alarms : 0, threeYears: year * 3 };
}

export function downtimeCost(v) {
  const staff = num(v.staff);
  const hourly = num(v.hourlyCost);
  const productivity = Math.min(num(v.productivityLostPercent), 100) / 100;
  const revenue = num(v.revenuePerHour);
  const revenueLost = Math.min(num(v.revenueLostPercent), 100) / 100;
  const hours = num(v.hoursPerIncident);
  const incidents = num(v.incidentsPerYear);
  const recovery = num(v.recoveryCost);

  const staffPerHour = staff * hourly * productivity;
  const revenuePerHour = revenue * revenueLost;
  const perHour = staffPerHour + revenuePerHour;
  const perIncident = perHour * hours + recovery;
  return { staffPerHour, revenuePerHour, perHour, perIncident, year: perIncident * incidents, perMinute: perHour / 60 };
}

export function backupStorage(v) {
  const data = num(v.dataGb);
  const change = num(v.changePercent) / 100;
  const daily = whole(v.dailyKept);
  const weekly = whole(v.weeklyKept);
  const monthly = whole(v.monthlyKept);
  const ratio = num(v.reductionRatio) || 1;
  const copies = Math.max(1, whole(v.copies));
  const growth = num(v.growthPercent) / 100;

  const fulls = 1 + weekly + monthly;
  const fullGb = data / ratio;
  const incrementalGb = (data * change) / ratio;
  const perCopyGb = (fulls * fullGb + daily * incrementalGb) * (1 + growth);
  return {
    fulls,
    fullGb,
    incrementalGb,
    perCopyGb,
    totalGb: perCopyGb * copies,
    copies,
    meets321: copies >= 2,
  };
}
