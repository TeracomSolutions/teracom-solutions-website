// The deeper Milestone brand page (Robert, 2026-10-01: build the brand pages
// out from each manufacturer's own site, with drawings of what the
// technology does rather than product photos).
// Written in our own words from milestonesys.com (October 2026); figures are
// Milestone's own. Drawings are specs drawn by lib/brandArt.

const milestone = {
  heroArt: {
    type: 'hero',
    alt: 'An XProtect server taking video from cameras of many brands and serving it to operators, with plate, evidence and door events below',
    device: 'server',
    left: { title: 'Cameras', sub: 'Many brands', foot: '17,000+ devices', icon: 'camera' },
    right: { title: 'Operators', sub: 'Smart Client', foot: 'Plus web and mobile', icon: 'laptop' },
    tags: [
      { text: 'Plate on list', tone: 'warn', icon: 'vehicle' },
      { text: 'Evidence lock', tone: 'ok', icon: 'lock' },
      { text: 'Door forced', tone: 'alert', icon: 'door' },
    ],
    chips: [
      { text: 'Open platform', tone: 'accent' },
      { text: 'BriefCam analytics', tone: 'ok' },
    ],
  },

  stats: [
    { value: '500,000+', label: 'customer sites running XProtect worldwide' },
    { value: '17,000+', label: 'cameras and devices with official XProtect drivers' },
    { value: '4 editions', label: 'of XProtect, from Express+ for small sites up to Corporate' },
    { value: '5 years', label: 'standard warranty on every Husky IVO recording appliance' },
  ],

  platformsEyebrow: 'Two ways to run it',
  platformsHeading: 'XProtect on site, or Arcules in the cloud',
  platformsIntro: 'Milestone makes software rather than cameras, so both platforms work with the cameras you choose. XProtect runs on servers you control, Arcules runs as a cloud service, and the two can be combined in a hybrid setup. We help you pick on site count, bandwidth, retention and IT policy.',
  platforms: [
    {
      name: 'Milestone XProtect',
      kicker: 'On-premise',
      art: {
        type: 'onPrem',
        alt: 'Cameras, doors, plate cameras and sensors recording to an XProtect server kept on site',
        devices: [
          { label: 'Cameras', icon: 'camera' },
          { label: 'Doors', icon: 'door' },
          { label: 'Plate reads', icon: 'vehicle' },
          { label: 'Sensors', icon: 'sensor' },
        ],
        server: 'XProtect',
        badge: 'Perpetual licence',
        title: 'On your servers',
        sub: 'Husky, your own or AWS',
        points: ['Failover servers', 'Signed exports', 'Federated sites'],
      },
      body: 'Video management software that runs on your own servers, on a Milestone Husky appliance or hosted on AWS. It records and manages cameras from a long list of manufacturers and grows from one building to linked systems across many sites.',
      points: [
        'Express+, Professional+, Expert and Corporate editions',
        'Smart Client, Web Client and XProtect Mobile for viewing',
        'Evidence Lock and digital signing protect exported footage',
        'Interconnect and Federated Architecture join many sites',
      ],
    },
    {
      name: 'Arcules',
      kicker: 'Cloud (VSaaS)',
      art: {
        type: 'cloud',
        alt: 'Three sites sending video to Arcules in the cloud, watched from a browser or the mobile app',
        title: 'Arcules',
        sub: 'Video as a cloud service',
        badge: 'Updates handled for you',
        sites: [
          { label: 'Head office', sub: 'Gateway', icon: 'server' },
          { label: 'Depot', sub: 'Cloud cameras', icon: 'camera' },
          { label: 'Retail store', sub: 'Gateway', icon: 'server' },
        ],
        clients: [
          { label: 'Browser', icon: 'laptop' },
          { label: 'App', icon: 'phone' },
        ],
      },
      body: 'Milestone’s subscription cloud service for video, run from a browser or a phone. Cameras connect through a small gateway or straight to the cloud, updates arrive by themselves, and many existing cameras can stay in place.',
      points: [
        'Gateway, edge or camera-to-cloud recording',
        'People, vehicle, line crossing and plate analytics',
        'Ask assistant searches footage in plain language',
        'Pairs with XProtect for hybrid systems',
      ],
    },
  ],

  capabilitiesEyebrow: 'Analytics and tools',
  capabilitiesHeading: 'What the software actually does',
  capabilitiesIntro: 'BriefCam is part of Milestone, so serious video analytics sit next to the VMS rather than coming from a separate supplier. These are the features that save the most time on real jobs.',
  capabilities: [
    {
      title: 'BriefCam search and review',
      art: {
        type: 'search',
        alt: 'A search for a person in a hi-vis vest heading east returns matches from several cameras',
        query: 'Hi-vis vest, heading east, after 6 pm',
        badge: '4 matches',
        results: [
          { label: 'Dock 3 · 18:42', score: '94%', highlight: true },
          { label: 'Gate · 18:37', score: '89%' },
          { label: 'Car park · 18:20', score: '77%' },
          { label: 'Ute · Bay 2', score: '64%', kind: 'vehicle' },
        ],
        caption: 'BriefCam searches every camera by look, direction and behaviour',
      },
      body: 'Search hours of footage by appearance, object type, direction or behaviour across many cameras at once. Video Synopsis overlays a whole shift of activity into a short clip, so an investigator sees everything without watching every minute.',
    },
    {
      title: 'Alerts on behaviour',
      art: {
        type: 'activity',
        alt: 'Normal movement through a loading dock fades out while one person lingering is flagged',
        place: 'Dock 3',
        alert: 'Loitering · 5 min',
        note: 'Usual paths ignored',
      },
      body: 'BriefCam Protect raises alerts on rules you set for people, vehicles, crowds and behaviour, such as someone lingering at a dock door, so operators see the events that matter instead of every movement.',
    },
    {
      title: 'Licence plate recognition',
      art: {
        type: 'plate',
        alt: 'A car at a boom gate has its plate read by XProtect LPR and matched to an allow list',
        plate: '1AB 2CD',
        confidence: 'Confidence 97%',
        status: 'On allow list',
        statusTone: 'ok',
        lines: ['Boom gate raised', 'Logged in XProtect'],
      },
      body: 'The XProtect LPR extension reads plates at gates and car parks, checks them against lists and can raise a boom or an alarm. BriefCam adds plate matching to its own searches too.',
    },
    {
      title: 'Maps and alarm handling',
      art: {
        type: 'map',
        alt: 'A floor plan with cameras, doors and a gate placed on it, and one camera raising an alarm',
        markers: [
          { x: 12, y: 22, icon: 'camera', label: 'Foyer' },
          { x: 38, y: 68, icon: 'door', label: 'Store' },
          { x: 62, y: 28, icon: 'camera', tone: 'alert', label: 'Alarm' },
          { x: 86, y: 74, icon: 'vehicle', label: 'Gate' },
          { x: 84, y: 18, icon: 'camera', label: 'Yard' },
        ],
        caption: 'Alarms shown on the site map',
      },
      body: 'Cameras, doors and sensors are placed on site maps, and the Alarm Manager brings every alarm into one list, so an operator can see where something is happening and open the right camera straight away.',
    },
    {
      title: 'Footage you can trust',
      art: {
        type: 'storage',
        alt: 'Recordings kept on the recording server and camera storage, with incident clips held under Evidence Lock',
        tiers: [
          { label: 'Recording server', sub: 'Day-to-day recordings', icon: 'server' },
          { label: 'Edge storage', sub: 'Camera card fills network gaps', icon: 'camera' },
          { label: 'Evidence Lock', sub: 'Held until released', icon: 'lock' },
        ],
        active: 2,
        stat: 'Signed',
        statLabel: 'Every export is',
        badge: 'Tamper-evident',
        points: ['Kept from deletion', 'Encrypted database', 'Evidence Manager cases'],
        caption: 'Clips tied to an incident are held back from normal clean-up',
      },
      body: 'Evidence Lock stops important video being deleted when normal retention runs out, digital signing proves an export has not been altered, and the media database can be encrypted.',
    },
    {
      title: 'Failover and system health',
      art: {
        type: 'dashboard',
        alt: 'A health screen showing cameras online, recording servers and a failover taking over a failed server',
        title: 'XProtect system health',
        tiles: [
          { label: 'Cameras online', value: '248', tone: 'ok' },
          { label: 'Rec. servers', value: '6' },
          { label: 'Failover ready', value: '2', tone: 'accent' },
          { label: 'Alarms today', value: '3', tone: 'warn' },
        ],
        bars: [42, 38, 45, 51, 47, 55, 49, 53],
        chart: 'Storage used, 8 wks',
        eventsTitle: 'Recent events',
        events: [
          { text: 'Server 3 failed over', tone: 'warn' },
          { text: 'Recording resumed', tone: 'ok' },
          { text: 'Camera 41 offline', tone: 'alert' },
          { text: 'Firmware updated', tone: 'muted' },
        ],
      },
      body: 'Hot and cold failover recording servers take over if one stops, and Expert and Corporate add management server failover. Dashboards and XProtect Remote Manager show the health of every site in one place.',
    },
  ],

  rangeEyebrow: 'The range',
  rangeHeading: 'What Milestone makes',
  range: [
    {
      title: 'XProtect VMS',
      items: ['Express+ for small sites', 'Professional+ and Expert', 'Corporate for large, critical sites', 'LPR and access control extensions', 'Smart Client, Web Client and Mobile'],
    },
    {
      title: 'BriefCam analytics',
      items: ['Investigator for file-based review', 'Rapid Review for fast VMS searches', 'Protect for alerts and dashboards', 'Insights for multi-site analytics', 'Face and plate recognition modules'],
    },
    {
      title: 'Arcules cloud',
      items: ['Gateway recording with edge storage', 'Camera-to-cloud connection', 'Web and mobile clients', 'Hybrid with XProtect'],
    },
    {
      title: 'Husky appliances',
      items: ['Husky IVO for XProtect, desktop to 2U rack', 'Up to 250 channels and 384 TB (IVO 1800R)', 'Husky XA and XE for BriefCam', 'Husky GW gateway for Arcules'],
    },
  ],

  architectureEyebrow: 'How it fits together',
  architectureHeading: 'A Teracom Milestone system, end to end',
  architectureArt: {
    type: 'architecture',
    alt: 'Cameras, plate cameras, door readers and sensors report to XProtect, BriefCam and Arcules, and the security desk, managers and Teracom monitoring act on them',
    devices: [
      { label: 'Cameras', sub: 'Any supported brand', icon: 'camera' },
      { label: 'Plate cameras', sub: 'XProtect LPR', icon: 'vehicle' },
      { label: 'Door readers', sub: 'Access extension', icon: 'reader' },
      { label: 'Sensors and I/O', sub: 'Alarm inputs', icon: 'sensor' },
    ],
    platforms: [
      { label: 'XProtect', sub: 'Husky or own servers', icon: 'server' },
      { label: 'BriefCam', sub: 'Search and alerts', icon: 'chart' },
      { label: 'Arcules', sub: 'Cloud sites, optional', icon: 'cloud' },
    ],
    people: [
      { label: 'Security desk', sub: 'Smart Client', icon: 'laptop' },
      { label: 'Managers', sub: 'Web and mobile', icon: 'phone' },
      { label: 'Teracom monitoring', sub: 'After-hours alarms', icon: 'headset' },
    ],
    footer: 'Any supported camera in, one VMS in the middle, and alarms through to our monitoring centre after hours',
  },
  architectureCaption: 'Cameras, plate cameras, readers and sensors report to XProtect on site, with BriefCam for analytics and Arcules for cloud sites if you need them. Your team works from Smart Client, the web or a phone, and alarms can come through to our monitoring centre after hours.',

  industriesHeading: 'Where we put it to work',
  industries: ['Airports and transport', 'Hospitals', 'Schools and universities', 'Local government', 'Manufacturing', 'Retail', 'Hotels and casinos', 'Critical infrastructure'],

  teracomHeading: 'What Teracom does on a Milestone job',
  teracom: [
    { title: 'Design', body: 'Camera positions, server sizing and storage worked out from the site drawings, and the right XProtect edition chosen before anything is ordered.' },
    { title: 'Install and commission', body: 'Cameras mounted and cabled, device packs and firmware matched, and recording rules, failover and analytics set up and tested on site.' },
    { title: 'Connect to monitoring', body: 'Alarms and analytics events can come through to our monitoring centre for after-hours response.' },
    { title: 'Look after it', body: 'Software and device pack updates, licence renewals and health checks handled on a maintenance plan, so the system stays current and supported.' },
  ],

  links: [
    { label: 'Milestone documentation portal', href: 'https://doc.milestonesys.com/' },
    { label: 'XProtect supported devices', href: 'https://www.milestonesys.com/support/software/supported-devices/' },
    { label: 'Husky IVO recording appliances', href: 'https://www.milestonesys.com/products/hardware/husky-hardware/vms-powerhouse/' },
  ],
};

export default milestone;