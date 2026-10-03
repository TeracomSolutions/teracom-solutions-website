// The deeper Genetec brand page (Robert, 2026-10-01: build the brand pages
// out from each manufacturer's own site, with drawings of what the
// technology does rather than product photos).
// Written in our own words from genetec.com (October 2026); figures are
// Genetec's own. Drawings are specs drawn by lib/brandArt.

const genetec = {
  heroArt: {
    type: 'hero',
    alt: 'Genetec Security Center taking in cameras, doors and plate readers and showing operators a door, a plate hit and an intercom call in one place',
    device: 'shield',
    left: { title: 'Devices', sub: 'Cameras, doors', foot: '10,000+ supported', icon: 'camera' },
    right: { title: 'Operators', sub: 'One interface', foot: 'Desktop, web and mobile', icon: 'laptop' },
    tags: [
      { text: 'Door held open', tone: 'alert', icon: 'door' },
      { text: 'Plate on list', tone: 'warn', icon: 'vehicle' },
      { text: 'Intercom call', tone: 'ok', icon: 'mic' },
    ],
    chips: [
      { text: 'Unified platform', tone: 'accent' },
      { text: 'On-premises or SaaS', tone: 'ok' },
    ],
  },

  stats: [
    { value: '10,000+', label: 'cameras, encoders and other devices from many makers supported' },
    { value: '900+', label: 'integrations Mission Control can draw on, from BMS to public address' },
    { value: '200+', label: 'security settings already hardened on every Streamvault appliance' },
    { value: 'SOC 2', label: 'plus ISO 27001 and ISO 27017 compliance for Security Center SaaS' },
  ],

  platformsEyebrow: 'Two ways to run it',
  platformsHeading: 'Security Center on site, or as a service',
  platformsIntro: 'Genetec is a software company first. The same unified platform can run on servers you own, as a cloud subscription, or as a mix of the two, and both work with cameras and door hardware from many makers. We help you choose on site count, bandwidth, retention, existing hardware and IT policy.',
  platforms: [
    {
      name: 'Genetec Security Center',
      kicker: 'On-premises',
      art: {
        type: 'onPrem',
        alt: 'Cameras, doors, plate cameras and intercoms running into Security Center on a Streamvault appliance kept on site',
        devices: [
          { label: 'Cameras', icon: 'camera' },
          { label: 'Doors', icon: 'door' },
          { label: 'Plates', icon: 'vehicle' },
          { label: 'Intercoms', icon: 'mic' },
        ],
        server: 'Streamvault',
        badge: 'Hardened appliance',
        title: 'Security Center',
        sub: 'On Streamvault or your own',
        points: ['Omnicast video', 'Synergis access', 'AutoVu plates'],
      },
      body: 'The on-premises platform. Video, access control, plate recognition, intercoms and intrusion panels run as modules of one system, on your own servers or a preloaded Streamvault appliance, and operators learn a single interface instead of several.',
      points: [
        'Omnicast for video, Synergis for doors, AutoVu for plates',
        'Sipelia brings intercoms and calls onto the same screen',
        'Intrusion panels and industrial IoT data shown alongside',
        'Federation joins many sites into one central view',
      ],
    },
    {
      name: 'Security Center SaaS',
      kicker: 'Cloud',
      art: {
        type: 'cloud',
        alt: 'A head office, a branch and existing doors connecting through Cloudlink appliances to Security Center SaaS, used from a browser or phone',
        title: 'Security Center',
        sub: 'Delivered as a service',
        badge: 'Updates roll out for you',
        sites: [
          { label: 'Head office', sub: 'Cloudlink 210', icon: 'server' },
          { label: 'Branch', sub: 'Cloudlink 110', icon: 'server' },
          { label: 'Depot', sub: 'Existing doors', icon: 'door' },
        ],
        clients: [
          { label: 'Browser', icon: 'laptop' },
          { label: 'App', icon: 'phone' },
        ],
      },
      body: 'The same unified system as a cloud subscription. Existing cameras and door hardware can stay in place, Cloudlink appliances handle video, access and intrusion at the edge, and updates and fixes are delivered remotely.',
      points: [
        'Pay for camera connections, door connections or a mix',
        'Cloudlink 110, 210 and 2210 appliances at the edge',
        'Run fully in the cloud or alongside on-premises servers',
        'Web, mobile and desktop apps shaped to each role',
      ],
    },
  ],

  capabilitiesEyebrow: 'What it does',
  capabilitiesHeading: 'One system doing the work of several',
  capabilitiesIntro: 'The point of Genetec is that video, doors, plates and alarms share one database and one screen. These are the parts of the platform our customers notice most in day-to-day use.',
  capabilities: [
    {
      title: 'Faster investigations',
      art: {
        type: 'search',
        alt: 'A plain description of a person and a ute finds matching moments across several cameras',
        query: 'Red jacket near a white ute, last night',
        badge: '4 results',
        results: [
          { label: 'Dock 2 · 22:41', score: '93%', highlight: true },
          { label: 'Gate · 22:36', score: '88%' },
          { label: 'Car park · 22:30', score: '74%' },
          { label: 'White ute, Bay 4', score: '69%', kind: 'vehicle' },
        ],
        caption: 'Describe what you are after and search across every device at once',
      },
      body: 'In Security Center SaaS, an investigator can describe what they are looking for and get matching moments from across the whole system, then build a case and share it with the right people without leaving the interface.',
    },
    {
      title: 'AutoVu plate recognition',
      art: {
        type: 'plate',
        alt: 'A fixed AutoVu SharpV camera reads a white ute at a gate and matches it to a hotlist',
        plate: '2KD 7MF',
        confidence: 'White ute, SharpV',
        status: 'On hotlist',
        statusTone: 'alert',
        lines: ['Alert sent to desk', 'Video clip attached'],
      },
      body: 'Fixed SharpV and mobile SharpZ3 cameras read plates day and night and can also estimate speed, vehicle type and colour. Hotlist hits arrive with the video beside them, and partial plates can still be searched.',
    },
    {
      title: 'Synergis access control',
      art: {
        type: 'door',
        alt: 'A phone credential at a reader opens a door, with each entry logged against the cardholder',
        credentials: [
          { label: 'Card', icon: 'card' },
          { label: 'Mobile', icon: 'phone' },
          { label: 'Fob', icon: 'fob' },
          { label: 'Visitor', icon: 'person' },
        ],
        active: 1,
        result: 'Access granted',
        resultTone: 'ok',
        log: ['08:02 Main entry', '08:05 Lift lobby', '08:40 Comms room', '19:12 Door held'],
      },
      body: 'Enrol staff and visitors, issue cards or mobile credentials and set who can go where and when. Works with readers and controllers from Axis, HID, STid and others, and a door alarm opens with the camera that covers it.',
    },
    {
      title: 'Mission Control incidents',
      art: {
        type: 'dashboard',
        alt: 'An incident screen showing open incidents, automated tasks and the steps of a response playbook',
        title: 'Mission Control',
        tiles: [
          { label: 'Open incidents', value: '3', tone: 'warn' },
          { label: 'Auto-dispatched', value: '14', tone: 'ok' },
          { label: 'Events filtered', value: '1,280', tone: 'muted' },
          { label: 'SOP compliance', value: '98%', tone: 'accent' },
        ],
        bars: [12, 9, 14, 11, 8, 10, 7, 6],
        chart: 'Incidents, 8 weeks',
        eventsTitle: 'Playbook steps',
        events: [
          { text: 'Gas alarm, Level 2', tone: 'alert' },
          { text: 'PA message played', tone: 'ok' },
          { text: 'Guards dispatched', tone: 'accent' },
          { text: 'Area cleared', tone: 'muted' },
        ],
      },
      body: 'Mission Control sorts real incidents from routine noise, walks operators through each step of the response plan and hands routine jobs out automatically. Rules are built with drag and drop rather than custom code.',
    },
    {
      title: 'Maps and alarm handling',
      art: {
        type: 'map',
        alt: 'A site map with cameras, doors, an intercom and a plate camera placed on it, and one door in alarm',
        markers: [
          { x: 12, y: 24, icon: 'camera', label: 'Foyer' },
          { x: 34, y: 70, icon: 'door', tone: 'alert', label: 'Fire exit' },
          { x: 58, y: 26, icon: 'reader', label: 'Lift lobby' },
          { x: 64, y: 72, icon: 'mic', label: 'Intercom' },
          { x: 86, y: 20, icon: 'camera', label: 'Dock' },
          { x: 88, y: 76, icon: 'vehicle', label: 'Gate LPR' },
        ],
        caption: 'Doors, cameras and plates on one map',
      },
      body: 'Cameras, doors, intercoms and plate readers sit on live maps and dashboards, so an operator sees where an alarm is, opens the nearest camera and acts on it from the same window.',
    },
    {
      title: 'Clearance evidence sharing',
      art: {
        type: 'storage',
        alt: 'Footage from Security Center, body-worn cameras and phones gathered into one Clearance case and shared with authorised people',
        tiers: [
          { label: 'Security Center video', sub: 'Clips pulled into a case', icon: 'camera' },
          { label: 'Phones and body-worn', sub: 'Uploads from the field', icon: 'phone' },
          { label: 'Clearance case', sub: 'Shared only with approved people', icon: 'lock' },
        ],
        active: 2,
        stat: 'Audited',
        statLabel: 'Every share is logged',
        badge: 'Encrypted transfer',
        points: ['No more DVDs', 'Retention schedules', 'Review in a browser'],
        caption: 'Evidence from any source kept together in one case',
      },
      body: 'Clearance collects video, photos, audio and documents into cases and shares them with police, insurers or other parties through a link rather than a DVD, with retention rules and an audit trail. EPA Victoria is one Australian user.',
    },
  ],

  rangeEyebrow: 'The range',
  rangeHeading: 'What Genetec makes',
  range: [
    {
      title: 'Security Center modules',
      items: ['Omnicast video management', 'Synergis access control', 'AutoVu licence plate recognition', 'Sipelia intercom and communications', 'Mission Control incident management'],
    },
    {
      title: 'Cloud services',
      items: ['Security Center SaaS', 'Video surveillance as a service', 'Access control as a service', 'Clearance digital evidence management', 'ClearID physical access management'],
    },
    {
      title: 'Appliances',
      items: ['Streamvault entry-level, up to 50 cameras', 'Streamvault rackmount, up to 672 TB', 'Streamvault workstations for video walls', 'Cloudlink 110, 210 and 2210 for SaaS'],
    },
    {
      title: 'Door and plate hardware',
      items: ['Synergis Cloud Link gateway', 'Axis Powered by Genetec door controllers', 'AutoVu SharpV fixed plate cameras', 'AutoVu SharpZ3 mobile plate cameras'],
    },
  ],

  architectureEyebrow: 'How it fits together',
  architectureHeading: 'A Teracom Genetec system, end to end',
  architectureArt: {
    type: 'architecture',
    alt: 'Cameras, readers, plate cameras, intercoms and alarm panels report to Security Center on site or in the cloud, watched by the desk, managers and Teracom',
    devices: [
      { label: 'Cameras', sub: 'Many brands', icon: 'camera' },
      { label: 'Door readers', sub: 'Synergis controllers', icon: 'reader' },
      { label: 'Plate cameras', sub: 'AutoVu SharpV', icon: 'vehicle' },
      { label: 'Intercoms', sub: 'Through Sipelia', icon: 'mic' },
      { label: 'Intrusion panels', sub: 'Panel integration', icon: 'alarm' },
    ],
    platforms: [
      { label: 'Security Center', sub: 'Streamvault on site', icon: 'server' },
      { label: 'SaaS option', sub: 'Cloudlink at the edge', icon: 'cloud' },
      { label: 'Mission Control', sub: 'Incident playbooks', icon: 'chart' },
    ],
    people: [
      { label: 'Security desk', sub: 'Desktop client', icon: 'laptop' },
      { label: 'Managers', sub: 'Web and mobile', icon: 'phone' },
      { label: 'Teracom monitoring', sub: 'After-hours alarms', icon: 'headset' },
    ],
    footer: 'Video, doors, plates, intercoms and alarms in one system, and alarms to our monitoring centre after hours',
  },
  architectureCaption: 'Cameras, door readers, plate cameras, intercoms and alarm panels all report to Security Center, either on a Streamvault appliance on site or through Cloudlink to the SaaS platform. Your team works from the desktop client, the web or a phone, and alarms can come through to our monitoring centre after hours.',

  industriesHeading: 'Where we put it to work',
  industries: ['Airports and transport', 'Data centres', 'Local government', 'Hospitals', 'Universities and schools', 'Stadiums and venues', 'Energy and utilities', 'Retail'],

  teracomHeading: 'What Teracom does on a Genetec job',
  teracom: [
    { title: 'Design', body: 'Cameras, doors and plate readers planned from the site drawings, with the right Security Center modules, licences and Streamvault or Cloudlink hardware chosen before anything is ordered.' },
    { title: 'Install and commission', body: 'Devices mounted, cabled and enrolled, cardholders and schedules loaded, and maps, alarms and plate lists set up and tested on site.' },
    { title: 'Connect to monitoring', body: 'Door, intrusion and video alarms can come through to our monitoring centre for after-hours response.' },
    { title: 'Look after it', body: 'Software and firmware updates, licence renewals and health checks handled on a maintenance plan, so the system stays current and supported.' },
  ],

  links: [
    { label: 'Genetec TechDocs', href: 'https://techdocs.genetec.com/' },
    { label: 'Genetec supported device list', href: 'https://www.genetec.com/supported-device-list' },
    { label: 'Streamvault appliances', href: 'https://www.genetec.com/products/unified-security/streamvault' },
  ],
};

export default genetec;