// The deeper C•CURE brand page (Robert, 2026-10-01: build the brand pages
// out from each manufacturer's own site, with drawings of what the
// technology does rather than product photos).
// Written in our own words from swhouse.com (October 2026); figures are
// Software House’s own. Drawings are specs drawn by lib/brandArt.

const ccure = {
  heroArt: {
    type: 'hero',
    alt: 'A C•CURE 9000 server at the centre, fed by iSTAR G2 door controllers and run from the C•CURE IQ browser client, handling doors, visitors and video',
    device: 'server',
    left: { title: 'iSTAR G2', sub: 'Door control', foot: 'Up to 32 readers each', icon: 'switch' },
    right: { title: 'C•CURE IQ', sub: 'Any browser', foot: 'Access, video, incidents', icon: 'laptop' },
    tags: [
      { text: 'Door forced', tone: 'alert', icon: 'door' },
      { text: 'Visitor in', tone: 'ok', icon: 'person' },
      { text: 'Video linked', tone: 'accent', icon: 'camera' },
    ],
    chips: [
      { text: '5,000 readers a server', tone: 'accent' },
      { text: 'FIPS 140-3 controllers', tone: 'ok' },
    ],
  },

  stats: [
    { value: '5,000', label: 'readers and 1,000,000 credentials on a single C•CURE server' },
    { value: '60', label: 'satellite application servers under one Enterprise master' },
    { value: '32 readers', label: 'on one iSTAR Ultra G2 controller, with a million cardholders' },
    { value: '30,000+', label: 'organisations around the world run Software House systems' },
  ],

  platformsEyebrow: 'Software and hardware',
  platformsHeading: 'C•CURE in the control room, iSTAR at the door',
  platformsIntro: 'C•CURE is the software that holds the cardholders, rules and events. iSTAR controllers make the decisions at the door and keep working if the network drops. We size both together from the door schedule.',
  platforms: [
    {
      name: 'C•CURE 9000 and C•CURE IQ',
      kicker: 'Software',
      art: {
        type: 'onPrem',
        alt: 'iSTAR controllers, readers, cameras and power supplies on site reporting to a C•CURE 9000 server, run from a web browser',
        devices: [
          { label: 'iSTAR G2', icon: 'switch' },
          { label: 'Readers', icon: 'reader' },
          { label: 'Cameras', icon: 'camera' },
          { label: 'PSX power', icon: 'battery' },
        ],
        server: 'C•CURE 9000',
        badge: 'Or C•CURE Cloud',
        title: 'C•CURE IQ client',
        sub: 'Runs in any web browser',
        points: ['5,000 readers', '1M credentials', '60 satellites'],
      },
      body: 'C•CURE 9000 is the access control and event management system. C•CURE IQ, included in the standard licence, puts it in a web browser and adds video, incident handling and dashboards, so operators can work from any desk.',
      points: [
        'One server for a single site, or an Enterprise master with up to 60 satellites',
        'On site, hybrid, or C•CURE Cloud in a dedicated single-tenant cloud',
        'C•CURE Portal for visitors and self-service access requests',
        'C•CURE High Assurance for government smart card credentials',
      ],
    },
    {
      name: 'iSTAR G2 controllers',
      kicker: 'Controllers',
      art: {
        type: 'network',
        alt: 'An iSTAR Ultra G2 controller feeding readers, a door module, a lock, an exit button and a power supply, with one door in alarm',
        uplink: 'C•CURE',
        switchLabel: 'iSTAR Ultra G2',
        switchSub: 'OSDP, TLS 1.3, FIPS 140-3',
        ports: [
          { label: 'Reader in', icon: 'reader', tone: 'ok' },
          { label: 'Reader out', icon: 'reader', tone: 'ok' },
          { label: 'IP-ACM v2', icon: 'door', tone: 'ok' },
          { label: 'Mag lock', icon: 'lock', tone: 'ok' },
          { label: 'PSX power', icon: 'battery', tone: 'ok' },
          { label: 'Fire door', icon: 'door', tone: 'alert' },
        ],
        caption: 'Each controller holds its own cardholder list and decides at the door',
      },
      body: 'The second generation of iSTAR controllers is hardened for enterprise and government sites. Readers talk to them over the OSDP secure channel, the network link uses TLS 1.3, and each holds its own database of up to a million cardholders.',
      points: [
        'iSTAR Ultra G2 for up to 32 readers, with an SE model for retrofits',
        'iSTAR Edge G2 for up to eight doors at a smaller site',
        'IP-ACM v2 puts one door and two readers on the network near the door',
        'RM and OSDP boards run doors up to 1,200 m from the controller',
      ],
    },
  ],

  capabilitiesEyebrow: 'What it does',
  capabilitiesHeading: 'More than opening doors',
  capabilitiesIntro: 'C•CURE runs on large sites where the access system is also the alarm desk, the visitor desk and the source of the audit trail. These are the parts our customers use most.',
  capabilities: [
    {
      title: 'Alarms sorted by what matters',
      art: {
        type: 'dashboard',
        alt: 'A C•CURE IQ dashboard showing open incidents, door alarms through the day and a short list of the alarms that need action',
        title: 'C•CURE IQ · Incidents',
        tiles: [
          { label: 'Open incidents', value: '3', tone: 'alert' },
          { label: 'Door alarms', value: '27', tone: 'warn' },
          { label: 'Auto-cleared', value: '22', tone: 'ok' },
          { label: 'Doors online', value: '412', tone: 'accent' },
        ],
        bars: [2, 1, 4, 6, 3, 5, 4, 2],
        chart: 'Door alarms by hour',
        eventsTitle: 'Needs action',
        events: [
          { text: 'Fire door forced L2', tone: 'alert' },
          { text: 'Plant room held open', tone: 'warn' },
          { text: 'Lost card used, Foyer', tone: 'alert' },
          { text: 'Dock door closed', tone: 'ok' },
        ],
      },
      body: 'Incident management in C•CURE IQ turns events into steps for the operator to follow, and Security Intelligence ranks alarms so the few that need someone rise to the top. Dashboards show trends such as which doors alarm most often.',
    },
    {
      title: 'Video beside every event',
      art: {
        type: 'activity',
        alt: 'Normal foot traffic through a loading area fades out while one person lingering at the dock door is flagged by camera analytics',
        place: 'Dock',
        alert: 'Lingering at dock door',
        note: 'Illustra analytics',
      },
      body: 'C•CURE IQ has its own video management, and C•CURE 9000 works with American Dynamics and Exacq recorders out of the box. Illustra cameras add analytics such as loitering, objects left behind, crowds forming and wrong-way movement.',
    },
    {
      title: 'Visitors booked ahead',
      art: {
        type: 'door',
        alt: 'A staff card, a visitor pass, a contractor card and a phone at a reader, with the visitor pass letting a booked guest in',
        credentials: [
          { label: 'Staff', icon: 'card' },
          { label: 'Visitor', icon: 'person' },
          { label: 'Contractor', icon: 'card' },
          { label: 'Phone', icon: 'phone' },
        ],
        active: 1,
        result: 'Visitor in',
        resultTone: 'ok',
        log: ['09:02 Visitor, L1', '08:58 Self sign-in', '08:40 Pass issued', '08:10 Staff, L1'],
      },
      body: 'C•CURE Portal lets hosts register guests in advance and lets guests sign themselves in. Each visitor gets a temporary credential that only works where and when it should, and every visit stays in the audit trail.',
    },
    {
      title: 'Access requests without the paperwork',
      art: {
        type: 'prompt',
        alt: 'A staff request for lab access becomes a clearance, approved by the lab manager and applied without manual keying',
        heading: 'Access Management Workflow',
        prompt: 'Please add me to the Level 4 lab clearance for my project',
        cards: [
          { label: 'Clearance', value: 'Level 4 lab', sub: 'Business hours' },
          { label: 'Approver', value: 'Lab manager', sub: 'Approves in Portal' },
          { label: 'Policy', value: 'Applied', sub: 'No manual keying' },
        ],
      },
      body: 'Staff ask for access themselves through C•CURE Portal, the right person approves it, and the clearance is applied without the security team keying it in. Company rules are applied the same way every time.',
    },
    {
      title: 'Roll call in your hand',
      art: {
        type: 'mobile',
        alt: 'The C•CURE Go Reader on an Android handheld running a roll call at an assembly area, with three people still to be found',
        app: 'C•CURE Go Reader',
        icon: 'person',
        tone: 'warn',
        notice: '3 unaccounted',
        sub: 'Assembly area B',
        time: 'Works offline',
        actions: ['Scan card', 'Missing list'],
        side: [
          { label: 'Muster', sub: 'Roll call', icon: 'person' },
          { label: 'Checkpoint', sub: 'In and out', icon: 'map' },
          { label: 'Gate', sub: 'Card checks', icon: 'card' },
        ],
      },
      body: 'The C•CURE Go Reader turns an Android handheld into a reader. Wardens use it for roll call at evacuation points, guards for checks at gates and remote areas, and it keeps working offline and syncs when back in range.',
    },
    {
      title: 'Power you can see',
      art: {
        type: 'power',
        alt: 'Mains power feeding a PSX supply that keeps an iSTAR controller, door locks and readers running, with battery health shown in C•CURE',
        source: 'Mains',
        sourceSub: '240 V AC',
        unit: 'PSX power supply',
        charge: 96,
        runtime: 'Backup',
        loads: [
          { label: 'iSTAR Ultra', sub: 'Controller', icon: 'server' },
          { label: 'Door locks', sub: 'Level 1 to 4', icon: 'lock' },
          { label: 'Readers', sub: 'OSDP', icon: 'reader' },
        ],
        status: 'Battery health in C•CURE',
        statusTone: 'ok',
      },
      body: 'Network-managed PSX power supplies report straight into C•CURE 9000, so a failing battery or lost mains shows up as an event on the operator’s screen instead of being found when a door will not lock.',
    },
  ],

  rangeEyebrow: 'The range',
  rangeHeading: 'What Software House makes',
  range: [
    {
      title: 'Software',
      items: ['C•CURE 9000, standalone or Enterprise', 'C•CURE IQ browser client and Security Intelligence', 'C•CURE Portal for visitors and access requests', 'C•CURE High Assurance', 'C•CURE Cloud'],
    },
    {
      title: 'Controllers and power',
      items: ['iSTAR Ultra G2 and Ultra G2 SE', 'iSTAR Edge G2', 'IP-ACM v2 Ethernet door module', 'RM and OSDP door boards', 'PSX power supplies'],
    },
    {
      title: 'Readers',
      items: ['RM series proximity, smart card and multi-technology readers', 'TST-100 touchscreen reader', 'C•CURE Go Reader for Android', 'Integrated HID Signo, Idemia, Suprema and Iris ID readers'],
    },
    {
      title: 'Video alongside',
      items: ['VideoEdge recorders', 'Illustra cameras', 'American Dynamics victor client', 'Exacq integration'],
    },
  ],

  architectureEyebrow: 'How it fits together',
  architectureHeading: 'A Teracom C•CURE system, end to end',
  architectureArt: {
    type: 'architecture',
    alt: 'Readers, iSTAR controllers, cameras and power supplies report to C•CURE 9000, which reaches the security desk, reception, wardens and monitoring',
    columns: ['On site', 'Platform', 'People'],
    devices: [
      { label: 'Readers', sub: 'RM, Signo, biometric', icon: 'reader' },
      { label: 'iSTAR G2', sub: 'Door controllers', icon: 'switch' },
      { label: 'Cameras', sub: 'Illustra, others', icon: 'camera' },
      { label: 'PSX power', sub: 'Battery reporting', icon: 'battery' },
    ],
    platforms: [
      { label: 'C•CURE 9000', sub: 'Server or C•CURE Cloud', icon: 'server' },
      { label: 'C•CURE IQ', sub: 'Browser client, video', icon: 'laptop' },
      { label: 'C•CURE Portal', sub: 'Visitors and requests', icon: 'person' },
    ],
    people: [
      { label: 'Security desk', sub: 'Incidents and video', icon: 'laptop' },
      { label: 'Reception', sub: 'Visitor sign-in', icon: 'person' },
      { label: 'Wardens', sub: 'C•CURE Go Reader', icon: 'phone' },
      { label: 'Monitoring centre', sub: 'After-hours alarms', icon: 'headset' },
    ],
    footer: 'Doors, video and visitors in one system, from a single building to a multi-server estate',
  },
  architectureCaption: 'Readers, iSTAR controllers, cameras and power supplies report to C•CURE 9000 on site or in the cloud. The security desk works in C•CURE IQ, reception runs visitors through C•CURE Portal, and alarms can come through to our monitoring centre after hours.',

  industriesHeading: 'Where we put it to work',
  industries: ['Government', 'Commercial office towers', 'Healthcare', 'Universities', 'Data centres', 'Airports and transport', 'Utilities and critical infrastructure', 'Mining and resources'],

  teracomHeading: 'What Teracom does on a C•CURE job',
  teracom: [
    { title: 'Design', body: 'Doors, controllers and readers planned from the door schedule, with server size, cloud or on-site hosting and video links worked out before anything is ordered.' },
    { title: 'Install and commission', body: 'iSTAR controllers, door boards, readers and power installed and wired, clearances and schedules programmed, and every door tested before handover.' },
    { title: 'Connect to monitoring', body: 'Door and alarm events can come through to our monitoring centre for after-hours response.' },
    { title: 'Look after it', body: 'Software updates, controller firmware, licence renewals and health checks handled on a maintenance plan, so the system stays current and supported.' },
  ],

  links: [
    { label: 'C•CURE software options', href: 'https://www.swhouse.com/unified-security-intelligence-software/access-control-and-event-management-software/5101010102_sec/software-house-software-options' },
    { label: 'Software House door controllers', href: 'https://www.swhouse.com/controllers/door-controllers' },
    { label: 'Software House readers', href: 'https://www.swhouse.com/readers-and-credentials/readers' },
  ],
};

export default ccure;