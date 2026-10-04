// Copper and fibre cabling maths for the free tools (fields in
// lib/cablingToolConfigs.js).
import { num } from './calculators.js';

// TIA-568 maximum attenuation, as quoted in the Fiber Optic Association's
// loss budget guide.
export const FIBRE_TYPES = [
  { id: 'sm-osp', label: 'Singlemode (OS2), outside plant, 1310/1550 nm', dbPerKm: 0.5 },
  { id: 'sm-premises', label: 'Singlemode, inside a building, 1310/1550 nm', dbPerKm: 1 },
  { id: 'mm-850', label: 'Multimode (OM3/OM4), 850 nm', dbPerKm: 3.5 },
  { id: 'mm-1300', label: 'Multimode (OM3/OM4), 1300 nm', dbPerKm: 1.5 },
];

export function fibreLossBudget({
  fibre = 'sm-osp',
  lengthKm,
  connections,
  connectionLossDb = 0.75,
  splices,
  spliceLossDb = 0.3,
  opticBudgetDb,
  safetyMarginDb = 3,
}) {
  const type = FIBRE_TYPES.find((f) => f.id === fibre) || FIBRE_TYPES[0];
  const fibreLossDb = num(lengthKm) * type.dbPerKm;
  const connectionsLossDb = Math.floor(num(connections)) * num(connectionLossDb);
  const splicesLossDb = Math.floor(num(splices)) * num(spliceLossDb);
  const totalLossDb = fibreLossDb + connectionsLossDb + splicesLossDb;
  const budget = num(opticBudgetDb);
  return {
    fibreLossDb,
    connectionsLossDb,
    splicesLossDb,
    totalLossDb,
    hasBudget: budget > 0,
    marginDb: budget - totalLossDb - num(safetyMarginDb),
  };
}

// TIA-568: a 90 m permanent link plus up to 10 m of patch and equipment cords.
export const PERMANENT_LINK_MAX_METRES = 90;

export function cableQuantity({ runs, averageMetres, longestMetres, slackMetres, wastePercent = 10, boxMetres = 305 }) {
  const perRun = num(averageMetres) + num(slackMetres);
  const raw = Math.floor(num(runs)) * perRun * (1 + num(wastePercent) / 100);
  const totalMetres = Math.round(raw * 100) / 100;
  const box = num(boxMetres) || 305;
  const boxes = Math.ceil(totalMetres / box);
  const longestWithSlack = num(longestMetres) + num(slackMetres);
  return {
    totalMetres,
    boxes,
    spareMetres: boxes * box - totalMetres,
    longestWithSlack,
    overPermanentLink: longestWithSlack > PERMANENT_LINK_MAX_METRES,
  };
}