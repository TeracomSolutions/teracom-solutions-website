// The deeper PowerShield brand page (Robert, 2026-10-01: build the brand
// pages out from each manufacturer's own site, with drawings of what the
// technology does rather than product photos).
// Written in our own words from powershield.com.au (October 2026); figures
// are PowerShield’s own. Drawings are specs drawn by lib/brandArt.

const powershield = {
  heroArt: {
    type: 'hero',
    alt: 'A PowerShield UPS at the centre keeping security gear running through a mains failure, with Commander units on one side and Centurion units on the other',
    device: 'battery',
    left: { title: 'Commander', sub: 'AVR, sine wave', foot: 'Comms and alarm panels', icon: 'switch' },
    right: { title: 'Centurion', sub: 'True online', foot: 'Recorders and servers', icon: 'server' },
    tags: [
      { text: 'Mains failed', tone: 'alert', icon: 'bolt' },
      { text: 'Surge stopped', tone: 'ok', icon: 'shield' },
      { text: 'SNMP alert', tone: 'accent', icon: 'chart' },
    ],
    chips: [
      { text: 'Australian owned', tone: 'accent' },
      { text: 'Since 2000', tone: 'ok' },
    ],
  },

  stats: [
    { value: 'Since 2000', label: 'protecting power for Australian businesses, from Malaga in WA' },
    { value: '5 years', label: 'warranty on LiFePO4 models such as the Centurion RT LiFePO4' },
    { value: '10 to 80 kVA', label: 'three-phase Centurion Pro range, with output power factor 1.0' },
    { value: '3 years', label: 'free warranty on Commander and single-phase Centurion when registered' },
  ],

  platformsEyebrow: 'Two ways to protect it',
  platformsHeading: 'Line-interactive or true online',
  platformsIntro: 'PowerShield designs its range for the power conditions of Australia and the wider Oceania region. Every model rides through a blackout; the difference is how clean the power is the rest of the time, and we choose on the equipment and how long it must keep going.',
  platforms: [
    {
      name: 'Line-interactive UPS',
      kicker: 'Defender and Commander',
      art: {
        type: 'power',
        alt: 'A Commander RT evening out a sagging mains supply with its built-in voltage regulation while a recorder, a PoE switch and an alarm panel keep running',
        source: 'Mains',
        sourceSub: 'Sagging',
        unit: 'Commander RT',
        charge: 100,
        loads: [
          { label: 'NVR', sub: 'Protected', icon: 'server' },
          { label: 'PoE switch', sub: 'Protected', icon: 'switch' },
          { label: 'Alarm panel', sub: 'Protected', icon: 'alarm' },
        ],
        status: 'Sag corrected by AVR',
        statusTone: 'ok',
      },
      body: 'The UPS boosts or trims the mains with automatic voltage regulation and only goes to battery when the power fails or strays too far. Right for comms cabinets, alarm panels, door controllers and smaller recorders.',
      points: [
        'Defender, 650 to 2000 VA, with batteries you can change on site',
        'Defender Rackmount 1500: shallow depth with a 10-year battery',
        'Commander Tower and RT, 1100 to 3000 VA, pure sine wave output',
        'Extra battery banks for longer runtime on Commander RT',
      ],
    },
    {
      name: 'True online UPS',
      kicker: 'The Centurion range',
      art: {
        type: 'power',
        alt: 'A Centurion RT on battery after the mains fails, keeping recorders, the comms rack and an automatic gate running',
        source: 'Mains',
        sourceSub: 'Failed',
        unit: 'Centurion RT',
        charge: 82,
        loads: [
          { label: 'Recorders', sub: 'Still recording', icon: 'server' },
          { label: 'Comms rack', sub: 'Still online', icon: 'switch' },
          { label: 'Gate motor', sub: 'Still running', icon: 'vehicle' },
        ],
        status: 'Mains out · on battery',
        statusTone: 'warn',
      },
      body: 'Double conversion feeds the equipment from the inverter all the time, so it sees steady, clean power whether the mains is good, noisy or gone. This is the choice for recorders, servers and core switches that cannot drop out.',
      points: [
        'Centurion Tower and RT, with lead-acid or LiFePO4 batteries',
        'Centurion RT LiFePO4, standard and Long Run models',
        'Centurion Pro three-phase, 10 to 80 kVA, with dual mains input',
        'Platinum Modular systems for the largest loads',
      ],
    },
  ],

  capabilitiesEyebrow: 'Beyond the battery',
  capabilitiesHeading: 'Knowing what the UPS is doing',
  capabilitiesIntro: 'A UPS that fails quietly protects nothing. These are the PowerShield features that report on the power, the batteries and the room, and keep runtime matched to the job.',
  capabilities: [
    {
      title: 'NetGuard monitoring',
      art: {
        type: 'dashboard',
        alt: 'NetGuard showing a comms room UPS with input voltage, battery, load and mode, and a short power event that the UPS rode through',
        title: 'NetGuard · comms room',
        tiles: [
          { label: 'Input', value: '238 V', tone: 'ok' },
          { label: 'Battery', value: '100%', tone: 'ok' },
          { label: 'Load', value: '42%', tone: 'accent' },
          { label: 'Mode', value: 'Online', tone: 'ok' },
        ],
        bars: [40, 41, 43, 46, 44, 42, 42, 42],
        chart: 'Load, last 8 hours',
        eventsTitle: 'Power events',
        events: [
          { text: 'Mains sag 03:12', tone: 'warn' },
          { text: 'On battery 2 min', tone: 'warn' },
          { text: 'Mains back 03:14', tone: 'ok' },
          { text: 'Battery test passed', tone: 'ok' },
        ],
      },
      body: 'NetGuard is free monitoring software for the SafeGuard, Defender, Commander and Centurion RT ranges, for Windows, Mac and Linux. It shows how the mains, the battery and the load are behaving from a computer on site.',
    },
    {
      title: 'Alerts on your phone',
      art: {
        type: 'mobile',
        alt: 'An email alert on a phone saying the gatehouse UPS is on battery, with the gate motor and cameras still running',
        app: 'UPS email alert',
        icon: 'battery',
        tone: 'warn',
        notice: 'On battery',
        sub: 'Gatehouse · Centurion',
        time: 'Today 3:12 am',
        actions: ['View status'],
        side: [
          { label: 'Battery', sub: '86%, falling', icon: 'battery' },
          { label: 'Gate motor', sub: 'Running', icon: 'vehicle' },
          { label: 'Cameras', sub: 'Recording', icon: 'camera' },
        ],
      },
      body: 'PowerShield monitoring can send alerts by email to a phone or a computer, so a UPS that goes to battery at a remote gatehouse or comms room does not go unnoticed.',
    },
    {
      title: 'On the network',
      art: {
        type: 'network',
        alt: 'An SNMP card on the IT network reporting several UPS units, an environmental sensor and a virtual machine host',
        uplink: 'IT network',
        switchLabel: 'SNMP Comms Card V4',
        switchSub: 'Or Cyber Secure SNMP',
        ports: [
          { label: 'Rack UPS', icon: 'battery', tone: 'ok' },
          { label: 'NVR UPS', icon: 'battery', tone: 'ok' },
          { label: 'Door UPS', icon: 'battery', tone: 'ok' },
          { label: 'Gate UPS', icon: 'battery', tone: 'warn' },
          { label: 'EMD probe', icon: 'thermo', tone: 'ok' },
          { label: 'VM host', icon: 'server', tone: 'accent' },
        ],
        caption: 'Scheduled shutdowns, start-ups and reboots across several UPSs',
      },
      body: 'SNMP cards put a UPS on the network for monitoring and scheduled shutdowns, start-ups and reboots. The V4 card works with VMware, Hyper-V and Modbus TCP/IP, and the Cyber Secure card follows the Australian Cyber Security Centre’s ISM framework.',
    },
    {
      title: 'Rack temperature and humidity',
      art: {
        type: 'sensor',
        alt: 'An environmental sensor in a comms rack reporting normal temperature and humidity and an open cabinet door on a dry contact input',
        icon: 'thermo',
        target: 'server',
        label: 'PSEMD sensor',
        sub: 'Via the SNMP V4 card',
        coverage: 'Temperature, humidity, two dry inputs',
        events: [
          { text: 'Rack 24°C', sub: 'Normal', tone: 'ok' },
          { text: 'Humidity 41%', sub: 'Normal', tone: 'ok' },
          { text: 'Cabinet door', sub: 'Dry input 1 open', tone: 'warn' },
        ],
      },
      body: 'The PSEMD environmental sensor plugs into the SNMP V4 card to watch temperature and humidity in the rack. Two dry contact inputs take signals from other sensors, such as a cabinet door switch.',
    },
    {
      title: 'Lithium batteries',
      art: {
        type: 'storage',
        alt: 'Internal LiFePO4 batteries in a Centurion RT, backed by a Long Run battery bank for longer outages',
        tiers: [
          { label: 'Internal LiFePO4 batteries', sub: 'Centurion RT LiFePO4, 1 to 3 kVA', icon: 'battery' },
          { label: 'Long Run battery bank', sub: 'Added for longer outages', icon: 'battery' },
        ],
        active: 1,
        stat: '5 yrs',
        statLabel: 'LiFePO4 UPS warranty',
        badge: 'Hot-swappable',
        points: ['Lighter to install', 'Faster to recharge', 'Longer battery life'],
        caption: 'Long Run models take an extra battery bank for longer runtime',
      },
      body: 'Lithium iron phosphate batteries last longer, weigh less and recharge faster than lead-acid, and PowerShield backs its LiFePO4 models with a five-year warranty. Long Run versions take an added battery bank where a site must ride through a long outage.',
    },
    {
      title: 'Fits a shallow rack',
      art: {
        type: 'onPrem',
        alt: 'A recorder, a PoE switch, a router and an alarm panel in a shallow comms cabinet, all running from a Defender Rackmount UPS',
        devices: [
          { label: 'NVR', icon: 'server' },
          { label: 'PoE switch', icon: 'switch' },
          { label: 'Router', icon: 'wifi' },
          { label: 'Alarm panel', icon: 'alarm' },
        ],
        server: 'Defender RM',
        badge: 'Shallow depth',
        title: 'Fits the cabinet',
        sub: 'Comms rooms, tight racks',
        points: ['10-year battery', 'AVR built in', 'Australian sockets'],
      },
      body: 'Security cabinets are often too shallow for a standard rack UPS. The Defender Rackmount 1500 is built for them, and the Ninja Slimline, a 600 VA LiFePO4 unit only 42 mm thick, fits switchboards and other tight spaces.',
    },
  ],

  rangeEyebrow: 'The range',
  rangeHeading: 'What PowerShield makes',
  range: [
    {
      title: 'Line-interactive and compact UPS',
      items: ['SafeGuard UPS', 'Defender, 650 to 2000 VA, tower and rackmount', 'Commander Tower and RT', 'Ninja Slimline LiFePO4 UPS', 'Pilot DC UPS for 24 V DC equipment'],
    },
    {
      title: 'True online UPS',
      items: ['Centurion Tower and RT', 'Centurion RT LiFePO4, standard and Long Run', 'Centurion Pro three-phase, 10 to 80 kVA', 'Platinum Modular systems'],
    },
    {
      title: 'Monitoring and comms',
      items: ['NetGuard monitoring software', 'SNMP Comms Card V4 and Cyber Secure SNMP', 'PSEMD temperature and humidity sensor', 'Relay and Modbus cards'],
    },
    {
      title: 'Power accessories',
      items: ['Extended battery modules and banks', 'Maintenance bypass switches', 'PDUs and automatic transfer switches', 'Surge boards, filters and diverters'],
    },
  ],

  architectureEyebrow: 'How it fits together',
  architectureHeading: 'PowerShield power behind a Teracom system',
  architectureArt: {
    type: 'architecture',
    alt: 'Recorders, network gear, door controllers, alarm panels and gate motors run from a PowerShield UPS that reports to the IT team, a manager and Teracom',
    columns: ['Protected kit', 'PowerShield', 'Kept informed'],
    devices: [
      { label: 'Recorders', sub: 'NVRs and servers', icon: 'server' },
      { label: 'Network', sub: 'Switches, routers', icon: 'switch' },
      { label: 'Door control', sub: 'Controllers, locks', icon: 'lock' },
      { label: 'Alarm panel', sub: 'Monitored comms', icon: 'alarm' },
      { label: 'Gate motors', sub: 'Automatic gates', icon: 'vehicle' },
    ],
    platforms: [
      { label: 'PowerShield UPS', sub: 'Clean, backed-up power', icon: 'battery' },
      { label: 'SNMP, NetGuard', sub: 'Status on the network', icon: 'cloud' },
      { label: 'PSEMD sensor', sub: 'Rack temp and humidity', icon: 'thermo' },
    ],
    people: [
      { label: 'IT team', sub: 'Network alerts', icon: 'laptop' },
      { label: 'Site manager', sub: 'Email on the phone', icon: 'phone' },
      { label: 'Teracom', sub: 'Batteries and service', icon: 'headset' },
    ],
    footer: 'Security and network equipment rides through blackouts while the UPS reports what it is doing',
  },
  architectureCaption: 'Recorders, switches, door controllers, alarm panels and gate motors sit behind a PowerShield UPS sized for the runtime you need. An SNMP card or NetGuard reports the power and the rack conditions, so the right people know as soon as the mains drops.',

  industriesHeading: 'Where we put it to work',
  industries: ['Security systems', 'Comms and server rooms', 'Government and defence', 'Healthcare', 'Mining', 'Industrial process control', 'Retail', 'Radio and broadcast'],

  teracomHeading: 'What Teracom does on a PowerShield job',
  teracom: [
    { title: 'Size it', body: 'The load of every recorder, switch and controller added up and the runtime worked out, then the model, battery type and any battery banks chosen to suit.' },
    { title: 'Install and commission', body: 'Racked or placed, wired to the right circuits and tested on battery, with SNMP cards and sensors set up on the network.' },
    { title: 'Connect to monitoring', body: 'On-battery and fault signals can be wired to the alarm panel, so a power loss reaches our monitoring centre.' },
    { title: 'Look after it', body: 'Battery checks and replacements on a maintenance plan, with products registered for the free warranty upgrade where it applies.' },
  ],

  links: [
    { label: 'PowerShield Centurion UPS range', href: 'https://powershield.com.au/solutions/centurion-ups-range/' },
    { label: 'NetGuard monitoring software', href: 'https://powershield.com.au/support-menu/download-area/netguard-software-downloads/' },
    { label: 'PowerShield free warranty upgrade', href: 'https://powershield.com.au/support-menu/3-year-warranty/' },
  ],
};

export default powershield;