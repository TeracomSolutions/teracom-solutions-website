// The deeper DSC brand page (Robert, 2026-10-01: build the brand pages
// out from each manufacturer's own site, with drawings of what the
// technology does rather than product photos).
// Written in our own words from johnsoncontrols.com and the DSC technical
// documentation at docs.johnsoncontrols.com (October 2026; dsc.com itself
// blocks automated reading); figures are DSC's own. Drawings are specs drawn
// by lib/brandArt.

const dsc = {
  heroArt: {
    type: 'hero',
    alt: 'A DSC panel taking in wired zones and PowerG wireless devices, confirming an intruder with an image and showing the doors secure',
    device: 'alarm',
    left: { title: 'Wired zones', sub: 'Expanders', foot: 'Hardwired on the Corbus', icon: 'sensor' },
    right: { title: 'PowerG', sub: 'Two-way radio', foot: 'AES 128-bit encrypted', icon: 'wifi' },
    tags: [
      { text: 'Image sent', tone: 'accent', icon: 'camera' },
      { text: 'Intruder · Z12', tone: 'alert', icon: 'person' },
      { text: 'Doors secure', tone: 'ok', icon: 'door' },
    ],
    chips: [
      { text: 'Wired plus wireless', tone: 'accent' },
      { text: 'Verified alarms', tone: 'ok' },
    ],
  },

  stats: [
    { value: '248 zones', label: 'on PowerSeries Pro, the commercial panel in the DSC range' },
    { value: '1,000', label: 'user codes on both PowerSeries Neo and PowerSeries Pro' },
    { value: 'Grade 3', label: 'EN 50131 installations supported on PowerSeries Pro' },
    { value: '40 kg', label: 'pet immunity on the PowerG mirror-optic motion detector' },
  ],

  platformsEyebrow: 'Two panels, one wireless range',
  platformsHeading: 'PowerSeries Neo and PowerSeries Pro',
  platformsIntro: 'Both panels take the same PowerG wireless detectors, so the choice comes down to the size of the site and the standard it has to meet. We size the panel to the building and leave room to grow.',
  platforms: [
    {
      name: 'PowerSeries Neo',
      kicker: 'Hybrid wired and wireless',
      art: {
        type: 'panel',
        alt: 'A PowerSeries Neo keypad in stay mode, with wired and PowerG zones armed, an inside detector bypassed and an alarm at the back door',
        mode: 'Stay armed',
        modeTone: 'accent',
        status: 'Perimeter only',
        zones: [
          { name: 'Front door', state: 'armed', label: 'Wired · armed' },
          { name: 'Lounge PIR', state: 'bypassed', label: 'Stay bypass' },
          { name: 'Garage door', state: 'armed', label: 'PowerG · armed' },
          { name: 'Back door', state: 'alarm', label: 'Alarm 01:52' },
          { name: 'Hall smoke', state: 'secure', label: '24 h fire' },
          { name: 'Kitchen window', state: 'armed', label: 'PowerG · armed' },
        ],
      },
      body: 'A modular panel that mixes hardwired zones with PowerG wireless devices on the one system. Four models scale from 16 to 128 zones, with LCD, LED and icon keypads, wired or wireless, and proximity tags for arming without a code.',
      points: [
        '16, 32, 64 or 128 zones, up to eight on the board',
        'Up to 1,000 user codes',
        'IP and cellular communicators with AES 128-bit',
        'Arm, disarm and check status by SMS',
      ],
    },
    {
      name: 'PowerSeries Pro',
      kicker: 'Commercial grade',
      art: {
        type: 'map',
        alt: 'A warehouse floor plan with PowerG keypads, detectors, a repeater and a siren spread across it, and one detector on the mezzanine in alarm',
        markers: [
          { x: 8, y: 20, icon: 'pin', label: 'Keypad' },
          { x: 26, y: 78, icon: 'motion', label: 'Dock PIR' },
          { x: 48, y: 18, icon: 'sensor', label: 'Roller' },
          { x: 64, y: 72, icon: 'wifi', label: 'Repeater' },
          { x: 86, y: 24, icon: 'motion', tone: 'alert', label: 'Mezzanine' },
          { x: 93, y: 84, icon: 'speaker', label: 'Siren' },
        ],
        caption: 'PowerG across the whole warehouse',
      },
      body: 'Built for larger commercial sites, with Ethernet and a phone-line dialler on the board and a plug-in cellular module as a second path. Three models handle 32, 128 or 248 zones, wired through expanders or wireless through PowerG.',
      points: [
        'HS3032, HS3128 and HS3248 models',
        'Ethernet built in, cellular as primary or backup',
        'Supports EN 50131 Grade 3 installations',
        'Up to 16 keypads, including a touchscreen',
      ],
    },
  ],

  capabilitiesEyebrow: 'What it does',
  capabilitiesHeading: 'Fewer false alarms, faster answers',
  capabilitiesIntro: 'DSC puts its effort into making sure an alarm means something before anyone is sent out. These are the features that do that work on our sites.',
  capabilities: [
    {
      title: 'PowerG wireless',
      art: {
        type: 'network',
        alt: 'A PowerG transceiver linked to a motion detector, a door contact, a glass-break detector, a key fob, a siren and a repeater',
        switchLabel: 'HSM2HOST',
        switchSub: 'Two-way PowerG transceiver',
        ports: [
          { label: 'Motion', icon: 'motion' },
          { label: 'Contact', icon: 'sensor' },
          { label: 'Glass', icon: 'mic' },
          { label: 'Key fob', icon: 'fob' },
          { label: 'Siren', icon: 'speaker' },
          { label: 'Repeater', icon: 'wifi' },
        ],
        caption: 'Encrypted, two-way and supervised',
      },
      body: 'Every PowerG device talks both ways with the panel over an encrypted, frequency-hopping link and is supervised, so a flat battery or lost signal shows up as a fault. Mains-powered repeaters stretch coverage and carry 48 hours of backup battery.',
    },
    {
      title: 'Pictures with the alarm',
      art: {
        type: 'sensor',
        alt: 'A PowerG motion detector with a camera catches a person and sends images to the monitoring centre',
        icon: 'motion',
        target: 'person',
        label: 'PIR camera',
        sub: 'PowerG, day and night',
        coverage: 'Images go out with the alarm',
        events: [
          { text: 'Motion', sub: 'Zone 12 · 01:52', tone: 'alert' },
          { text: 'Images sent', sub: 'To monitoring', tone: 'warn' },
          { text: 'Person seen', sub: 'Patrol sent', tone: 'alert' },
        ],
      },
      body: 'Motion detectors with a built-in day and night camera capture a short set of images when they trigger, so the monitoring centre sees what set them off before deciding who to send. It needs a monitoring centre set up to receive them.',
    },
    {
      title: 'Two zones before it counts',
      art: {
        type: 'activity',
        alt: 'Everyday paths through an office fade back while one path that trips the hall and then the office is flagged as a confirmed alarm',
        place: 'Office',
        alert: 'Confirmed · 2 zones',
        note: 'Hall PIR, then office',
      },
      body: 'Sequential detection treats trips on two or more zones within a set time as a confirmed alarm, so one stray trip is not handled the same way as someone moving through the building.',
    },
    {
      title: 'People, not pets',
      art: {
        type: 'perimeter',
        alt: 'A detection line flags a person crossing it and ignores a dog',
        lineLabel: 'Pet-immune PIR',
        alert: 'Person detected',
        ignored: 'Pet under 40 kg',
      },
      body: 'Pet-immune PowerG detectors tell people from animals, with the mirror-optic model covering about 15 m at 90° and ignoring pets up to 40 kg. Outdoor models use eight separate PIR sensors to cut false trips.',
    },
    {
      title: 'Smoke, CO and flood on one panel',
      art: {
        type: 'panel',
        alt: 'A keypad showing a smoke alarm in the hall while heat, carbon monoxide, flood and temperature sensors read normal',
        mode: 'Fire alarm',
        modeTone: 'alert',
        status: 'Hall smoke · 03:20',
        zones: [
          { name: 'Hall smoke', state: 'alarm', label: 'Fire 03:20' },
          { name: 'Kitchen heat', state: 'secure', label: 'Normal' },
          { name: 'CO bedroom', state: 'secure', label: 'Normal' },
          { name: 'Laundry flood', state: 'secure', label: 'Dry' },
          { name: 'Server temp', state: 'secure', label: '21 °C' },
          { name: 'Front door', state: 'secure', label: 'Closed' },
        ],
      },
      body: 'PowerG smoke, heat, carbon monoxide, flood and temperature sensors join the same panel and report the same way as the intruder devices. They add early warning; they do not replace a fire system the building is required to have.',
    },
    {
      title: 'Doors and alarms together',
      art: {
        type: 'door',
        alt: 'A staff card at a Kantech reader arms the alarm area on the way out, with recent door and alarm events listed',
        credentials: [
          { label: 'Card', icon: 'card' },
          { label: 'PIN', icon: 'pin' },
          { label: 'Fob', icon: 'fob' },
        ],
        active: 0,
        result: 'Area armed',
        resultTone: 'ok',
        log: ['17:42 Card · arm', '17:41 Rear door', '17:30 Zone 4 shut', '08:03 Disarmed'],
      },
      body: 'Through Kantech EntraPass, a Neo panel’s zones and partitions sit on the same floor plans as the doors. Staff can arm or disarm with their access card, and alarm user codes are managed in one place.',
    },
  ],

  rangeEyebrow: 'The range',
  rangeHeading: 'What DSC makes',
  range: [
    {
      title: 'Panels',
      items: ['PowerSeries Neo HS2016, HS2032, HS2064 and HS2128', 'PowerSeries Pro HS3032, HS3128 and HS3248', 'Zone, output and power supply expanders'],
    },
    {
      title: 'Keypads and control',
      items: ['LCD, LED and icon keypads', 'Touchscreen keypad for PowerSeries Pro', 'Wireless keypads', 'Proximity tags and PowerG key fobs'],
    },
    {
      title: 'PowerG detection',
      items: ['Pet-immune, mirror-optic and dual-tech motion', 'Motion detectors with cameras', 'Outdoor and curtain PIRs', 'Door contacts, glass-break and shock', 'Smoke, heat, CO, flood and temperature'],
    },
    {
      title: 'Communication and sound',
      items: ['IP and cellular communicators', 'Audio verification module', 'Indoor and outdoor PowerG sirens', 'PowerG repeaters'],
    },
  ],

  architectureEyebrow: 'How it fits together',
  architectureHeading: 'A Teracom DSC system, end to end',
  architectureArt: {
    type: 'architecture',
    alt: 'PowerG and wired detectors, camera detectors and keypads report to a DSC panel and communicator, and on to monitoring, staff and the security desk',
    columns: ['On site', 'Panel', 'Who responds'],
    devices: [
      { label: 'PowerG detectors', sub: 'Motion, contacts', icon: 'motion' },
      { label: 'Wired zones', sub: 'Through expanders', icon: 'sensor' },
      { label: 'PIR cameras', sub: 'Images on alarm', icon: 'camera' },
      { label: 'Keypads', sub: 'Codes and prox tags', icon: 'pin' },
    ],
    platforms: [
      { label: 'PowerSeries Neo', sub: 'or PowerSeries Pro', icon: 'alarm' },
      { label: 'Communicator', sub: 'IP and cellular', icon: 'wifi' },
    ],
    people: [
      { label: 'Monitoring centre', sub: 'Verified alarms', icon: 'headset' },
      { label: 'Site staff', sub: 'Keypads and SMS', icon: 'phone' },
      { label: 'Security desk', sub: 'EntraPass maps', icon: 'laptop' },
    ],
    footer: 'Wired and PowerG devices report to one panel, which sends verified alarms out over IP and cellular',
  },
  architectureCaption: 'Wired zones and PowerG devices report to a PowerSeries Neo or Pro panel. Alarms, with images where a camera detector saw them, can come through over IP and cellular to our monitoring centre, and the panel can sit on the same EntraPass maps as your doors.',

  industriesHeading: 'Where we put it to work',
  industries: ['Homes', 'Shops and small business', 'Offices', 'Warehouses', 'Factories', 'Healthcare', 'Schools', 'Rural properties'],

  teracomHeading: 'What Teracom does on a DSC job',
  teracom: [
    { title: 'Design', body: 'Panel and expanders sized to the zone count, with every PowerG position signal-tested on site before a detector is mounted.' },
    { title: 'Install and commission', body: 'Wired and wireless devices installed, walk-tested and labelled by zone and partition, with keypads, prox tags and user codes set up for your staff.' },
    { title: 'Connect to monitoring', body: 'Alarms can come through to our monitoring centre over IP and cellular, with images from camera detectors where the site has them.' },
    { title: 'Look after it', body: 'Batteries, firmware and code changes handled on a maintenance plan, with wireless supervision flagging a weak device before it fails.' },
  ],

  links: [
    { label: 'PowerG wireless technology', href: 'https://www.johnsoncontrols.com/security/intrusion-detection/powerg-wireless-technology' },
    { label: 'PowerG wireless detectors', href: 'https://www.johnsoncontrols.com/security/intrusion-detection/residential-security/powerg-wireless-security-detectors' },
    { label: 'DSC technical documentation', href: 'https://docs.johnsoncontrols.com/dsc/' },
  ],
};

export default dsc;