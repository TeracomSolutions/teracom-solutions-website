// Server builder rules (Robert, 19 November 2026): what fits in the chosen HPE (later Dell) server, what is missing
// and the parts list. The options and rules come from the maker's QuickSpecs, kept on the backend
// (services/server_builder.py). The builder only guides: every quote is checked in the maker's own configurator.

const num = (v, d = 0) => (Number.isFinite(Number(v)) ? Number(v) : d);
const list = (v) => (Array.isArray(v) ? v : []);

export function findPart(items, part) {
  return list(items).find((i) => i && i.part === part) || null;
}

export function baseOf(model, baseId) {
  return list(model?.bases).find((b) => b.id === baseId) || list(model?.bases)[0] || null;
}

export function socketsFor(model, base) {
  const max = num(model?.cpu_rules?.max, 1) || 1;
  return Math.max(1, Math.min(max, num(base?.sockets, max) || max));
}

// Cages offered for this chassis (an empty base_ids list means any chassis).
export function cagesFor(model, base) {
  return list(model?.drive_cages).filter((c) => !list(c.base_ids).length || list(c.base_ids).includes(base?.id));
}

// Bays by drive form (SFF, LFF, EDSFF) from the chassis and the cages fitted.
export function baysFor(model, state) {
  const base = baseOf(model, state.baseId);
  const bays = {};
  const add = (form, count, interfaces) => {
    if (!form || !count) return;
    const slot = bays[form] || (bays[form] = { count: 0, interfaces: new Set() });
    slot.count += count;
    list(interfaces).forEach((i) => slot.interfaces.add(i));
  };
  if (base?.bays) add(base.bays.form, num(base.bays.count), base.bays.interfaces);
  for (const [part, qty] of Object.entries(state.cages || {})) {
    const cage = findPart(model?.drive_cages, part);
    if (cage?.adds && qty > 0) add(cage.adds.form, num(cage.adds.count) * qty, cage.adds.interfaces);
  }
  return bays;
}

// Drive forms this chassis can ever take (its own bays and the cages it can fit), so the drive list stays relevant.
export function driveFormsFor(model, base) {
  const forms = new Set();
  if (base?.bays?.form) forms.add(base.bays.form);
  cagesFor(model, base).forEach((c) => c.adds?.form && forms.add(c.adds.form));
  return forms;
}

const GEN = /(\d)(?:st|nd|rd|th)\s+Gen/i;

// The part number and model name of a chosen part (MR408i-o, NS204i-u, E208e-p), to match accessory triggers.
// Bay counts like 8SFF are left out: they appear in almost every cable kit's trigger.
const MODEL_NAME = /\b[A-Z]{1,3}\d{2,4}[a-z]{0,2}(?:-[a-z])?\b/g;
function markers(item) {
  const words = String(item?.label || '').match(MODEL_NAME) || [];
  return [item?.part, ...words.filter((w) => w.length >= 5)].filter(Boolean);
}

export function chosen(model, state) {
  const base = baseOf(model, state.baseId);
  const cpu = findPart(model?.cpus, state.cpuPart);
  const memory = findPart(model?.memory, state.memPart);
  const controller = state.controller ? list(model?.controllers).find((c) => (c.part || c.label) === state.controller) : null;
  const drives = list(state.drives).map((d) => ({ ...d, item: findPart(model?.drives, d.part) })).filter((d) => d.item && d.qty > 0);
  const nics = list(state.nics).map((n) => ({ ...n, item: findPart(model?.nics, n.part) })).filter((n) => n.item && n.qty > 0);
  const cages = Object.entries(state.cages || {}).filter(([, q]) => q > 0).map(([part, qty]) => ({ part, qty, item: findPart(model?.drive_cages, part) })).filter((c) => c.item);
  return {
    base, cpu, memory, controller, drives, nics, cages,
    boot: findPart(model?.boot, state.boot), psu: findPart(model?.psus, state.psuPart),
    management: findPart(model?.management, state.management), rails: findPart(model?.rails, state.rails),
    support: findPart(model?.support, state.support),
  };
}

// Accessories whose trigger names something chosen (or "always"): suggested, and ticked by default.
export function suggestedAccessories(model, state) {
  const c = chosen(model, state);
  const picked = [c.base, c.cpu, c.memory, c.controller, c.boot, c.psu, ...c.drives.map((d) => d.item),
    ...c.nics.map((n) => n.item), ...c.cages.map((g) => g.item)].filter(Boolean);
  const marks = picked.flatMap(markers);
  const twoCpus = num(state.cpuQty, 1) >= 2;
  return list(model?.accessories).filter((a) => {
    const when = String(a.needed_when || '');
    if (/^\s*always/i.test(when)) return true;
    if (twoCpus && /(2|two|second)\s*(cpus?|processors?)|2nd\s*(cpu|processor)/i.test(when)) return true;
    return marks.some((m) => when.includes(m));
  }).map((a) => a.part);
}

// Rough power draw, for sizing the power supplies (the maker's power tool gives the exact figure).
export function powerEstimate(model, state) {
  const c = chosen(model, state);
  const cpus = num(state.cpuQty, 1);
  const dimms = num(state.memPerCpu, 0) * cpus;
  let watts = 90 + (c.cpu ? num(c.cpu.watts, 150) * cpus : 0) + dimms * 5;
  for (const d of c.drives) watts += d.qty * (d.item.kind === 'HDD' ? (d.item.form === 'LFF' ? 10 : 8) : d.item.interface === 'NVMe' ? 14 : 7);
  watts += c.nics.reduce((s, n) => s + n.qty * 15, 0) + (c.controller?.part ? 20 : 0) + (c.boot ? 10 : 0);
  return Math.round(watts);
}

export function checks(model, state) {
  const errors = [];
  const warnings = [];
  const c = chosen(model, state);
  if (!c.base) return { errors: ['Choose a chassis.'], warnings };
  const cpuQty = num(state.cpuQty, 1);
  const sockets = socketsFor(model, c.base);
  if (!c.cpu) errors.push('Choose a processor.');
  if (cpuQty > sockets) errors.push(`This chassis takes ${sockets} processor${sockets > 1 ? 's' : ''}.`);
  if (cpuQty < num(model?.cpu_rules?.min, 1)) errors.push('Add a processor.');

  const rules = model?.memory_rules || {};
  const valid = list(rules.valid_counts_per_cpu);
  if (!c.memory) errors.push('Choose memory.');
  else if (valid.length && !valid.includes(num(state.memPerCpu))) errors.push(`Fit ${valid.join(', ')} memory modules per processor.`);
  const cpuGen = String(c.cpu?.label || '').match(GEN)?.[1];
  const memGen = String(c.memory?.label || '').match(GEN)?.[1];
  if (cpuGen && memGen && cpuGen !== memGen) errors.push(`This memory is for ${memGen}th Gen processors; the processor chosen is ${cpuGen}th Gen.`);

  const bays = baysFor(model, state);
  const byForm = {};
  for (const d of c.drives) {
    const f = d.item.form;
    byForm[f] = (byForm[f] || 0) + d.qty;
    const slot = bays[f];
    if (slot && slot.interfaces.size && !slot.interfaces.has(d.item.interface)) warnings.push(`The ${f} bays chosen are not listed for ${d.item.interface} drives (${d.item.part}). Add a cage that takes them.`);
  }
  for (const [form, count] of Object.entries(byForm)) {
    const have = bays[form]?.count || 0;
    if (count > have) errors.push(have ? `${count} ${form} drives chosen but only ${have} ${form} bays. Add a drive cage or choose fewer drives.` : `No ${form} bays yet: add a ${form} drive cage, or choose ${Object.keys(bays).join(' or ') || 'other'} drives.`);
  }
  const totalBays = Object.values(bays).reduce((s, b) => s + b.count, 0);
  if (num(c.base.max_bays) && totalBays > num(c.base.max_bays)) errors.push(`That is ${totalBays} bays; this chassis holds at most ${c.base.max_bays}.`);

  const driveCount = c.drives.reduce((s, d) => s + d.qty, 0);
  if (driveCount) {
    if (!c.controller) warnings.push('No storage controller chosen. Choose one for RAID (RAID 5 or 6 is usual for recording).');
    else {
      const ifaces = new Set(list(c.controller.interfaces));
      const odd = [...new Set(c.drives.map((d) => d.item.interface))].filter((i) => ifaces.size && !ifaces.has(i));
      if (odd.length) errors.push(`${c.controller.label} does not run ${odd.join(' or ')} drives.`);
      if (num(c.controller.max_drives) && driveCount > num(c.controller.max_drives)) errors.push(`${c.controller.label} runs up to ${c.controller.max_drives} drives; ${driveCount} are chosen.`);
    }
  }

  const ocpUsed = c.nics.filter((n) => n.item.slot === 'OCP').reduce((s, n) => s + n.qty, 0) + (c.controller?.slot === 'OCP' ? 1 : 0);
  const pcieUsed = c.nics.filter((n) => n.item.slot !== 'OCP').reduce((s, n) => s + n.qty, 0) + (c.controller?.slot === 'PCIe' ? 1 : 0);
  if (num(c.base.ocp_slots, -1) >= 0 && ocpUsed > num(c.base.ocp_slots)) errors.push(`${ocpUsed} OCP cards chosen but the chassis has ${c.base.ocp_slots} OCP slot${c.base.ocp_slots === 1 ? '' : 's'}.`);
  if (num(c.base.pcie_slots, -1) >= 0 && pcieUsed > num(c.base.pcie_slots)) warnings.push(`${pcieUsed} PCIe cards chosen; the chassis has ${c.base.pcie_slots} PCIe slots as standard, so a riser kit may be needed.`);

  const psuQty = num(state.psuQty, 1);
  const psuSlots = num(c.base.psu_slots, num(model?.psu_rules?.max, 2));
  if (!c.psu) errors.push('Choose a power supply.');
  else {
    if (psuQty > psuSlots) errors.push(`The chassis takes ${psuSlots} power supplies.`);
    const need = powerEstimate(model, state);
    if (need > num(c.psu.watts)) errors.push(`Estimated draw is about ${need} W, more than one ${c.psu.watts} W supply. Choose a bigger power supply.`);
    else if (need > num(c.psu.watts) * 0.8) warnings.push(`Estimated draw is about ${need} W, close to the ${c.psu.watts} W supply. A bigger supply gives headroom.`);
    if (psuQty < 2 && psuSlots >= 2) warnings.push('One power supply has no redundancy. Two are recommended for a recording server.');
  }
  if (/rack/i.test(model?.form || '') && list(model?.rails).length && !c.rails) warnings.push('No rail kit chosen for a rack server.');
  return { errors, warnings };
}

export function partsList(model, state) {
  const c = chosen(model, state);
  const rows = [];
  const add = (group, item, qty) => {
    if (!item?.part || !(qty > 0)) return;
    const same = rows.find((r) => r.part === item.part);
    if (same) same.qty += qty;
    else rows.push({ group, part: item.part, label: item.label || '', qty });
  };
  const cpuQty = num(state.cpuQty, 1);
  add('Chassis', c.base, 1);
  add('Processor', c.cpu, cpuQty);
  add('Memory', c.memory, num(state.memPerCpu) * cpuQty);
  c.cages.forEach((g) => add('Drive cage', g.item, g.qty));
  c.drives.forEach((d) => add('Drive', d.item, d.qty));
  add('Storage controller', c.controller, 1);
  add('Boot device', c.boot, 1);
  c.nics.forEach((n) => add('Network', n.item, n.qty));
  add('Power supply', c.psu, num(state.psuQty, 1));
  for (const part of Object.keys(state.extras || {}).filter((p) => state.extras[p])) add('Kit', findPart(model?.accessories, part), 1);
  add('Management licence', c.management, 1);
  add('Rail kit', c.rails, 1);
  add('Support', c.support, 1);
  return rows;
}

export function storageSummary(model, state) {
  const c = chosen(model, state);
  const raw = c.drives.reduce((s, d) => s + d.qty * num(d.item.tb), 0);
  return { raw: Math.round(raw * 10) / 10, drives: c.drives.reduce((s, d) => s + d.qty, 0) };
}

export function defaults(model) {
  const base = list(model?.bases)[0];
  const memory = list(model?.memory).find((m) => num(m.gb) >= 32) || list(model?.memory)[0];
  const valid = list(model?.memory_rules?.valid_counts_per_cpu);
  const psu = list(model?.psus).find((p) => num(p.watts) >= 800) || list(model?.psus).find((p) => num(p.watts) >= 500) || list(model?.psus)[0];
  const builtIn = list(model?.controllers).find((x) => !x.part);
  const state = {
    slug: model?.slug, baseId: base?.id || '', cpuPart: list(model?.cpus)[0]?.part || '',
    cpuQty: Math.max(1, num(model?.cpu_rules?.min, 1)), memPart: memory?.part || '',
    memPerCpu: valid.includes(2) ? 2 : valid[0] || 1, cages: {}, drives: [], controller: builtIn ? builtIn.label : '',
    boot: '', nics: [], psuPart: psu?.part || '', psuQty: Math.min(2, num(base?.psu_slots, num(model?.psu_rules?.max, 1)) || 1),
    management: '', rails: /rack/i.test(model?.form || '') ? list(model?.rails)[0]?.part || '' : '', support: '', extras: {},
  };
  for (const part of suggestedAccessories(model, state)) state.extras[part] = true;
  return state;
}

// Keeps only saved choices this model still offers (a reopened project after the options were reviewed).
export function restore(model, saved) {
  const start = defaults(model);
  if (!saved || saved.slug !== model?.slug) return start;
  const has = (items, part) => !part || !!findPart(items, part);
  return {
    ...start,
    baseId: baseOf(model, saved.baseId)?.id || start.baseId,
    cpuPart: has(model.cpus, saved.cpuPart) && saved.cpuPart ? saved.cpuPart : start.cpuPart,
    cpuQty: num(saved.cpuQty, start.cpuQty),
    memPart: has(model.memory, saved.memPart) && saved.memPart ? saved.memPart : start.memPart,
    memPerCpu: num(saved.memPerCpu, start.memPerCpu),
    cages: Object.fromEntries(Object.entries(saved.cages || {}).filter(([p]) => findPart(model.drive_cages, p)).map(([p, q]) => [p, num(q)])),
    drives: list(saved.drives).filter((d) => findPart(model.drives, d.part)).slice(0, 40).map((d) => ({ part: d.part, qty: num(d.qty, 1) })),
    controller: list(model.controllers).some((x) => (x.part || x.label) === saved.controller) ? saved.controller : start.controller,
    boot: has(model.boot, saved.boot) ? saved.boot || '' : '',
    nics: list(saved.nics).filter((n) => findPart(model.nics, n.part)).slice(0, 12).map((n) => ({ part: n.part, qty: num(n.qty, 1) })),
    psuPart: has(model.psus, saved.psuPart) && saved.psuPart ? saved.psuPart : start.psuPart,
    psuQty: num(saved.psuQty, start.psuQty),
    management: has(model.management, saved.management) ? saved.management || '' : '',
    rails: has(model.rails, saved.rails) ? saved.rails || '' : '',
    support: has(model.support, saved.support) ? saved.support || '' : '',
    extras: Object.fromEntries(Object.entries(saved.extras || {}).filter(([p, on]) => on && findPart(model.accessories, p))),
  };
}

export function partsText(model, rows) {
  const lines = [`${model.maker} ${model.model}: parts list from the Teracom server builder`, ''];
  rows.forEach((r) => lines.push(`${r.qty} x ${r.part}  ${r.label}`));
  lines.push('', `Options from ${model.maker} QuickSpecs ${model.quickspecs_version || ''}. To be checked in ${model.maker}'s configurator before ordering.`);
  return lines.join('\n');
}

export function partsCsv(rows) {
  const q = (v) => `"${String(v).replace(/"/g, '""')}"`;
  return ['Group,Part number,Description,Qty', ...rows.map((r) => [q(r.group), q(r.part), q(r.label), r.qty].join(','))].join('\n');
}
