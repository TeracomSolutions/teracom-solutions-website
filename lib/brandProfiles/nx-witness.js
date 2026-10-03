// The deeper Nx Witness brand page (Robert, 2026-10-01: build the brand pages
// out from each manufacturer's own site, with drawings of what the
// technology does rather than product photos).
// Written in our own words from networkoptix.com (October 2026); figures are
// Network Optix's own. Drawings are specs drawn by lib/brandArt.

const nxWitness = {
  heroArt: {
    type: 'hero',
    alt: 'An Nx Server hive recording cameras of any brand, moving cameras to another server when one fails and firing a rule',
    device: 'server',
    left: { title: 'Cameras', sub: 'Any IP brand', foot: '99% found automatically', icon: 'camera' },
    right: { title: 'Nx Desktop', sub: 'Plus mobile', foot: 'Remote through Nx Cloud', icon: 'laptop' },
    tags: [
      { text: 'Server down', tone: 'warn', icon: 'server' },
      { text: 'Cameras moved', tone: 'ok', icon: 'camera' },
      { text: 'Rule fired', tone: 'accent', icon: 'bolt' },
    ],
    chips: [
      { text: 'Server hive', tone: 'accent' },
      { text: 'Failover included', tone: 'ok' },
    ],
  },

  stats: [
    { value: '99%', label: 'of IP cameras on the market found automatically by Nx Server' },
    { value: '256', label: 'streams per Nx Server, with camera failover at no extra cost' },
    { value: '4M+', label: 'cameras and devices managed on Network Optix software worldwide' },
    { value: 'SOC 2', label: 'Type 2 compliance for the Nx Witness platform' },
  ],

  platformsEyebrow: 'How it runs',
  platformsHeading: 'Nx Witness on site, Nx Cloud for reaching it',
  platformsIntro: 'Nx Witness is software from Network Optix. The video is recorded on your own servers, and Nx Cloud is the remote layer that lets you reach every site from a browser or a phone. We size the servers and storage, and set up the cloud connection, to suit the site.',
  platforms: [
    {
      name: 'Nx Witness VMS',
      kicker: 'On-premises',
      art: {
        type: 'onPrem',
        alt: 'Cameras, old recorders, I/O modules and webcams recording to an Nx Server kept on site',
        devices: [
          { label: 'IP cameras', icon: 'camera' },
          { label: 'Old NVRs', icon: 'server' },
          { label: 'I/O inputs', icon: 'sensor' },
          { label: 'Webcams', icon: 'laptop' },
        ],
        server: 'Nx Server',
        badge: 'Failover included',
        title: 'Nx Witness',
        sub: 'Windows, Ubuntu or ARM',
        points: ['256 streams/server', 'Store anywhere', 'Rules engine'],
      },
      body: 'A lightweight media server that runs on Windows, Ubuntu Linux or ARM hardware, with the Nx Desktop client for viewing and admin. It finds most cameras by itself, can also take any RTSP, HTTP or UDP stream, and records to local disks, SD cards, NAS, SAN or cloud storage.',
      points: [
        'Nx Desktop shows up to 64 streams on one layout',
        'Old DVRs, NVRs and drones added as plain streams',
        'LDAP and Active Directory sign-in for users',
        'Password-protected exports and operator watermarks',
      ],
    },
    {
      name: 'Nx Cloud',
      kicker: 'Remote access',
      art: {
        type: 'cloud',
        alt: 'An office, a warehouse and a shop connecting their Nx Servers to Nx Cloud, viewed from a browser or the mobile app',
        title: 'Nx Cloud',
        sub: 'Every system, one login',
        badge: 'Unlimited systems',
        sites: [
          { label: 'Office', sub: 'Nx Server', icon: 'server' },
          { label: 'Warehouse', sub: 'Nx Server', icon: 'server' },
          { label: 'Shop', sub: 'ARM device', icon: 'camera' },
        ],
        clients: [
          { label: 'Browser', icon: 'laptop' },
          { label: 'App', icon: 'phone' },
        ],
      },
      body: 'Nx Cloud is the remote side of Nx Witness rather than a separate VMS. Each site’s servers connect to it, and you log in from a browser or the Nx Mobile app to watch, share and manage every system under one account.',
      points: [
        'Live and recorded video in a browser, nothing to install',
        'Video relayed through the cloud when a direct link is blocked',
        'Share a system with anyone by email, with set roles',
        'Health view of every connected system over the last 24 hours',
      ],
    },
  ],

  capabilitiesEyebrow: 'What it does',
  capabilitiesHeading: 'A VMS built to keep recording',
  capabilitiesIntro: 'Nx Witness is known for staying up and staying out of the way. These are the features that make the difference on real sites, from a single shop to a multi-server campus.',
  capabilities: [
    {
      title: 'Server hive and failover',
      art: {
        type: 'network',
        alt: 'Three Nx Servers sharing settings in a hive, with one offline and its cameras taken over by the other two',
        uplink: 'Nx Cloud',
        switchLabel: 'Nx server hive',
        switchSub: 'Settings synced live',
        ports: [
          { label: 'Server A', icon: 'server', tone: 'ok' },
          { label: 'Server B', icon: 'server', tone: 'alert' },
          { label: 'Server C', icon: 'server', tone: 'ok' },
          { label: 'Cams 1-40', icon: 'camera', tone: 'ok' },
          { label: 'Cams 41-80', icon: 'camera', tone: 'warn' },
          { label: 'Clients', icon: 'laptop', tone: 'ok' },
        ],
        caption: 'Server B is offline, so A and C pick up its cameras by themselves',
      },
      body: 'Every server in a system holds the same users and settings, so there is no master to lose. If one server or all of its storage fails, its cameras move to the others and clients reconnect, with no extra failover licence or hardware.',
    },
    {
      title: 'Search a year in a second',
      art: {
        type: 'search',
        alt: 'A smart motion search on part of one camera view returns the moments something moved there',
        query: 'Motion in the cash office doorway, last week',
        badge: '3 matches',
        results: [
          { label: 'Tue · 14:02', score: '0:42', highlight: true },
          { label: 'Thu · 09:15', score: '1:10' },
          { label: 'Sat · 22:47', score: '0:18' },
          { label: 'Bookmark · Fri', score: '2:05', kind: 'chart' },
        ],
        caption: 'Mark part of the picture and find every time something moved there',
      },
      body: 'Search a whole year of recordings in under a second by keyword, date, bookmark or smart motion, where you mark the part of the picture you care about. Bookmarks can be added by hand or automatically by rules.',
    },
    {
      title: 'Rules, alerts and soft triggers',
      art: {
        type: 'mobile',
        alt: 'A phone alert from an Nx rule when a dock door opens after hours, with a bookmark, an email and a call to another system',
        app: 'Nx Mobile',
        icon: 'door',
        tone: 'warn',
        notice: 'Door opened',
        sub: 'Dock door, after hours',
        time: 'Today 23:14',
        actions: ['Open camera', 'Soft trigger'],
        side: [
          { label: 'Bookmark', sub: 'Saved 30 s', icon: 'chart' },
          { label: 'Email', sub: 'Duty manager', icon: 'laptop' },
          { label: 'HTTP call', sub: 'Lights on', icon: 'bolt' },
        ],
      },
      body: 'Each server has an if-this-then-that rules engine. Events from cameras, I/O or other systems can bookmark video, send an email or SMS, open a layout or call another system over HTTP, and soft trigger buttons let an operator do the same by hand.',
    },
    {
      title: 'Store it anywhere',
      art: {
        type: 'storage',
        alt: 'Recordings kept on local drives, network storage or cloud storage, with a forecast of how long the space will last',
        tiers: [
          { label: 'Local drives and SD cards', sub: 'Recording on the server or camera', icon: 'server' },
          { label: 'NAS, iSCSI and SAN', sub: 'Shared storage on the network', icon: 'switch' },
          { label: 'Cloud storage', sub: 'Through the Storage SDK', icon: 'cloud' },
        ],
        active: 1,
        stat: '41 days',
        statLabel: 'Retention forecast',
        badge: 'Storage analytics',
        points: ['Automatic backup', 'Integrity check', 'Bitrate throttling'],
        caption: 'Recordings go where they suit the site, with space forecast ahead',
      },
      body: 'Video can be written to local disks, SD cards, NAS, iSCSI, SAN or cloud storage such as Wasabi. Storage analytics forecast how long the space will last, and viewers are warned if an archive has been changed or removed.',
    },
    {
      title: 'AI analytics your way',
      art: {
        type: 'dashboard',
        alt: 'An Nx AI Manager screen showing models deployed across servers and the object events they produce',
        title: 'Nx AI Manager',
        tiles: [
          { label: 'Models deployed', value: '3', tone: 'accent' },
          { label: 'Servers running', value: '12', tone: 'ok' },
          { label: 'Objects today', value: '1,912' },
          { label: 'Accelerator', value: 'Jetson', tone: 'muted' },
        ],
        bars: [140, 165, 152, 180, 171, 196, 188, 205],
        chart: 'Detections, 8 days',
        eventsTitle: 'Object events',
        events: [
          { text: 'Person at Gate 2', tone: 'warn' },
          { text: 'Vehicle at dock', tone: 'muted' },
          { text: 'Model updated on 12', tone: 'ok' },
          { text: 'Person in yard, 02:10', tone: 'alert' },
        ],
      },
      body: 'Nx AI Manager comes with recent servers and runs AI models on ordinary PCs, ARM boards or NVIDIA Jetson devices, updated remotely. Analytics already in Axis, Hanwha or Hikvision cameras, and third-party plugins, feed the same rules and search.',
    },
    {
      title: 'Cameras on the map',
      art: {
        type: 'map',
        alt: 'A site map with cameras, a gate, an I/O input and a server placed on it, and one camera raising an alert',
        markers: [
          { x: 12, y: 22, icon: 'camera', label: 'Entry' },
          { x: 30, y: 72, icon: 'camera', label: 'Car park' },
          { x: 52, y: 30, icon: 'server', label: 'Server' },
          { x: 66, y: 74, icon: 'sensor', label: 'Dock I/O' },
          { x: 86, y: 22, icon: 'camera', tone: 'alert', label: 'Yard' },
          { x: 88, y: 70, icon: 'vehicle', label: 'Gate' },
        ],
        caption: 'Every camera placed where it really is',
      },
      body: 'Nx Maps places cameras and devices on real maps, so an operator can see where an alert is coming from and open the right camera, with fisheye de-warping and point-and-click PTZ control once it is open.',
    },
  ],

  rangeEyebrow: 'The range',
  rangeHeading: 'What Network Optix makes',
  range: [
    {
      title: 'Nx Witness VMS',
      items: ['Nx Server for Windows, Ubuntu and ARM', 'Nx Desktop client, included with every system', 'Nx Mobile for iOS and Android', 'Server API and SDKs for integrations'],
    },
    {
      title: 'Cloud and remote',
      items: ['Nx Cloud remote access and sharing', 'Cloud relay for hard-to-reach sites', 'Health monitoring across systems', 'Nx Connect subscription portal for resellers'],
    },
    {
      title: 'Analytics and maps',
      items: ['Nx AI Manager for custom AI models', 'In-camera analytics from Axis, Hanwha and Hikvision', 'Third-party analytics plugins', 'Nx Maps geospatial view'],
    },
    {
      title: 'Other Nx products',
      items: ['Nx Go for transport and traffic, with ArcGIS', 'Nx Meta for developers building their own VMS', 'Nx Toolkit and tech partner integrations'],
    },
  ],

  architectureEyebrow: 'How it fits together',
  architectureHeading: 'A Teracom Nx Witness system, end to end',
  architectureArt: {
    type: 'architecture',
    alt: 'Cameras, old recorders and I/O inputs feed an Nx Server hive with Nx Cloud and AI Manager, and the desk, managers and Teracom monitoring act on it',
    devices: [
      { label: 'IP cameras', sub: 'Any major brand', icon: 'camera' },
      { label: 'Old NVRs and DVRs', sub: 'Added as streams', icon: 'server' },
      { label: 'I/O and sensors', sub: 'Rule inputs', icon: 'sensor' },
      { label: 'Storage', sub: 'NAS, SAN or cloud', icon: 'switch' },
    ],
    platforms: [
      { label: 'Nx Server hive', sub: 'Synced, with failover', icon: 'server' },
      { label: 'Nx Cloud', sub: 'Remote access, health', icon: 'cloud' },
      { label: 'Nx AI Manager', sub: 'Models at the edge', icon: 'chart' },
    ],
    people: [
      { label: 'Security desk', sub: 'Nx Desktop', icon: 'laptop' },
      { label: 'Managers', sub: 'Nx Mobile and browser', icon: 'phone' },
      { label: 'Teracom monitoring', sub: 'After-hours alarms', icon: 'headset' },
    ],
    footer: 'Any camera in, a self-healing server hive in the middle, and alarms to our monitoring centre after hours',
  },
  architectureCaption: 'Cameras, older recorders and I/O inputs feed a hive of Nx Servers that back each other up, with storage on site or in the cloud. Your team works from Nx Desktop, a browser or a phone through Nx Cloud, and alarms can come through to our monitoring centre after hours.',

  industriesHeading: 'Where we put it to work',
  industries: ['Retail', 'Hospitality', 'Schools and universities', 'Manufacturing', 'Healthcare', 'Local government', 'Transport', 'Remote monitored sites'],

  teracomHeading: 'What Teracom does on an Nx Witness job',
  teracom: [
    { title: 'Design', body: 'Camera positions, server count and storage worked out from the site drawings, with the hive sized so the remaining servers can carry the load if one stops.' },
    { title: 'Install and commission', body: 'Cameras mounted and cabled, servers built and joined to the hive, and recording, rules, failover and Nx Cloud access set up and tested on site.' },
    { title: 'Connect to monitoring', body: 'Alarms and analytics events can come through to our monitoring centre for after-hours response.' },
    { title: 'Look after it', body: 'Software updates, licence renewals and health checks handled on a maintenance plan, so the system stays current and supported.' },
  ],

  links: [
    { label: 'Nx Witness knowledge base', href: 'https://support.networkoptix.com/hc/en-us/categories/200190776-Nx-Witness-VMS' },
    { label: 'Nx Server technical specifications', href: 'https://www.networkoptix.com/nx-server' },
    { label: 'Nx software features', href: 'https://www.networkoptix.com/nx-software-features' },
  ],
};

export default nxWitness;