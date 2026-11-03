// Inspection and test plans for a site plan (Robert, 2026-11-03): one per system,
// worked out from the devices and cables on the plan, for signing off a site at
// handover. Every device gets its own checks (a camera's focus, field of view,
// level and night picture; a door's lock, exit and fire release), every cable gets
// its install, label and test checks, and every system ends with its commissioning
// and handover checks. Pure, with relative imports, like cables.js.
//
// The checks are data (ITP_TEMPLATES below), so a company's own ITP can replace or
// add to them without touching the code: a check is
//   { check, criteria, point, reading }
// where point is H (hold: work stops until it is signed), W (witness: the client or
// supervisor is invited to watch), I (inspect) or T (test, with a result recorded),
// and reading, when set, is what to write in the Reading column (for example 'dB').
import { SYSTEMS, cableSchedules, cableType } from './cables.js';
import { coverageText, deviceType } from './model.js';

export const ITP_POINTS = [
  { id: 'H', label: 'Hold point', text: 'Work stops until this is checked and signed.' },
  { id: 'W', label: 'Witness point', text: 'The client or supervisor is invited to watch.' },
  { id: 'I', label: 'Inspection', text: 'Looked at and confirmed.' },
  { id: 'T', label: 'Test', text: 'Tested, with the result recorded.' },
];

export const ITP_RESULTS = ['Pass', 'Fail', 'N/A'];

const c = (check, criteria, point = 'I', reading = '') => ({ check, criteria, point, reading });

// Checks for every camera; {coverage} is replaced with what the plan says it covers.
const CAMERA = [
  c('Mounted', 'Fixed to the mounting point on the plan, secure, weather-sealed, and out of easy reach or vandal rated', 'I'),
  c('Field of view', 'Looks at the area shown on the plan: {coverage}', 'W'),
  c('Line and level', 'Picture is level with the horizon; no sky, eaves or walls taking up the frame unless designed', 'I'),
  c('Focus (day)', 'Sharp across the area of interest in daylight or full lighting', 'T'),
  c('Night picture', 'Infrared or low-light picture clear at night; no IR glare off walls, eaves or the housing', 'T'),
  c('Target size', 'A person at the far edge of the area is big enough to identify or recognise as designed', 'W'),
  c('Recording', 'Recording on the recorder at the designed resolution, frame rate and schedule or motion settings', 'T', 'fps'),
  c('Name and time', 'Camera name on screen matches the equipment schedule; date and time correct', 'I'),
  c('Snapshot', 'Day and night snapshots saved for the handover pack', 'I'),
];

const DETECTOR = [
  c('Mounted', 'Fixed at the designed height and angle, away from heat sources, air conditioners and moving objects', 'I'),
  c('Coverage', 'Covers the area shown on the plan: {coverage}', 'I'),
  c('Walk test', 'Detects a walk test across the whole area, triggering the right zone at the panel', 'W'),
  c('Tamper', 'Opening the cover raises a tamper at the panel', 'T'),
  c('End-of-line resistors', 'Fitted at the device as the panel requires; zone reads sealed', 'T', 'Ω'),
  c('Zone name', 'Zone number and name at the panel match the equipment schedule', 'I'),
];

export const ITP_TEMPLATES = {
  // ---- checks per device type (a type not listed uses its group's 'device' checks) ----
  types: {
    camera: CAMERA,
    dome: CAMERA,
    bullet: CAMERA,
    fisheye: [...CAMERA.filter((x) => x.check !== 'Line and level'), c('Dewarp', 'Dewarped views set up on the recorder and the client app', 'T')],
    ptz: [...CAMERA, c('Presets and tours', 'Presets, home position and tours set and named as agreed with the client', 'W'), c('Control', 'Pan, tilt and zoom work from the recorder and the client app', 'T')],
    lpr: [
      ...CAMERA.filter((x) => x.check !== 'Target size'),
      c('Plate capture', 'Reads plates at the designed speed, day and night, in the lane shown on the plan', 'W', '% read'),
      c('Plate list', 'Allow and alert lists loaded and tested with a known plate', 'T'),
    ],
    nvr: [
      c('Installed', 'In the rack or cabinet on the plan, ventilated, on the UPS, labelled', 'I'),
      c('Storage', 'Drives healthy; retention meets the designed number of days at the recording settings', 'T', 'days'),
      c('Time', 'Time zone set and synced to a time server', 'I'),
      c('Users and passwords', 'Default passwords changed; client and installer accounts set up; passwords handed over securely', 'H'),
      c('Firmware', 'Recorder and cameras on current firmware', 'I'),
      c('Remote viewing', 'Client app connects from outside the site', 'W'),
      c('Export', 'A clip exports to USB or the client app and plays back', 'T'),
    ],

    motion: DETECTOR,
    dualtech: DETECTOR,
    ceilingpir: DETECTOR,
    beam: [...DETECTOR, c('Alignment', 'Beams aligned; signal strength at the receiver within the maker’s range', 'T', '%')],
    glassbreak: [...DETECTOR.filter((x) => x.check !== 'Walk test'), c('Glass-break test', 'Triggers with a glass-break simulator from the far side of the protected glass', 'W')],
    contact: [
      c('Mounted', 'Magnet and contact aligned within the gap the maker allows; cable concealed', 'I'),
      c('Open and close', 'Opening the door or window triggers the right zone; closing seals it', 'T'),
      c('Zone name', 'Zone number and name at the panel match the equipment schedule', 'I'),
    ],
    vibration: [...DETECTOR.filter((x) => x.check !== 'Walk test' && x.check !== 'Coverage'), c('Sensitivity', 'Triggers on a test strike; does not trigger from normal traffic or machinery', 'T')],
    panic: [
      c('Mounted', 'At the agreed spot, reachable by staff and out of public view', 'I'),
      c('Activation', 'Triggers a silent or audible alarm as designed, and reaches the monitoring centre', 'W'),
      c('Reset', 'Resets with the key or tool provided; staff shown how', 'I'),
    ],
    keypad: [
      c('Mounted', 'At the entry, at a usable height, within the entry delay time of the door', 'I'),
      c('Arm and disarm', 'Arms and disarms with each user code; entry and exit delays as designed', 'T', 's'),
      c('Tamper', 'Removing the keypad raises a tamper', 'T'),
    ],
    alarmpanel: [
      c('Installed', 'In the agreed spot, secured, earthed, labelled; mains on its own labelled circuit', 'I'),
      c('Battery', 'Battery charged; standby time meets the design with a load test', 'T', 'h'),
      c('Monitoring', 'Alarm, tamper, low battery and mains fail signals received by the monitoring centre', 'H'),
      c('Codes', 'Installer and master codes changed from default; user codes loaded', 'H'),
      c('Zone list', 'Zone list printed or saved and matches the equipment schedule', 'I'),
    ],
    siren: [
      c('Mounted', 'Out of reach, visible from the street where designed, tamper switch fitted', 'I'),
      c('Sound and strobe', 'Sounds and flashes on alarm; stops at the designed siren time', 'T', 'min'),
      c('Tamper', 'Removing the cover or cutting the cable raises a tamper', 'T'),
    ],

    door: [
      c('Valid card', 'A valid card or credential releases the door and it relocks when shut', 'W'),
      c('Invalid card', 'An invalid or expired card is refused and logged', 'T'),
      c('Exit', 'Request-to-exit releases the door; free egress without a card at all times', 'H'),
      c('Fire release', 'Fire trip releases or holds the door as the design and the fire engineer require', 'H'),
      c('Door forced and held open', 'Forced and held-open alarms raised and logged at the set times', 'T', 's'),
      c('Door contact', 'Door position shows correctly in the software', 'T'),
      c('Lock power', 'Lock voltage at the door within the maker’s range under load', 'T', 'V'),
    ],
    reader: [
      c('Mounted', 'At the designed height beside the door, level and sealed', 'I'),
      c('Reads', 'Reads every card type in use at a normal distance', 'T'),
      c('Tamper', 'Removing the reader raises a tamper', 'T'),
    ],
    biometric: [
      c('Mounted', 'At the designed height, out of direct sunlight', 'I'),
      c('Enrolment', 'Test users enrolled; match and refuse tested', 'T'),
      c('Privacy', 'Biometric data handling explained to the client', 'I'),
    ],
    exitbutton: [
      c('Mounted', 'At the designed height on the secure side, signed', 'I'),
      c('Release', 'Releases the door for the set time', 'T', 's'),
    ],
    lock: [
      c('Fitted', 'Aligned, door closes and latches without force; fail-safe or fail-secure as designed', 'H'),
      c('Diode or suppression', 'Back-EMF protection fitted', 'I'),
    ],
    gate: [
      c('Safety', 'Safety beams or edges stop and reverse the gate', 'H'),
      c('Release', 'Opens on a valid credential and on the exit loop or button; closes after the set time', 'W'),
    ],
    turnstile: [
      c('Throughput', 'One person per valid credential; anti-passback as designed', 'T'),
      c('Emergency', 'Free passage on fire trip or power failure as designed', 'H'),
    ],
    controller: [
      c('Installed', 'In a secure enclosure on the secure side, labelled, earthed', 'I'),
      c('Battery', 'Battery charged; standby time meets the design', 'T', 'h'),
      c('Network', 'Online to the access software; events reach the server', 'T'),
      c('Software', 'Doors, schedules and access levels set as agreed; default passwords changed', 'H'),
    ],

    intercom: [
      c('Mounted', 'At the designed height, sealed, camera aimed at a visitor’s face', 'I'),
      c('Call', 'Calls each indoor monitor, app or guard station it should', 'W'),
      c('Audio and video', 'Clear two-way audio and video, day and night', 'T'),
      c('Door release', 'Releases the right door or gate from each answering point', 'T'),
    ],
    monitor: [
      c('Mounted', 'At the designed height, level', 'I'),
      c('Answer and release', 'Answers the door station and releases the door', 'T'),
    ],
    guardstation: [c('Answer and release', 'Answers every door station it should; releases the right doors', 'W')],

    wifi: [
      c('Mounted', 'At the designed spot, level, labelled', 'I'),
      c('Signal', 'Signal at the edge of the area on the plan at or above the design level', 'T', 'dBm'),
      c('Networks', 'Staff and guest networks set up and separated as designed', 'T'),
    ],
    datapoint: [
      c('Faceplate', 'Faceplate fitted and labelled to match the patch panel', 'I'),
      c('Patching', 'Patched to the right switch port and VLAN as designed', 'T'),
    ],
    switch: [
      c('Installed', 'In the rack, labelled, on the UPS', 'I'),
      c('Configuration', 'VLANs, PoE budget and management password set; configuration backed up', 'H'),
    ],
    router: [
      c('Installed', 'In the rack, labelled, on the UPS', 'I'),
      c('Configuration', 'Firewall rules, remote access and admin password set; configuration backed up', 'H'),
    ],
    rack: [
      c('Installed', 'Fixed, earthed, ventilated, doors lock', 'I'),
      c('Patching', 'Patch leads dressed and labelled; patch panel labels match the cable schedule', 'I'),
    ],
    bridge: [
      c('Aligned', 'Aligned with a clear line of sight', 'I'),
      c('Link', 'Signal and throughput at or above the design', 'T', 'Mbps'),
    ],
    ups: [c('Run time', 'Runs the connected gear for the designed time on battery', 'T', 'min')],

    speaker: [
      c('Mounted', 'At the spot on the plan, secure, grille fitted', 'I'),
      c('Tap and zone', 'Tap setting and zone as designed', 'I', 'W'),
      c('Sound', 'Clear and even across the area at the designed level; no distortion or rattle', 'W', 'dB'),
    ],
    wallspeaker: [
      c('Mounted', 'At the designed height and angle, secure', 'I'),
      c('Tap and zone', 'Tap setting and zone as designed', 'I', 'W'),
      c('Sound', 'Clear across the area at the designed level; no distortion', 'W', 'dB'),
    ],
    amplifier: [
      c('Installed', 'In the rack, ventilated, labelled', 'I'),
      c('Line test', 'Speaker line impedance within the amplifier’s rating for each zone', 'T', 'Ω'),
      c('Levels', 'Zone levels and sources set as agreed', 'W'),
    ],
    microphone: [c('Paging', 'Pages each zone clearly; chime works', 'W')],
    display: [
      c('Mounted', 'On the designed bracket, level, secure, cables concealed', 'I'),
      c('Inputs', 'Each source shows on screen; sound works', 'T'),
    ],
    projector: [
      c('Mounted', 'Secure, at the designed throw distance', 'I'),
      c('Picture', 'Focus, keystone and size set to the screen', 'T'),
    ],
  },

  // ---- per group: checks for a device with no type entry, and the system checks at the end ----
  groups: {
    CCTV: {
      system: [
        c('Viewing', 'Client can view live and recorded video on each screen and app agreed', 'W'),
        c('Retention', 'Recorder keeps the designed number of days; overwrite set', 'T', 'days'),
        c('Signage', 'CCTV signs in place as required', 'I'),
      ],
    },
    'Alarm and intrusion': {
      system: [
        c('Full system test', 'Every zone, tamper and siren tested end to end with the monitoring centre', 'H'),
        c('Users', 'Users trained to arm, disarm and respond to an alarm', 'W'),
      ],
    },
    'Access control': {
      system: [
        c('Fire interface', 'Fire panel trip releases all doors that must release, tested with the fire contractor', 'H'),
        c('Cards and users', 'Cards issued and access levels checked with the client', 'W'),
        c('Event log', 'Events and alarms show in the software and reports run', 'T'),
      ],
    },
    Intercom: { system: [c('All stations', 'Every door station calls and releases as designed', 'W')] },
    Fire: {
      device: [c('Installed', 'Installed to the fire designer’s layout and tested by the licensed fire contractor', 'H')],
      system: [c('Fire contractor', 'Commissioning and certification by the licensed fire contractor attached', 'H')],
    },
    'Network and IT': {
      system: [
        c('Cable test results', 'Test results for every data cable saved in the handover pack', 'H'),
        c('Network documented', 'IP addresses, VLANs and passwords documented and handed over securely', 'H'),
      ],
    },
    'Audio and display': {
      system: [
        c('Zones and sources', 'Every zone plays each agreed source at the set level', 'W'),
        c('Priority', 'Paging and emergency messages override music as designed', 'T'),
      ],
    },
  },

  // ---- per cable type: the install and test checks for every run ----
  cables: {
    default: [
      c('Route', 'Run on the route on the plan, supported on catenary or tray; not on ceiling tiles, lights or pipes', 'I'),
      c('Separation', 'Kept apart from mains power as the wiring rules require', 'I'),
      c('Labels', 'Labelled at both ends with the cable number', 'I'),
      c('Terminated', 'Terminated neatly with the right connectors; spare loop left at each end', 'I'),
    ],
    cat6: [c('Cable test', 'Passes a Cat6 permanent link test; length recorded', 'T', 'm')],
    cat6ext: [c('Outdoor', 'UV-rated cable or in conduit outside; entry points sealed', 'I'), c('Cable test', 'Passes a Cat6 permanent link test; length recorded', 'T', 'm')],
    sec4: [c('Continuity', 'Each core continuous; no shorts between cores', 'T')],
    sec6: [c('Continuity', 'Each core continuous; no shorts between cores', 'T')],
    sec6s: [c('Continuity and shield', 'Each core continuous; shield earthed at one end only', 'T')],
    power2: [c('Voltage drop', 'Voltage at the far end within the device’s range under load', 'T', 'V')],
    fire2: [c('Fire rating', 'Fire-rated cable and fixings throughout; tested by the fire contractor', 'H')],
    speaker2: [c('Continuity', 'Continuous; no short or earth fault on the line', 'T', 'Ω')],
  },

  // ---- the handover checks at the end of every system ----
  handover: [
    c('As-built drawings', 'Plan updated with every device and cable as installed', 'H'),
    c('Manuals and warranties', 'User guides, maker’s warranties and this signed plan in the handover pack', 'I'),
    c('Training', 'Client staff shown how to use the system', 'W'),
    c('Site clean', 'Offcuts and packaging removed; ceiling tiles and covers back in place', 'I'),
  ],
};

const fill = (text, device) => String(text).replace('{coverage}', (device && coverageText(device)) || 'as designed');

/** The checks for one device: its type's, else its group's, else none. */
export function deviceChecks(device, templates = ITP_TEMPLATES) {
  const kind = deviceType(device.type);
  const list = templates.types?.[device.type] || templates.groups?.[kind.group]?.device || [];
  return list.map((x) => ({ ...x, criteria: fill(x.criteria, device) }));
}

/** The checks for one cable run: the ones for every cable, then its type's. */
export function cableChecks(cableId, templates = ITP_TEMPLATES) {
  return [...(templates.cables?.default || []), ...(templates.cables?.[cableId] || [])];
}

/**
 * One inspection and test plan per system that has devices on the plan:
 * [{ system, label, prefix, sections: [{ title, ref, items: [{ no, check, criteria, point, reading }] }] }].
 * Each device is a section with its own checks then its cable's; the system and
 * handover checks are the last two sections. Items are numbered section.item.
 */
export function inspectionPlans(plan, templates = ITP_TEMPLATES) {
  const devices = plan?.devices || [];
  const schedules = cableSchedules(plan);
  const out = [];
  for (const sched of systemsWithDevices(devices, schedules)) {
    const sections = [];
    const add = (title, ref, checks) => {
      if (!checks.length) return;
      const n = sections.length + 1;
      sections.push({ title, ref, items: checks.map((x, i) => ({ no: `${n}.${i + 1}`, ...x })) });
    };
    for (const device of devices) {
      if (deviceType(device.type).group !== sched.system) continue;
      const run = sched.rows.find((r) => r.deviceId === device.id);
      const checks = deviceChecks(device, templates);
      const cable = run ? cableChecks(run.cable, templates).map((x) => ({ ...x, check: `Cable ${run.id}: ${x.check}` })) : [];
      const where = run ? `${run.id} · ${cableType(run.cable)?.label || ''}${run.to ? ` to ${run.to}` : ''}` : '';
      add(`${device.name}: ${deviceType(device.type).label}`, where, [...checks, ...cable]);
    }
    add(`${sched.label} system`, '', templates.groups?.[sched.system]?.system || []);
    add('Handover', '', templates.handover || []);
    out.push({ system: sched.system, label: sched.label, prefix: sched.prefix, sections });
  }
  return out;
}

// Every system with a device on the plan, cabled or not, with its cable rows.
function systemsWithDevices(devices, schedules) {
  const groups = new Set(devices.map((d) => deviceType(d.type).group));
  return SYSTEMS.filter((s) => groups.has(s.group)).map((s) => schedules.find((x) => x.system === s.group) || { system: s.group, label: s.label, prefix: s.prefix, rows: [] });
}
