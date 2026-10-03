// The deeper Tecom Challenger brand page (Robert, 2026-10-01: build the
// brand pages out from each manufacturer's own site, with drawings of what
// the technology does rather than product photos).
// Written in our own words from aritech.com.au (October 2026); figures are
// Aritech’s own. Drawings are specs drawn by lib/brandArt.

const tecomChallenger = {
  heroArt: {
    type: 'hero',
    alt: 'A Tecom panel at the centre running alarms and doors, with a Discovery panel on one side and WMS Pro management software on the other',
    device: 'alarm',
    left: { title: 'Discovery', sub: 'Web programmed', foot: '65,000 users on board', icon: 'server' },
    right: { title: 'WMS Pro', sub: 'Management', foot: 'Site maps, automations', icon: 'laptop' },
    tags: [
      { text: 'Area armed', tone: 'accent', icon: 'alarm' },
      { text: 'Door opened', tone: 'ok', icon: 'door' },
      { text: 'Input alarm', tone: 'alert', icon: 'motion' },
    ],
    chips: [
      { text: 'Made in Australia', tone: 'accent' },
      { text: 'Alarm and access', tone: 'ok' },
    ],
  },

  stats: [
    { value: '65,000', label: 'users held on a Discovery panel with no expander needed' },
    { value: '32 doors', label: 'of standard access control run from a Discovery panel itself' },
    { value: 'Since 1989', label: 'when Tecom Systems first developed Challenger in Melbourne' },
    { value: 'Made in AU', label: 'Discovery is designed, developed and manufactured in Australia' },
  ],

  platformsEyebrow: 'Two generations',
  platformsHeading: 'Discovery, or ChallengerPlus',
  platformsIntro: 'Both panels run intruder alarms and access control from one set of users, areas and doors, and both are sold and supported in Australia by Aritech. We choose on the size of the site, the hardware already on the wall and how the system will be managed.',
  platforms: [
    {
      name: 'Tecom Discovery',
      kicker: 'The new core',
      art: {
        type: 'onPrem',
        alt: 'Readers, detectors, sirens and arming stations wired to a Discovery panel that is programmed from a web browser',
        devices: [
          { label: 'Readers', icon: 'reader' },
          { label: 'Detectors', icon: 'motion' },
          { label: 'Sirens', icon: 'speaker' },
          { label: 'Keypads', icon: 'alarm' },
        ],
        server: 'Discovery',
        badge: 'Programmed on web',
        title: 'All on the panel',
        sub: '65,000 users, 32 doors',
        points: ['16 inputs on board', '4G, Wi-Fi plug-ins', 'DIN rail mounted'],
      },
      body: 'Discovery is Aritech’s newest Tecom panel. It keeps the Challenger feature set, adds programming from a web browser built into the panel, and mounts on a DIN rail. There is enough processing headroom for new features to arrive by firmware rather than extra hardware.',
      points: [
        '65,000 users and 32 standard doors without expanders',
        '16 inputs, 4 relays, 2 siren outputs and 2 Wiegand reader ports on board',
        'Works with ChallengerPlus peripherals',
        'Plug-in 4G module and Wi-Fi adapter for comms and programming',
      ],
    },
    {
      name: 'ChallengerPlus',
      kicker: 'The proven panel',
      art: {
        type: 'panel',
        alt: 'A Challenger arming station for a bank branch with the vault and teller areas armed, the server room secure and a roller door in alarm',
        mode: 'Armed',
        modeTone: 'accent',
        status: 'Branch after hours',
        zones: [
          { name: 'Front door', state: 'secure', label: 'Locked 17:30' },
          { name: 'Teller PIR', state: 'armed', label: 'Armed' },
          { name: 'Vault', state: 'armed', label: 'Armed' },
          { name: 'Server room', state: 'secure', label: 'Locked' },
          { name: 'Roller door', state: 'alarm', label: 'Opened 23:12' },
          { name: 'Car park', state: 'bypassed', label: 'Isolated' },
        ],
      },
      body: 'ChallengerPlus builds on Challenger10 and Challenger V8, and works with their peripherals, so an older Challenger site can move up without rewiring every module. Thousands of programmable options let it follow each organisation’s own security procedures.',
      points: [
        'Ethernet, USB, PSTN and RS-232 on board',
        'Configuration backed up to an SD card in the panel',
        'Automated input testing to keep maintenance and compliance on track',
        'ChallengerLEPlus, a compact panel for tight spaces',
      ],
    },
  ],

  capabilitiesEyebrow: 'What it does',
  capabilitiesHeading: 'One system for alarms and doors',
  capabilitiesIntro: 'Tecom’s strength is how far one system can grow, from a single office to many sites. These are the parts our customers use every day.',
  capabilities: [
    {
      title: 'Site maps in WMS Pro',
      art: {
        type: 'map',
        alt: 'A WMS Pro site map of an office floor with doors, detectors and an arming station placed, and one door shown held open',
        markers: [
          { x: 14, y: 24, icon: 'door', tone: 'ok', label: 'Foyer' },
          { x: 48, y: 18, icon: 'motion', tone: 'accent', label: 'Open plan' },
          { x: 84, y: 26, icon: 'door', tone: 'warn', label: 'Dock door' },
          { x: 18, y: 74, icon: 'alarm', tone: 'accent', label: 'Keypad' },
          { x: 52, y: 80, icon: 'reader', tone: 'ok', label: 'Lift 2' },
          { x: 84, y: 72, icon: 'lock', tone: 'ok', label: 'Comms' },
        ],
        caption: 'Dock door held open, 18:42',
      },
      body: 'WMS Pro is the web-based management software for Tecom systems. Guards, reception and managers work from site maps, while cardholders, access rights, photo ID cards and reports are handled in the same place.',
    },
    {
      title: 'TecomPlus on your phone',
      art: {
        type: 'mobile',
        alt: 'A TecomPlus alert for an alarm at the warehouse, with buttons to view video and isolate the input',
        app: 'TecomPlus',
        icon: 'alarm',
        tone: 'alert',
        notice: 'Alarm',
        sub: 'Warehouse roller door',
        time: 'Tonight 11:12 pm',
        actions: ['View video', 'Isolate input'],
        side: [
          { label: 'Areas', sub: 'Arm, disarm', icon: 'alarm' },
          { label: 'Doors', sub: 'Open, lock', icon: 'door' },
          { label: 'Users', sub: 'PINs, cards', icon: 'person' },
        ],
      },
      body: 'The TecomPlus app connects through UltraSync to arm and disarm areas, open doors, isolate inputs and switch lights. It also edits users, PINs and expiry dates, and shows live and recorded TruVision video.',
    },
    {
      title: 'Doors and lifts',
      art: {
        type: 'door',
        alt: 'A card, a PIN, a fob and the phone app at a door, with the card opening it and door and lift events logged',
        credentials: [
          { label: 'Card', icon: 'card' },
          { label: 'PIN', icon: 'key' },
          { label: 'Fob', icon: 'fob' },
          { label: 'App', icon: 'phone' },
        ],
        active: 0,
        result: 'Access granted',
        resultTone: 'ok',
        log: ['08:21 Card, Foyer', '08:15 Lift 2, L4', '07:58 PIN, Store', '07:44 Denied, Dock'],
      },
      body: 'Access control is built into the panel rather than added on, so doors and alarm areas share the same users and the same event history. Network Access Controllers add more doors and manage lift access as well.',
    },
    {
      title: 'Network Access Controllers',
      art: {
        type: 'network',
        alt: 'WMS Pro connecting straight to a Network Access Controller running doors and lifts, alongside a Discovery panel',
        uplink: 'WMS Pro',
        switchLabel: 'NAC TS1066',
        switchSub: 'To software or a panel',
        ports: [
          { label: 'Foyer', icon: 'door', tone: 'ok' },
          { label: 'Rear exit', icon: 'door', tone: 'ok' },
          { label: 'Lift 1', icon: 'reader', tone: 'ok' },
          { label: 'Lift 2', icon: 'reader', tone: 'ok' },
          { label: 'Car park', icon: 'vehicle', tone: 'warn' },
          { label: 'Discovery', icon: 'alarm', tone: 'accent' },
        ],
        caption: 'Up to 8 doors and lifts per controller, with its own power management',
      },
      body: 'The NAC connects straight to the management software or to a Discovery or ChallengerPlus panel. The 8-door TS1066 suits sites short on wall space, a 4-door version suits smaller jobs, and the TS1067E adds Wiegand readers.',
    },
    {
      title: 'Automations',
      art: {
        type: 'dashboard',
        alt: 'A WMS Pro screen showing doors, areas and today’s automations, such as unlocking the foyer on a schedule and acting on an alarm',
        title: 'WMS Pro · head office',
        tiles: [
          { label: 'Doors online', value: '48', tone: 'ok' },
          { label: 'Areas armed', value: '6 of 9', tone: 'accent' },
          { label: 'Inputs isolated', value: '2', tone: 'warn' },
          { label: 'Automations', value: '12', tone: 'ok' },
        ],
        bars: [4, 9, 22, 31, 27, 18, 11, 5],
        chart: 'Door events per hour',
        eventsTitle: 'Automations today',
        events: [
          { text: 'Foyer unlocked 07:30', tone: 'ok' },
          { text: 'Lights on at disarm', tone: 'ok' },
          { text: 'Dock held, guard told', tone: 'warn' },
          { text: 'Foyer locked 18:00', tone: 'ok' },
        ],
      },
      body: 'WMS Pro automations run actions on a schedule or in response to an event, such as unlocking the foyer at opening time or acting on a door held open. Device asset tracking keeps service records for every controller and module.',
    },
    {
      title: 'Monitored over UltraSync',
      art: {
        type: 'cloud',
        alt: 'Three Tecom sites connecting through the encrypted UltraSync service to a monitoring centre and the TecomPlus app',
        title: 'UltraSync',
        sub: 'Encrypted panel connection',
        badge: 'Monitoring and the app',
        sites: [
          { label: 'Head office', sub: 'ChallengerPlus', icon: 'alarm' },
          { label: 'Warehouse', sub: 'Discovery', icon: 'alarm' },
          { label: 'Branch', sub: 'LEPlus panel', icon: 'alarm' },
        ],
        clients: [
          { label: 'Monitor', icon: 'headset' },
          { label: 'App', icon: 'phone' },
        ],
      },
      body: 'UltraSync gives Tecom panels an encrypted link to the monitoring station and the TecomPlus app. Panels can report to monitoring, management software and third-party systems at the same time, with a backup path if one fails.',
    },
  ],

  rangeEyebrow: 'The range',
  rangeHeading: 'What Tecom makes',
  range: [
    {
      title: 'Control panels',
      items: ['Discovery intrusion and access panel', 'ChallengerPlus', 'ChallengerLEPlus compact panel', 'Challenger10', 'Kits with a 16-area arming station'],
    },
    {
      title: 'Door controllers and modules',
      items: ['Network Access Controller TS1066, 8 or 4 doors', 'TS1067E controller with Wiegand', 'Discovery 4G module and Wi-Fi adapter', 'Discovery enclosures in three sizes'],
    },
    {
      title: 'Software',
      items: ['WMS Pro management software', 'Web Management System for Challenger10', 'Forcefield integrated platform', 'CTPlus programming tool'],
    },
    {
      title: 'Apps and connections',
      items: ['TecomPlus mobile app', 'UltraSync encrypted connection', 'TruVision video in the app', 'C-Bus building automation link'],
    },
  ],

  architectureEyebrow: 'How it fits together',
  architectureHeading: 'A Teracom Tecom system, end to end',
  architectureArt: {
    type: 'architecture',
    alt: 'Detectors, arming stations, readers, lifts and cameras report to a Tecom panel and WMS Pro, linked by UltraSync to the desk, managers, staff and monitoring',
    columns: ['On site', 'Platform', 'People'],
    devices: [
      { label: 'Detectors', sub: 'Alarm inputs', icon: 'motion' },
      { label: 'Arming stations', sub: '16-area keypads', icon: 'alarm' },
      { label: 'Card readers', sub: 'Doors and gates', icon: 'reader' },
      { label: 'Network Access', sub: 'Doors and lifts', icon: 'switch' },
      { label: 'TruVision cameras', sub: 'Linked video', icon: 'camera' },
    ],
    platforms: [
      { label: 'Tecom panel', sub: 'Discovery, Challenger', icon: 'alarm' },
      { label: 'WMS Pro', sub: 'Maps, users, reports', icon: 'server' },
      { label: 'UltraSync', sub: 'Encrypted cloud link', icon: 'cloud' },
    ],
    people: [
      { label: 'Security desk', sub: 'WMS Pro site maps', icon: 'laptop' },
      { label: 'Managers', sub: 'TecomPlus app', icon: 'phone' },
      { label: 'Staff', sub: 'Card or PIN', icon: 'person' },
      { label: 'Monitoring centre', sub: 'After-hours alarms', icon: 'headset' },
    ],
    footer: 'Intruder alarms, doors and lifts on one panel, from a single office to many sites',
  },
  architectureCaption: 'Detectors, arming stations, readers and Network Access Controllers report to a Discovery or ChallengerPlus panel, managed in WMS Pro. UltraSync carries alarms to the TecomPlus app and to our monitoring centre after hours.',

  industriesHeading: 'Where we put it to work',
  industries: ['Banks and credit unions', 'Retail', 'Schools and universities', 'Commercial buildings', 'Apartment blocks', 'Hospitals', 'Distribution centres', 'Transport infrastructure'],

  teracomHeading: 'What Teracom does on a Tecom job',
  teracom: [
    { title: 'Design', body: 'Areas, inputs, doors and lifts planned from the site drawings, and the right panel and controllers chosen, including what can be kept on an older Challenger site.' },
    { title: 'Install and commission', body: 'Panels, modules, detectors and readers installed and wired, every input tested, and users, areas and access levels programmed before handover.' },
    { title: 'Connect to monitoring', body: 'Alarms can report over UltraSync to our monitoring centre for after-hours response.' },
    { title: 'Look after it', body: 'Firmware, software maintenance, battery checks and input testing handled on a maintenance plan, so the system stays current and supported.' },
  ],

  links: [
    { label: 'Tecom range at Aritech', href: 'https://aritech.com.au/tecom-2/' },
    { label: 'Tecom Discovery panel', href: 'https://aritech.com.au/discovery/' },
    { label: 'WMS Pro management software', href: 'https://aritech.com.au/wms-pro/' },
  ],
};

export default tecomChallenger;