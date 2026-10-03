// The deeper Paradox brand page (Robert, 2026-10-01: build the brand pages
// out from each manufacturer's own site, with drawings of what the
// technology does rather than product photos).
// Written in our own words from paradox.com (October 2026) and the Paradox
// entry in brands.js (EVO, IP150+ and Insite Gold, which the current
// paradox.com no longer details); figures are Paradox's own. Drawings are
// specs drawn by lib/brandArt.

const paradox = {
  heroArt: {
    type: 'hero',
    alt: 'A Paradox M25 console taking in wireless detector events and sending an alarm straight to the monitoring centre and the BlueEye app',
    device: 'alarm',
    left: { title: 'Detectors', sub: 'M wireless', foot: 'Encrypted, two-way', icon: 'motion' },
    right: { title: 'BlueEye', sub: 'Phone app', foot: 'Arm, disarm, alerts', icon: 'phone' },
    tags: [
      { text: 'Motion · Z3', tone: 'alert', icon: 'motion' },
      { text: 'Water leak', tone: 'warn', icon: 'sensor' },
      { text: 'To monitoring', tone: 'ok', icon: 'headset' },
    ],
    chips: [
      { text: 'Direct to monitoring', tone: 'ok' },
      { text: 'PoE, Wi-Fi and LTE', tone: 'accent' },
    ],
  },

  stats: [
    { value: '1 cable', label: 'powers and connects the M25 console over PoE, with no extra supply' },
    { value: '3 paths', label: 'Ethernet, Wi-Fi and built-in LTE on the M25 LTE, with failover' },
    { value: '128 users', label: 'and up to 10 partitions on a single M25 console' },
    { value: '26 hours', label: 'of M25 battery backup on Ethernet (24 on Wi-Fi, 20 on LTE)' },
  ],

  platformsEyebrow: 'Two systems',
  platformsHeading: 'The M25 console, or the EVO panel',
  platformsIntro: 'The M25 is Paradox’s new wireless-first console, for homes and smaller commercial sites that want a quick install and control from a phone. EVO is the established wired panel for sites that want doors and alarms in one system. We help you choose on the building, the cabling already there and whether doors need to be part of it.',
  platforms: [
    {
      name: 'M25 hybrid console',
      kicker: 'Wireless-first',
      art: {
        type: 'network',
        alt: 'An M25 LTE console linked to motion detectors, door contacts, a keypad, a siren, a camera and a repeater, and on to the monitoring centre',
        uplink: 'To CMS',
        switchLabel: 'M25 LTE console',
        switchSub: 'PoE, Wi-Fi, LTE failover',
        ports: [
          { label: 'Motion', icon: 'motion', tone: 'accent' },
          { label: 'Contacts', icon: 'sensor', tone: 'accent' },
          { label: 'Keypad', icon: 'pin', tone: 'ok' },
          { label: 'Siren', icon: 'speaker', tone: 'ok' },
          { label: 'Camera', icon: 'camera', tone: 'muted' },
          { label: 'Repeater', icon: 'wifi', tone: 'muted' },
        ],
        caption: 'One PoE cable to install; devices added by QR scan or auto-learn',
      },
      body: 'Paradox’s newest system: a compact wireless console that runs from a single PoE cable and reaches the monitoring centre over Ethernet, Wi-Fi or its own LTE modem, with no cloud in the reporting path. Devices are added by QR scan or auto-learn, and firmware updates arrive over the air.',
      points: [
        'Up to 10 partitions and 128 users on one console',
        'Two-way encrypted M wireless with frequency hopping',
        'Reports straight to monitoring on up to 4 channels',
        'BlueEye app for owners, Service Company Portal for installers',
      ],
    },
    {
      name: 'Digiplex EVO',
      kicker: 'Wired, with doors built in',
      art: {
        type: 'door',
        alt: 'A staff card at an EVO door reader opens the door and disarms that area, with the evening arming and locking logged',
        credentials: [
          { label: 'Card', icon: 'card' },
          { label: 'PIN', icon: 'pin' },
          { label: 'Fob', icon: 'fob' },
        ],
        active: 0,
        result: 'Area disarmed',
        resultTone: 'ok',
        log: ['07:58 Card, door 3', '07:58 Area 2 off', '18:05 Area 2 armed', '18:04 Door 3 shut'],
      },
      body: 'Paradox’s established wired platform, built on the encrypted Digiplex bus the company introduced in 1996. EVO runs intrusion and access control from one panel and one user list, so opening a door can disarm its area without a second system. The IP150+ module adds remote arming, zone status and output control through the Insite Gold app.',
      points: [
        'Up to 32 doors from the panel’s own user database',
        'Encrypted, expandable bus for keypads and modules',
        'IP150+ internet module secured with SSL/HTTPS',
        'Reports to IPC10 receivers from IP150+ firmware 6.0',
      ],
    },
  ],

  capabilitiesEyebrow: 'What it does',
  capabilitiesHeading: 'Alarms that reach the right people',
  capabilitiesIntro: 'Paradox makes the detectors, the panels and the receivers at the monitoring end, and sells only through distributors and installers. These are the features we set up most often.',
  capabilities: [
    {
      title: 'Direct to the monitoring centre',
      art: {
        type: 'onPrem',
        alt: 'M25, IP150+, IP180 and LTE communicators reporting straight to an IPC10 receiver at the monitoring centre with no cloud in between',
        devices: [
          { label: 'M25', icon: 'alarm' },
          { label: 'IP150+', icon: 'wifi' },
          { label: 'IP180', icon: 'wifi' },
          { label: 'PCS265V8', icon: 'phone' },
        ],
        server: 'IPC10',
        badge: 'No cloud in path',
        title: 'Monitoring centre',
        sub: '5,000 accounts, 1U rack',
        points: ['AES 128-bit', '90 s supervision', 'Buffers 10k events'],
      },
      body: 'Paradox panels and communicators report over IP or LTE straight to an IPC10 receiver at the monitoring centre, with no cloud service in between. Each 1U receiver handles up to 5,000 accounts, can check on sites every 90 seconds, encrypts with AES 128-bit and holds 10,000 events if the monitoring software goes down.',
    },
    {
      title: 'Pet-immune motion',
      art: {
        type: 'perimeter',
        alt: 'A motion detector in a lounge flags a person crossing its zone and ignores the family dog',
        lineLabel: 'PMD75M · lounge',
        alert: 'Person · zone 3',
        ignored: 'Dog · ignored',
      },
      body: 'M detectors such as the PMD75M use two opposed infrared sensors with real pet immunity, cover about 11 by 11 metres and run six years or more on their batteries. Outdoor models include a curtain detector with anti-masking, and firmware updates arrive over the air through BlueEye.',
    },
    {
      title: 'Video with the alarm',
      art: {
        type: 'mobile',
        alt: 'A BlueEye alert with a clip from an HD10 camera in the rear yard, with buttons to view the clip or talk, beside its recording, night vision and audio',
        app: 'BlueEye',
        icon: 'camera',
        tone: 'alert',
        notice: 'Alarm · video',
        sub: 'Rear yard · HD10',
        time: 'Today 2:31 am',
        actions: ['View clip', 'Talk'],
        side: [
          { label: 'Clip', sub: 'Up to 5 min', icon: 'camera' },
          { label: 'Night', sub: 'IR + white LED', icon: 'bolt' },
          { label: 'Two-way', sub: 'Audio', icon: 'mic' },
        ],
      },
      body: 'The HD10 is a 2 MP indoor and outdoor camera that records when the system goes into alarm, up to five minutes per event to its own microSD card. It has IR and white-light night vision and two-way audio, and keeps a stream free for the monitoring centre after an alarm. Video verification for up to 16 cameras per M25 is listed as coming soon.',
    },
    {
      title: 'Water leak shut-off',
      art: {
        type: 'sensor',
        alt: 'A water detector in a laundry finds a leak and the WV2M valve shuts off the main supply, with an alert sent to the app',
        icon: 'sensor',
        target: 'alarm',
        label: 'WD2M + WV2M',
        sub: 'Leak sensor and valve',
        coverage: 'Valve closes about 6 s after a leak',
        events: [
          { text: 'Leak detected', sub: 'Laundry · 03:12', tone: 'alert' },
          { text: 'Valve closed', sub: 'Main supply', tone: 'ok' },
          { text: 'Push alert', sub: 'BlueEye app', tone: 'warn' },
        ],
      },
      body: 'Water detectors can trigger the WV2M wireless valve to shut off the supply, or it can run on a schedule. The valve reports open, closed or stuck, can be turned by hand if power or radio is lost, and exercises itself after long idle spells so it does not seize.',
    },
    {
      title: 'Arming that fits the building',
      art: {
        type: 'panel',
        alt: 'An M25 in sleep mode with the perimeter and lounge armed, the hallway bypassed, bedrooms left open and the shed armed as its own partition',
        mode: 'Sleep armed',
        modeTone: 'accent',
        status: 'Bedrooms open',
        zones: [
          { name: 'Front door', state: 'armed', label: 'Armed' },
          { name: 'Garage', state: 'armed', label: 'Armed' },
          { name: 'Lounge PIR', state: 'armed', label: 'Armed' },
          { name: 'Hallway PIR', state: 'bypassed', label: 'Sleep bypass' },
          { name: 'Bedroom 1', state: 'secure', label: 'Not armed' },
          { name: 'Shed', state: 'armed', label: 'Partition 2' },
        ],
      },
      body: 'Stay, Sleep and Full arming suit homes and small businesses, and areas can arm themselves on a schedule or when no movement is seen. Up to ten partitions let a shed, a granny flat or a shopfront arm on its own.',
    },
    {
      title: 'Set up and serviced remotely',
      art: {
        type: 'cloud',
        alt: 'An installer managing M25 systems at a home, a café and a workshop through the Service Company Portal and the BlueEye app',
        title: 'Service Portal',
        sub: 'For registered installers',
        badge: 'Owner-granted access',
        sites: [
          { label: 'Home', sub: 'M25, 14 zones', icon: 'alarm' },
          { label: 'Café', sub: 'M25 LTE', icon: 'alarm' },
          { label: 'Workshop', sub: 'M25 + repeater', icon: 'alarm' },
        ],
        clients: [
          { label: 'Portal', icon: 'laptop' },
          { label: 'BlueEye', icon: 'phone' },
        ],
      },
      body: 'Installers register with a Paradox Service Company ID and look after their sites through the Service Company Portal and BlueEye, with access that is permanent or granted by the owner. A system can be pre-loaded by serial number before the visit and finished on site in minutes.',
    },
  ],

  rangeEyebrow: 'The range',
  rangeHeading: 'What Paradox makes',
  range: [
    {
      title: 'Consoles and keypads',
      items: ['M25 and M25 LTE consoles', 'K70M 7-inch touchscreen keypad', 'K38M wireless LCD keypad', 'RPT5M wireless repeater', 'Zone and output expanders'],
    },
    {
      title: 'Detection',
      items: ['Indoor, pet-immune and dual-optic motion', 'Outdoor and curtain detectors with anti-mask', 'Door and window contacts', '10-year smoke detector', 'Water detectors'],
    },
    {
      title: 'Video, sound and control',
      items: ['HD10 alarm verification camera', 'Indoor and outdoor sirens', 'Chime and sound player', 'Wireless remotes and panic buttons', 'WV2M water shut-off valve'],
    },
    {
      title: 'Communication and software',
      items: ['IPC10 and VIPC20 monitoring receivers', 'BlueEye app', 'Service Company Portal', 'EVO, MG and SP panels with IP150+ and IP180 modules'],
    },
  ],

  architectureEyebrow: 'How it fits together',
  architectureHeading: 'A Teracom Paradox system, end to end',
  architectureArt: {
    type: 'architecture',
    alt: 'Paradox detectors, an HD10 camera, keypads and a leak valve report to an M25 or EVO panel, which signals monitoring, owners and the installer',
    columns: ['On site', 'Panel', 'Who responds'],
    devices: [
      { label: 'M detectors', sub: 'Motion, contacts', icon: 'motion' },
      { label: 'HD10 camera', sub: 'Clips on alarm', icon: 'camera' },
      { label: 'Keypads', sub: 'Touchscreen, LCD', icon: 'pin' },
      { label: 'Leak valve', sub: 'WV2M shut-off', icon: 'sensor' },
    ],
    platforms: [
      { label: 'M25 or EVO', sub: 'Alarms and doors', icon: 'alarm' },
      { label: 'IP or LTE path', sub: 'Direct to receiver', icon: 'wifi' },
    ],
    people: [
      { label: 'Teracom monitoring', sub: 'After-hours alarms', icon: 'headset' },
      { label: 'Owners and staff', sub: 'BlueEye app', icon: 'phone' },
      { label: 'Installer', sub: 'Service Portal', icon: 'laptop' },
    ],
    footer: 'Detectors report to the panel, which signals the monitoring centre directly over IP or LTE',
  },
  architectureCaption: 'Paradox detectors, cameras and keypads report to an M25 or EVO panel. Alarms can come through over IP or LTE to our monitoring centre, owners run the system from BlueEye, and installers can service it through the Service Company Portal.',

  industriesHeading: 'Where we put it to work',
  industries: ['Homes', 'Shops and cafés', 'Offices', 'Workshops and small warehouses', 'Farms and rural properties', 'Holiday homes', 'Clubs and community buildings'],

  teracomHeading: 'What Teracom does on a Paradox job',
  teracom: [
    { title: 'Design', body: 'Console or panel, detectors and repeaters planned from the floor plan, with each wireless position signal-tested before anything is mounted.' },
    { title: 'Install and commission', body: 'Devices learned in, walk-tested and named by zone and partition, with users, arming modes and the BlueEye app set up for you.' },
    { title: 'Connect to monitoring', body: 'Alarms can come through to our monitoring centre over IP and LTE for after-hours response.' },
    { title: 'Look after it', body: 'Batteries, firmware and user changes handled on a maintenance plan, with wireless supervision flagging a weak or missing device early.' },
  ],

  links: [
    { label: 'Paradox M system catalogue', href: 'https://www.paradox.com/web/products/' },
    { label: 'M25 console specifications', href: 'https://www.paradox.com/web/product/m25-m25-lte/' },
    { label: 'How the M25 is installed', href: 'https://www.paradox.com/web/how-it-works/' },
  ],
};

export default paradox;