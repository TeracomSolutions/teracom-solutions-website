// The deeper ION brand page (Robert, 2026-10-01: build the brand pages
// out from each manufacturer's own site, with drawings of what the
// technology does rather than product photos).
// Written in our own words from ionups.com.au (October 2026); figures are
// ION's own. Drawings are specs drawn by lib/brandArt.

const ion = {
  heroArt: {
    type: 'hero',
    alt: 'An ION UPS riding through a blackout and a voltage sag, with line-interactive units on one side and online units on the other',
    device: 'battery',
    left: { title: 'F11, F16', sub: 'Corrects sags', foot: 'Desks, POS and cabinets', icon: 'laptop' },
    right: { title: 'F18 IOT', sub: 'Online UPS', foot: 'Recorders and servers', icon: 'server' },
    tags: [
      { text: 'Blackout', tone: 'alert', icon: 'bolt' },
      { text: 'Voltage sag', tone: 'warn', icon: 'chart' },
      { text: 'Wi-Fi status', tone: 'ok', icon: 'wifi' },
    ],
    chips: [
      { text: 'Designed in Australia', tone: 'accent' },
      { text: '24/7 phone support', tone: 'ok' },
    ],
  },

  stats: [
    { value: 'Unity 1.0', label: 'output power factor on the F18 IOT online range' },
    { value: 'Up to 98%', label: 'efficiency in eco mode on the larger F18 IOT models' },
    { value: '5-10 years', label: 'expected battery life on the F18L lithium-ion range' },
    { value: 'IP55', label: 'outdoor FHT cabinet, rated to run from -20°C to 45°C' },
  ],

  platformsEyebrow: 'Two ways to protect it',
  platformsHeading: 'Line-interactive or online',
  platformsIntro: 'Every ION UPS keeps equipment running when the mains fails. The difference is how much cleaning the power gets the rest of the time, and we choose on what the equipment is and how long it must keep going.',
  platforms: [
    {
      name: 'Line-interactive UPS',
      kicker: 'F10, F11, F15R and F16',
      art: {
        type: 'power',
        alt: 'An ION F11 correcting a sagging mains supply with voltage regulation while a computer, a point of sale terminal and a router keep running',
        source: 'Mains',
        sourceSub: 'Sagging',
        unit: 'ION F11',
        charge: 100,
        loads: [
          { label: 'Computer', sub: 'Protected', icon: 'laptop' },
          { label: 'POS terminal', sub: 'Protected', icon: 'card' },
          { label: 'Router', sub: 'Protected', icon: 'wifi' },
        ],
        status: 'Sag corrected by AVR',
        statusTone: 'ok',
      },
      body: 'The UPS watches the mains, evens out sags and surges with automatic voltage regulation, and switches to battery within a few milliseconds when the power fails. Right for computers, point of sale and smaller comms cabinets.',
      points: [
        'F10 power board UPS, 850 VA',
        'F11 towers from 650 to 2200 VA with boost and buck AVR',
        'F15R 1RU rack units from 650 to 1550 VA',
        'F16 pure sine wave rack/tower, 1 to 3 kVA, with an SNMP option',
      ],
    },
    {
      name: 'Online UPS',
      kicker: 'F18 IOT, F18L and FHT',
      art: {
        type: 'power',
        alt: 'An ION F18 IOT on battery after a mains failure, keeping a recorder, a core switch and door controllers running',
        source: 'Mains',
        sourceSub: 'Failed',
        unit: 'ION F18 IOT',
        charge: 78,
        loads: [
          { label: 'NVR', sub: 'Recording', icon: 'server' },
          { label: 'Core switch', sub: 'Running', icon: 'switch' },
          { label: 'Door control', sub: 'Running', icon: 'lock' },
        ],
        status: 'Mains failed · on battery',
        statusTone: 'warn',
      },
      body: 'Double conversion means the load always runs from the inverter, so equipment gets steady, clean power whether the mains is good or gone. This is the choice for recorders, servers and core switches that must not drop out.',
      points: [
        'F18 IOT: 1 to 10 kVA, unity power factor, 2RU rack/tower',
        'F18L: lithium-ion batteries with a five-year limited warranty',
        'FHT: IP55 outdoor cabinet for harsh, remote sites',
        'Three-phase F20 to F35 systems for larger loads',
      ],
    },
  ],

  capabilitiesEyebrow: 'Beyond the battery',
  capabilitiesHeading: 'Knowing what the UPS is doing',
  capabilitiesIntro: 'A UPS that fails quietly is no help. These are the ION features that tell you what is happening and keep the runtime matched to the job.',
  capabilities: [
    {
      title: 'Status on your phone',
      art: {
        type: 'mobile',
        alt: 'A phone alert from the ION UPS app saying a comms room UPS is on battery, with its charge, load and input shown',
        app: 'ION UPS app',
        icon: 'battery',
        tone: 'warn',
        notice: 'On battery',
        sub: 'Comms room · F18 IOT',
        time: 'Today 2:14 pm',
        actions: ['View status'],
        side: [
          { label: 'Battery', sub: '78% charge', icon: 'battery' },
          { label: 'Load', sub: 'Still running', icon: 'server' },
          { label: 'Input', sub: 'Mains lost', icon: 'bolt' },
        ],
      },
      body: 'ION says it is the only Australian UPS company with a Wi-Fi enabled UPS fleet. Units such as the F18 IOT can connect to the cloud and be checked from an app, so a power cut at a remote site does not go unnoticed.',
    },
    {
      title: 'On the network',
      art: {
        type: 'dashboard',
        alt: 'A network monitoring screen for a UPS showing input voltage, battery, load, rack temperature and recent power events',
        title: 'F-SNMP · comms rack',
        tiles: [
          { label: 'Input', value: '241 V', tone: 'ok' },
          { label: 'Battery', value: '100%', tone: 'ok' },
          { label: 'Load', value: '38%' },
          { label: 'Rack temp', value: '24°C' },
        ],
        bars: [30, 34, 38, 41, 39, 36, 38, 38],
        chart: 'Load, last 8 hours',
        eventsTitle: 'Events',
        events: [
          { text: 'Mains sag 02:10', tone: 'warn' },
          { text: 'On battery 4 min', tone: 'warn' },
          { text: 'Mains restored', tone: 'ok' },
          { text: 'Rack 24°C, 41% RH', tone: 'ok' },
        ],
      },
      body: 'An F-SNMP card puts F16 and F18 units on the network for monitoring, and an F-EMP probe adds rack temperature and humidity. Dry contact cards pass on-battery and fault signals to an alarm panel or building system.',
    },
    {
      title: 'Runtime that grows',
      art: {
        type: 'storage',
        alt: 'Internal batteries backed by stacks of hot-swappable external battery modules to lengthen runtime',
        tiers: [
          { label: 'Internal batteries', sub: 'Inside the UPS', icon: 'battery' },
          { label: 'External battery modules', sub: 'Hot-swappable, added as needed', icon: 'battery' },
        ],
        active: 1,
        stat: '8 or 16',
        statLabel: 'modules, 36 V or 72 V',
        badge: 'Hot-swappable',
        points: ['F16: FEBM modules', 'F18 IOT: stackable', 'Sized to the runtime'],
        caption: 'More battery modules, more time on battery',
      },
      body: 'Where a recorder or comms rack has to ride through a long outage, external battery modules extend the runtime. F16 units take FEBM modules, and F18 IOT units accept up to 8 or 16 hot-swappable modules depending on battery voltage.',
    },
  ],

  rangeEyebrow: 'The range',
  rangeHeading: 'What ION makes',
  range: [
    {
      title: 'Line-interactive UPS',
      items: ['F10 power board UPS', 'F11 and F11-LE towers, 650 to 2200 VA', 'F15R 1RU rack, 650 to 1550 VA', 'F16 rack/tower, 1 to 3 kVA'],
    },
    {
      title: 'Online UPS',
      items: ['F18 IOT rack/tower, 1 to 10 kVA', 'F18L lithium-ion, 1 to 3 kVA', 'FHT IP55 outdoor cabinet, 1 to 3 kVA'],
    },
    {
      title: 'Three-phase UPS',
      items: ['F20 and F23 tower systems', 'F21 and F22 modular systems', 'F35 modular, 50 to 500 kVA'],
    },
    {
      title: 'Power, racks and monitoring',
      items: ['Automatic transfer switches and PDUs', 'Network enclosures and data centre racks', 'F-SNMP cards and F-EMP sensors', 'Dry contact cards'],
    },
  ],

  architectureEyebrow: 'How it fits together',
  architectureHeading: 'ION power behind a Teracom system',
  architectureArt: {
    type: 'architecture',
    alt: 'Recorders, network gear, door controllers and alarm panels run from an ION UPS that reports its status to the IT team, a manager and Teracom',
    columns: ['Protected kit', 'ION power', 'Kept informed'],
    devices: [
      { label: 'Recorders', sub: 'NVRs and servers', icon: 'server' },
      { label: 'Network', sub: 'Switches, routers', icon: 'switch' },
      { label: 'Door control', sub: 'Controllers, locks', icon: 'lock' },
      { label: 'Alarm panel', sub: 'Monitored comms', icon: 'alarm' },
    ],
    platforms: [
      { label: 'ION UPS', sub: 'Clean, backed-up power', icon: 'battery' },
      { label: 'F-SNMP and app', sub: 'Status on the network', icon: 'cloud' },
    ],
    people: [
      { label: 'IT team', sub: 'Network alerts', icon: 'laptop' },
      { label: 'Site manager', sub: 'Status on the phone', icon: 'phone' },
      { label: 'Teracom', sub: 'Batteries and service', icon: 'headset' },
    ],
    footer: 'Security and network equipment rides through blackouts while the UPS reports what it is doing',
  },
  architectureCaption: 'Recorders, switches, door controllers and alarm panels sit behind an ION UPS sized for the runtime you need. The UPS reports over the network or to the app, so the right people know as soon as the mains drops.',

  industriesHeading: 'Where we put it to work',
  industries: ['Retail and point of sale', 'Commercial offices', 'Comms rooms and data centres', 'Industrial sites', 'Mining', 'Telecommunications', 'Healthcare', 'Schools'],

  teracomHeading: 'What Teracom does on an ION job',
  teracom: [
    { title: 'Size it', body: 'The load of every recorder, switch and controller added up, and the runtime worked out, before we pick the model and any battery modules.' },
    { title: 'Install and commission', body: 'Racked or placed, wired to the right circuits and tested on battery, with monitoring cards set up on the network.' },
    { title: 'Connect to monitoring', body: 'On-battery and fault signals can be wired to the alarm panel, so a power loss reaches our monitoring centre.' },
    { title: 'Look after it', body: 'Battery checks and replacements on a maintenance plan, with warranty swaps arranged through ION.' },
  ],

  links: [
    { label: 'ION UPS range', href: 'https://www.ionups.com.au/products/ups/' },
    { label: 'ION UPS communications and monitoring', href: 'https://www.ionups.com.au/products/ups-communications/' },
    { label: 'About ION, warranty and 24/7 support', href: 'https://ionups.com.au/about-us' },
  ],
};

export default ion;