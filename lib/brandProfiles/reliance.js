// The deeper Reliance (XR Pro) brand page (Robert, 2026-10-01: build the brand
// pages out from each manufacturer's own site, with drawings of what the
// technology does rather than product photos).
// Written in our own words from aritech.com.au (October 2026); figures are
// Aritech's own (Reliance XR series datasheet, brochure and product pages).
// Drawings are specs drawn by lib/brandArt.

const reliance = {
  heroArt: {
    type: 'hero',
    alt: 'A Reliance XR Pro panel taking in wired and 80plus wireless detectors and reporting over UltraSync to monitoring and the app',
    device: 'alarm',
    left: { title: 'Detectors', sub: 'Wired + 80plus', foot: 'Up to 176 zones', icon: 'motion' },
    right: { title: 'UltraSync', sub: 'IP, 4G, Wi-Fi', foot: 'Monitoring and the app', icon: 'cloud' },
    tags: [
      { text: 'Area 1 armed', tone: 'ok', icon: 'lock' },
      { text: 'Back door open', tone: 'warn', icon: 'door' },
      { text: 'Smoke alarm', tone: 'alert', icon: 'sensor' },
    ],
    chips: [
      { text: 'Reliance XR Pro', tone: 'accent' },
      { text: 'UltraSync connected', tone: 'ok' },
    ],
  },

  stats: [
    { value: '176', label: 'zones on the XR Pro, from 8 on the board up through expanders' },
    { value: '256', label: 'user codes on the XR Pro, across up to 8 separate areas' },
    { value: '800 m', label: 'of cable run on the 4-wire RS-485 XR bus for keypads and modules' },
    { value: 'RCM', label: 'approved for Australia, and rated EN 50131 Grade 2 overseas' },
  ],

  platformsEyebrow: 'The panel and the link',
  platformsHeading: 'Reliance XR Pro on the wall, UltraSync in the cloud',
  platformsIntro: 'The panel does the detecting and deciding on site. UltraSync carries its alarms to a monitoring centre and lets owners and installers reach it from a phone or a browser, with no port forwarding to set up.',
  platforms: [
    {
      name: 'Reliance XR Pro panel',
      kicker: 'On site',
      art: {
        type: 'panel',
        alt: 'A Reliance XR keypad showing a house armed in Stay mode, with the doors armed, a study window bypassed and the garage in alarm',
        mode: 'Armed stay',
        modeTone: 'accent',
        status: 'Alarm: garage',
        zones: [
          { name: 'Front door', state: 'armed' },
          { name: 'Back door', state: 'armed' },
          { name: 'Garage roller', state: 'alarm', label: 'Alarm 02:14' },
          { name: 'Lounge PIR', state: 'secure' },
          { name: 'Hallway PIR', state: 'secure' },
          { name: 'Study window', state: 'bypassed', label: 'Bypassed' },
          { name: 'Kitchen smoke', state: 'secure', label: '24-hour' },
        ],
      },
      body: 'A hybrid intrusion panel for anything from a house to a large commercial site. Wired zones, 80plus wireless detectors, keypads and expanders all report to one board, which can be programmed from a keypad, its own web page, DLX900 software or the app.',
      points: [
        '8 zones on the board, 16 with zone doubling, 176 in total',
        'Up to 8 areas, 256 users and 24 keypads',
        'On-board 433 MHz receiver for 63-bit and 80plus devices',
        'The smaller Reliance XR suits sites of up to 24 zones',
      ],
    },
    {
      name: 'UltraSync',
      kicker: 'Cloud connection',
      art: {
        type: 'cloud',
        alt: 'Three Reliance XR sites linking to UltraSync over Ethernet or 4G, with the owner on a phone and the installer in a browser',
        title: 'UltraSync',
        sub: 'Encrypted path per panel',
        badge: 'No port forwarding',
        sites: [
          { label: 'Home', sub: 'Ethernet', icon: 'alarm' },
          { label: 'Shop', sub: '4G and Wi-Fi', icon: 'alarm' },
          { label: 'Warehouse', sub: 'Ethernet + 4G', icon: 'alarm' },
        ],
        clients: [
          { label: 'App', icon: 'phone' },
          { label: 'Portal', icon: 'laptop' },
        ],
      },
      body: 'The panel’s on-board Ethernet port, or the optional dual-SIM 4G and Wi-Fi module, opens an encrypted link to the UltraSync cloud. Alarms travel that way to a compatible monitoring centre, and the same link carries the UltraSync+ app and the installer portal.',
      points: [
        'Alarm reporting to UltraSync-connected monitoring centres',
        'UltraSync+ app for iPhone, iPad and Android',
        'Installer portal for remote programming and diagnostics',
        'Dual-SIM 4G and Wi-Fi module for Telstra or Vodafone',
      ],
    },
  ],

  capabilitiesEyebrow: 'What it does',
  capabilitiesHeading: 'What the system actually does',
  capabilitiesIntro: 'The Reliance XR series was built to replace NetworX and older Reliance boards in place, then add the connected features people now expect of an alarm. These are the parts our customers use most.',
  capabilities: [
    {
      title: 'Upgrade without rewiring',
      art: {
        type: 'network',
        alt: 'A Reliance XR Pro board running older NetworX keypads and zones on one bus and new XR keypads and modules on the other',
        uplink: 'UltraSync',
        switchLabel: 'Reliance XR Pro',
        switchSub: 'XR bus and legacy NX bus',
        ports: [
          { label: 'NX keypad', icon: 'reader', tone: 'muted' },
          { label: 'NX zones', icon: 'sensor', tone: 'muted' },
          { label: 'XR keypad', icon: 'reader', tone: 'ok' },
          { label: 'NXG-208N', icon: 'sensor', tone: 'ok' },
          { label: 'NXG-508N', icon: 'bolt', tone: 'ok' },
          { label: 'NXG-433', icon: 'wifi', tone: 'ok' },
        ],
        caption: 'Older devices stay on the 3-wire bus, new ones join the 4-wire bus',
      },
      body: 'XR boards share the NetworX and Reliance footprint and keep the 3-wire legacy bus alongside the new 4-wire XR bus. Most existing keypads and zone expanders stay where they are, so an upgrade is often a board swap rather than a new system.',
    },
    {
      title: 'Wired and wireless detection',
      art: {
        type: 'sensor',
        alt: 'An 80plus wireless PIR covering a lounge and reporting motion, its regular check-in and its battery state to the panel',
        icon: 'motion',
        target: 'person',
        label: 'RF-EV1012-K4',
        sub: '80plus wireless PIR',
        coverage: '12 m, 86°, nine curtains',
        events: [
          { text: 'Motion', sub: 'Zone 21, lounge', tone: 'alert' },
          { text: 'Check-in', sub: 'Every 18 minutes', tone: 'ok' },
          { text: 'Battery OK', sub: 'Five-year life', tone: 'ok' },
        ],
      },
      body: 'Hardwired zones and 80plus wireless detectors sit on the same panel. The wireless PIR covers 12 m across 86°, checks in with the panel every 18 minutes and is rated for five years on one battery, so rooms that are hard to cable are no longer a problem.',
    },
    {
      title: 'The UltraSync+ app',
      art: {
        type: 'mobile',
        alt: 'An UltraSync+ alarm on a phone for the back door, with buttons to disarm or read the event history',
        app: 'UltraSync+',
        icon: 'alarm',
        tone: 'alert',
        notice: 'Alarm: Zone 3',
        sub: 'Back door, Area 1',
        time: 'Today 2:14 am',
        actions: ['Disarm', 'Event history'],
        side: [
          { label: 'Area 1', sub: 'Armed away', icon: 'lock' },
          { label: 'Windows', sub: 'All closed', icon: 'door' },
          { label: 'Geofence', sub: 'Left home 8:05', icon: 'pin' },
        ],
      },
      body: 'Arm and disarm, bypass a zone, check that doors and windows are shut and read the event history from a phone. Push alerts arrive on an alarm or a fault, and a geofence can remind you when you leave with the system still off.',
    },
    {
      title: 'Areas and user codes',
      art: {
        type: 'map',
        alt: 'A shop floor plan split into areas, with a keypad, detectors, a door contact, a smoke detector and a siren placed and the rear door in alarm',
        markers: [
          { x: 12, y: 22, icon: 'reader', tone: 'accent', label: 'Keypad' },
          { x: 38, y: 30, icon: 'motion', label: 'Shop PIR' },
          { x: 72, y: 22, icon: 'motion', label: 'Office PIR' },
          { x: 62, y: 55, icon: 'motion', label: 'Store PIR' },
          { x: 88, y: 70, icon: 'door', tone: 'alert', label: 'Rear door' },
          { x: 42, y: 78, icon: 'sensor', label: 'Smoke' },
          { x: 14, y: 80, icon: 'alarm', label: 'Siren' },
        ],
        caption: 'Shop, office and store: three areas',
      },
      body: 'Split a site into as many as eight areas that arm and disarm separately, such as a shop floor, an office and a store room. Each of up to 256 users gets a code and permissions, and the app can issue temporary codes limited to set days and times.',
    },
    {
      title: 'Program it from anywhere',
      art: {
        type: 'dashboard',
        alt: 'The panel’s web page showing zones, areas, users and communication paths in use, a week of events and the latest activity',
        title: 'Reliance XR web page',
        tiles: [
          { label: 'Zones in use', value: '38', tone: 'accent' },
          { label: 'Areas', value: '3', tone: 'ok' },
          { label: 'Users', value: '22' },
          { label: 'Comms', value: 'IP+4G', tone: 'ok' },
        ],
        bars: [12, 9, 14, 11, 16, 6, 4],
        chart: 'Events this week',
        eventsTitle: 'Latest',
        events: [
          { text: 'Area 2 armed, 6:02 pm', tone: 'ok' },
          { text: 'Zone 7 bypassed', tone: 'warn' },
          { text: 'Mains restored', tone: 'ok' },
          { text: 'Firmware up to date', tone: 'muted' },
        ],
      },
      body: 'Installers can program the panel from a keypad, from a PC on its built-in web page, with DLX900 software, or through the UltraSync portal and app. New XR expanders enrol themselves, and the firmware can be updated in the field.',
    },
    {
      title: 'Life safety and smart home',
      art: {
        type: 'sensor',
        alt: 'A smoke and heat detector on a 24-hour zone, with flood and panic pendant alerts also reaching the panel',
        icon: 'sensor',
        target: 'thermo',
        label: 'Smoke and heat',
        sub: '24-hour zone',
        coverage: 'Smoke, heat, flood and panic devices',
        events: [
          { text: 'Smoke', sub: 'Kitchen, 24-hour', tone: 'alert' },
          { text: 'Flood', sub: 'Laundry', tone: 'warn' },
          { text: 'Panic pendant', sub: 'Bedroom 1', tone: 'alert' },
        ],
      },
      body: 'Besides intruder detectors the panel takes 24-hour medical and hold-up buttons, smoke and heat detectors and flood sensors. It also works with Z-Wave lights, locks and thermostats and with Alexa voice control, so a scene can run when the system arms.',
    },
  ],

  rangeEyebrow: 'The range',
  rangeHeading: 'What the Reliance XR series includes',
  range: [
    {
      title: 'Panels',
      items: ['Reliance XR Pro (NXX-8-WZ-AU): 8 to 176 zones, 8 areas', 'Reliance XR (NXX-4-W-AU): 4 to 24 zones, 4 areas', 'Board-only versions to fit existing enclosures'],
    },
    {
      title: 'Keypads',
      items: ['NXG-1820 touch keypad with a 3.5-inch colour screen', 'NXG-1830 and NXG-1831 LCD keypads, white or anthracite', 'NXG-1832 and NXG-1833 with a built-in Mifare DESFire reader', 'Most existing NetworX and Reliance keypads'],
    },
    {
      title: 'Expanders and communication',
      items: ['NXG-208N input expander', 'NXG-508N output expander', 'NXG-433 wireless expander for 63-bit and 80plus devices', 'NXX-4G-WFSIM-AU dual-SIM 4G and Wi-Fi router'],
    },
    {
      title: 'Wireless and life-safety devices',
      items: ['RF-EV1012-K4 wireless PIR, 12 m', 'RF-DC101-K4 wireless door and window contact', 'Keyfobs and panic pendants or wristwatches', 'Indoor and outdoor sirens', 'Smoke, heat and flood sensors'],
    },
  ],

  architectureEyebrow: 'How it fits together',
  architectureHeading: 'A Teracom Reliance XR system, end to end',
  architectureArt: {
    type: 'architecture',
    alt: 'Keypads, wired and wireless detectors, life-safety sensors and sirens report to a Reliance XR Pro, which reaches monitoring, owners and installers via UltraSync',
    columns: ['On site', 'Panel + cloud', 'People'],
    devices: [
      { label: 'Keypads', sub: 'Touch, LCD, Mifare', icon: 'reader' },
      { label: 'Wired detectors', sub: 'Board and NXG-208N', icon: 'motion' },
      { label: '80plus wireless', sub: 'On-board 433 MHz', icon: 'wifi' },
      { label: 'Life safety', sub: 'Smoke, heat, flood', icon: 'sensor' },
      { label: 'Sirens', sub: 'Indoor and outdoor', icon: 'alarm' },
    ],
    platforms: [
      { label: 'Reliance XR Pro', sub: 'Hybrid panel on site', icon: 'alarm' },
      { label: 'UltraSync', sub: 'Ethernet or 4G link', icon: 'cloud' },
    ],
    people: [
      { label: 'Monitoring centre', sub: 'Alarm signals, 24/7', icon: 'headset' },
      { label: 'Owners and staff', sub: 'UltraSync+ app', icon: 'phone' },
      { label: 'Installer', sub: 'Portal and DLX900', icon: 'laptop' },
    ],
    footer: 'Detectors report to the panel; UltraSync carries alarms to monitoring and lets people in from anywhere',
  },
  architectureCaption: 'Keypads, detectors and sirens are wired or linked back to the Reliance XR Pro. UltraSync carries its alarms to the monitoring centre, gives owners the app, and lets the installer work on the panel without a site visit.',

  industriesHeading: 'Where we put it to work',
  industries: ['Homes', 'Multi-storey residential', 'Retail', 'Offices', 'Schools', 'Aged care', 'Government', 'Warehousing'],

  teracomHeading: 'What Teracom does on a Reliance XR job',
  teracom: [
    { title: 'Design', body: 'Zones, areas and users planned from the site drawings, with wired or 80plus wireless chosen room by room and the right panel size picked before anything is ordered.' },
    { title: 'Install and commission', body: 'New panels fitted, or older NetworX and Reliance boards swapped for XR boards in the same enclosure, with every detector walk-tested before handover.' },
    { title: 'Connect to monitoring', body: 'UltraSync reporting set up over Ethernet or 4G and tested end to end, so alarms reach the monitoring centre for after-hours response.' },
    { title: 'Look after it', body: 'Firmware updates, battery changes and health checks handled on a maintenance plan, so the system stays current and supported.' },
  ],

  links: [
    { label: 'Reliance XR Series overview', href: 'https://aritech.com.au/reliance-xr-series/' },
    { label: 'Reliance XR Pro panel', href: 'https://aritech.com.au/product/reliance-xr-pro/' },
    { label: 'UltraSync platform', href: 'https://aritech.com.au/ultrasync/' },
  ],
};

export default reliance;