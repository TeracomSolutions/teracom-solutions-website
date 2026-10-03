// The deeper Cisco brand page (Robert, 2026-10-01: build the brand pages
// out from each manufacturer's own site, with drawings of what the
// technology does rather than product photos).
// Written in our own words from cisco.com and documentation.meraki.com
// (October 2026); figures are Cisco's own. Drawings are specs drawn by
// lib/brandArt.

const cisco = {
  heroArt: {
    type: 'hero',
    alt: 'A Cisco switch powering cameras, readers and Wi-Fi access points, run from Catalyst Center on site or the Meraki dashboard in the cloud',
    device: 'switch',
    left: { title: 'Catalyst', sub: 'Run on site', foot: 'Up to Catalyst Center', icon: 'server' },
    right: { title: 'Meraki', sub: 'Cloud console', foot: 'One dashboard, all sites', icon: 'cloud' },
    tags: [
      { text: 'PoE camera', tone: 'ok', icon: 'camera' },
      { text: 'Door reader', tone: 'ok', icon: 'reader' },
      { text: 'Wi-Fi 7 AP', tone: 'accent', icon: 'wifi' },
    ],
    chips: [
      { text: 'Cloud or on site', tone: 'accent' },
      { text: '802.1X port security', tone: 'ok' },
    ],
  },

  stats: [
    { value: '8 to 48', label: 'ports across the Catalyst 1200 and 1300 small business switches' },
    { value: 'Up to 90 W', label: 'of PoE per port on Catalyst 9300 models' },
    { value: 'Wi-Fi 7', label: 'on current Cisco access points, indoor and outdoor' },
    { value: 'Lifetime', label: 'limited hardware warranty on Catalyst 1200 and 1300 switches' },
  ],

  platformsEyebrow: 'Two ways to manage it',
  platformsHeading: 'Catalyst on site, or Meraki in the cloud',
  platformsIntro: 'Cisco makes switches and access points for both styles of management. We choose on the size of the site, who will look after the network day to day, and whether you want everything run from a browser.',
  platforms: [
    {
      name: 'Cisco Catalyst',
      kicker: 'Managed on site',
      art: {
        type: 'onPrem',
        alt: 'Cameras, readers, access points and phones on a Catalyst network that is managed entirely from inside the building',
        devices: [
          { label: 'Cameras', icon: 'camera' },
          { label: 'Readers', icon: 'reader' },
          { label: 'Access pts', icon: 'wifi' },
          { label: 'Phones', icon: 'phone' },
        ],
        server: 'Catalyst',
        badge: 'No cloud needed',
        title: 'On your network',
        sub: 'Managed from your own site',
        points: ['Web UI or CLI', 'Business Dashboard', 'Catalyst Center'],
      },
      body: 'Switches and wireless set up and watched from inside your own network, from the built-in web page on a small switch through to Catalyst Center across a campus.',
      points: [
        'Catalyst 1200 and 1300: 8 to 48 port switches with no licence to buy',
        'Catalyst 9200 and 9300: stackable switches for larger buildings',
        'Cisco Business Dashboard to keep an eye on several small sites',
        'Catalyst Center for automation and network health at scale',
      ],
    },
    {
      name: 'Cisco Meraki',
      kicker: 'Cloud-managed',
      art: {
        type: 'cloud',
        alt: 'Three Victorian sites connected to the Meraki dashboard and managed from a browser or the phone app',
        title: 'Meraki dashboard',
        sub: 'One login for every site',
        badge: 'Firmware from the cloud',
        sites: [
          { label: 'Melbourne', sub: 'Head office', icon: 'switch' },
          { label: 'Geelong', sub: 'Warehouse', icon: 'camera' },
          { label: 'Ballarat', sub: 'Branch', icon: 'wifi' },
        ],
        clients: [
          { label: 'Browser', icon: 'laptop' },
          { label: 'App', icon: 'phone' },
        ],
      },
      body: 'Every Meraki device is configured, monitored and fixed from one web dashboard. Wireless, switching, security appliances, cameras and sensors sit side by side, and many Catalyst switches can now join the same dashboard.',
      points: [
        'MR access points and MS switches',
        'MX security appliances with SD-WAN between branches',
        'MV smart cameras and MT environmental sensors',
        'MG cellular gateways for sites without a fixed line',
      ],
    },
  ],

  capabilitiesEyebrow: 'Under the security system',
  capabilitiesHeading: 'What the network actually does',
  capabilitiesIntro: 'Cameras, readers and intercoms are only as dependable as the network they run on. These are the Cisco features that matter most on our jobs.',
  capabilities: [
    {
      title: 'Power over Ethernet',
      art: {
        type: 'network',
        alt: 'A Catalyst switch sending power and data down one cable each to cameras, a reader, an access point, an intercom and a phone',
        uplink: 'Core',
        switchLabel: 'Catalyst 1200',
        switchSub: 'PoE+ on every port',
        ports: [
          { label: 'Camera', icon: 'camera' },
          { label: 'Bullet', icon: 'bullet' },
          { label: 'Reader', icon: 'reader' },
          { label: 'Wi-Fi 7', icon: 'wifi' },
          { label: 'Intercom', icon: 'speaker' },
          { label: 'Phone', icon: 'phone' },
        ],
        caption: 'One cable carries power and data to each device',
      },
      body: 'One cable carries power and data to each camera, reader and access point. Catalyst 1200 switches keep power flowing while the switch itself restarts, and ports can be powered down on a schedule.',
    },
    {
      title: 'Ports that set themselves',
      art: {
        type: 'search',
        alt: 'A switch recognises a camera, an access point, a phone and another switch and sets each port to suit',
        query: 'What is plugged into ports 1 to 8?',
        badge: '4 roles set',
        results: [
          { label: 'Port 2 · camera', score: 'Cam', highlight: true, kind: 'camera' },
          { label: 'Port 5 · AP', score: 'AP', kind: 'wifi' },
          { label: 'Port 6 · phone', score: 'Voice', kind: 'phone' },
          { label: 'Port 8 · switch', score: 'Link', kind: 'switch' },
        ],
        caption: 'Each port is set up for the device it finds',
      },
      body: 'Catalyst 1200 and 1300 switches recognise what is plugged in and configure the port to suit. Auto Surveillance VLAN puts camera traffic on its own lane, away from office traffic.',
    },
    {
      title: 'One dashboard',
      art: {
        type: 'dashboard',
        alt: 'The Meraki dashboard for one office showing switches, access points, client numbers and the latest network events',
        title: 'Melbourne office network',
        tiles: [
          { label: 'Switches online', value: '12/12', tone: 'ok' },
          { label: 'Access points', value: '38' },
          { label: 'Wi-Fi clients', value: '412' },
          { label: 'PoE in use', value: '1.9 kW' },
        ],
        bars: [220, 380, 402, 395, 412, 160, 90, 410],
        chart: 'Clients by day',
        eventsTitle: 'Latest',
        events: [
          { text: 'New camera, port 9', tone: 'ok' },
          { text: 'AP Level 3 offline', tone: 'warn' },
          { text: 'AP Level 3 back up', tone: 'ok' },
          { text: 'Firmware set for 2 am', tone: 'accent' },
        ],
      },
      body: 'Meraki devices are provisioned, watched and troubleshot from one web dashboard, for one site or many. Catalyst 9200 and 9300 switches can be brought into the same view.',
    },
    {
      title: 'Wi-Fi 7 and location',
      art: {
        type: 'map',
        alt: 'Access points placed across a floor plan, with a tagged trolley located between them and a cool room being monitored',
        markers: [
          { x: 10, y: 20, icon: 'wifi', label: 'AP 1' },
          { x: 50, y: 14, icon: 'wifi', label: 'AP 2' },
          { x: 88, y: 18, icon: 'wifi', label: 'AP 3' },
          { x: 14, y: 80, icon: 'wifi', label: 'AP 4' },
          { x: 58, y: 82, icon: 'wifi', label: 'AP 5' },
          { x: 88, y: 76, icon: 'thermo', label: 'Cool room' },
          { x: 36, y: 50, icon: 'pin', tone: 'warn', label: 'Trolley 7' },
        ],
        caption: 'Cisco Spaces locates tagged equipment',
      },
      body: 'Wi-Fi 7 access points cover the inside of the building and the Cisco Wireless 9177 handles outdoor areas. Cisco Spaces, a cloud service, adds real-time location of tagged assets and environmental readings.',
    },
    {
      title: 'Cameras with their own storage',
      art: {
        type: 'storage',
        alt: 'Video kept on the Meraki camera itself, with motion-based retention and an optional cloud archive behind it',
        tiers: [
          { label: 'On the camera', sub: '256 GB to 4 TB built in', icon: 'camera' },
          { label: 'Motion-based retention', sub: 'Full recording for the last 72 hours', icon: 'server' },
          { label: 'Cloud Archive', sub: 'Optional copy, up to 365 days', icon: 'cloud' },
        ],
        active: 0,
        stat: '4 TB',
        statLabel: 'On the largest camera',
        badge: 'Edge storage',
        points: ['Motion search', 'People and vehicles', 'Review at up to 32x'],
        caption: 'Cameras keep recording if the internet drops',
      },
      body: 'Meraki MV cameras record to storage inside each camera, from 256 GB to 4 TB depending on the model, so there is no separate recorder in the rack. Motion search, people and vehicle detection and an optional Cloud Archive run from the same dashboard.',
    },
    {
      title: 'Sensors for the comms room',
      art: {
        type: 'sensor',
        alt: 'Meraki sensors in a comms room reporting a warm rack, a dry floor and a closed cabinet',
        icon: 'thermo',
        target: 'server',
        label: 'MT sensors',
        sub: 'Comms room, Level 2',
        coverage: 'Heat, humidity, leaks and doors',
        events: [
          { text: 'Rack 31°C', sub: 'MT10 · 02:14', tone: 'warn' },
          { text: 'Floor dry', sub: 'MT12 leak cable', tone: 'ok' },
          { text: 'Cabinet shut', sub: 'MT20 · no tamper', tone: 'ok' },
        ],
      },
      body: 'Meraki MT sensors keep watch over the places the network lives: temperature and humidity, water leaks, cabinet doors opening, air quality and power use, all reported to the Meraki dashboard.',
    },
  ],

  rangeEyebrow: 'The range',
  rangeHeading: 'The Cisco gear we work with',
  range: [
    {
      title: 'Switching',
      items: ['Catalyst 1200 and 1300 for small sites', 'Catalyst 9200 and 9300 stackable access switches', 'Catalyst 9500 and 9600 for the network core', 'Meraki MS cloud-managed switches', 'Industrial Ethernet: DIN rail and IP67 models'],
    },
    {
      title: 'Wireless',
      items: ['Wi-Fi 7 indoor access points', 'Cisco Wireless 9177 outdoor access points', 'Meraki MR access points', 'Wireless controllers and Campus Gateway'],
    },
    {
      title: 'Routing and security',
      items: ['Catalyst SD-WAN routers', 'Meraki MX security and SD-WAN appliances', 'Meraki MG cellular gateways'],
    },
    {
      title: 'Cameras and sensors',
      items: ['Meraki MV smart cameras, indoor and outdoor', 'MT10 and MT11 temperature sensors', 'MT12 water leak sensors', 'MT20 open and close sensors'],
    },
  ],

  architectureEyebrow: 'How it fits together',
  architectureHeading: 'A Teracom Cisco network, end to end',
  architectureArt: {
    type: 'architecture',
    alt: 'Cameras, readers, access points and sensors on a Cisco network run from Catalyst Center or the Meraki dashboard, used by IT, security and Teracom',
    devices: [
      { label: 'IP cameras', sub: 'PoE from the switch', icon: 'camera' },
      { label: 'Door readers', sub: 'On their own VLAN', icon: 'reader' },
      { label: 'Access points', sub: 'Wi-Fi 7', icon: 'wifi' },
      { label: 'MT sensors', sub: 'Comms room', icon: 'thermo' },
    ],
    platforms: [
      { label: 'Catalyst Center', sub: 'Managed on site', icon: 'server' },
      { label: 'Meraki dashboard', sub: 'Managed in the cloud', icon: 'cloud' },
    ],
    people: [
      { label: 'IT team', sub: 'Browser or app', icon: 'laptop' },
      { label: 'Security desk', sub: 'Cameras and doors', icon: 'camera' },
      { label: 'Teracom', sub: 'Upkeep and support', icon: 'headset' },
    ],
    footer: 'Security devices run on a Cisco network managed on site, in the cloud, or a mix of both',
  },
  architectureCaption: 'Cameras, readers, access points and sensors plug into Cisco switches. The network is run from Catalyst Center on site or the Meraki dashboard in the cloud, and your IT team and security desk each see the parts they need.',

  industriesHeading: 'Where we put it to work',
  industries: ['Commercial offices', 'Schools and universities', 'Healthcare', 'Retail chains', 'Warehousing and logistics', 'Government', 'Manufacturing', 'Multi-site businesses'],

  teracomHeading: 'What Teracom does on a Cisco job',
  teracom: [
    { title: 'Design', body: 'Switch sizes, PoE budgets, VLANs and access point positions planned around every camera, reader and intercom on the drawings.' },
    { title: 'Install and commission', body: 'Switches racked and patched, access points mounted, and every port labelled and tested before the security devices go live.' },
    { title: 'Connect to monitoring', body: 'Alarm panels and cameras on the Cisco network can report through to our monitoring centre, with the path tested end to end.' },
    { title: 'Look after it', body: 'Firmware updates, Meraki and Catalyst licence renewals and health checks handled on a maintenance plan.' },
  ],

  links: [
    { label: 'Cisco Meraki documentation', href: 'https://documentation.meraki.com/' },
    { label: 'Catalyst 1200 series support and documents', href: 'https://www.cisco.com/c/en/us/support/switches/catalyst-1200-series-switches/series.html' },
    { label: 'Cisco product warranties', href: 'https://www.cisco.com/c/en/us/products/warranty-listing.html' },
  ],
};

export default cisco;