// The deeper Synology brand page (Robert, 2026-10-01: build the brand pages
// out from each manufacturer's own site, with drawings of what the
// technology does rather than product photos).
// Written in our own words from synology.com (October 2026); figures are
// Synology’s own. Drawings are specs drawn by lib/brandArt.

const synology = {
  heroArt: {
    type: 'hero',
    alt: 'A Synology NAS recording IP cameras with Surveillance Station on one side and backing up office PCs and servers on the other',
    device: 'server',
    left: { title: 'Cameras', sub: 'Recorded 24/7', foot: '20,000+ models supported', icon: 'camera' },
    right: { title: 'Office data', sub: 'PCs, servers', foot: 'Backed up and versioned', icon: 'laptop' },
    tags: [
      { text: 'Person at gate', tone: 'warn', icon: 'person' },
      { text: 'Snapshot taken', tone: 'ok', icon: 'shield' },
      { text: 'Copy to C2', tone: 'accent', icon: 'cloud' },
    ],
    chips: [
      { text: 'DSM 7.4', tone: 'accent' },
      { text: '2 free camera licences', tone: 'ok' },
    ],
  },

  stats: [
    { value: '13 million+', label: 'Synology installations worldwide, from a company founded in 2000' },
    { value: '20,000+', label: 'IP camera models and devices supported by Surveillance Station' },
    { value: '100 cameras', label: 'and 40 AI tasks at once on the DVA7400 AI recorder' },
    { value: '216 TB', label: 'raw capacity on a 4-bay DS925+ with a DX525 expansion unit' },
  ],

  platformsEyebrow: 'Two jobs, one box',
  platformsHeading: 'DSM for your data, Surveillance Station for your cameras',
  platformsIntro: 'Every Synology NAS runs DSM, which looks after files and backups. Surveillance Station runs on the same NAS as a full video management system, so one box on site can hold the office’s data and the cameras’ footage.',
  platforms: [
    {
      name: 'DiskStation Manager (DSM)',
      kicker: 'Storage and backup',
      art: {
        type: 'storage',
        alt: 'Files on a Synology NAS protected by snapshots, replicated to a second NAS and backed up to C2 Storage in the cloud',
        tiers: [
          { label: 'Synology NAS', sub: 'Shared folders with snapshots', icon: 'server' },
          { label: 'Second NAS', sub: 'Replicated copy at another site', icon: 'server' },
          { label: 'C2 Storage', sub: 'Hyper Backup, AES-256 encrypted', icon: 'cloud' },
        ],
        active: 0,
        stat: '3-2-1',
        statLabel: 'backup, built into DSM',
        badge: 'Hyper Backup',
        points: ['Versioned backups', 'Immutable snapshots', 'Deduplication'],
        caption: 'Files on the NAS, a copy on another box and another in the cloud',
      },
      body: 'The operating system on every Synology NAS. It shares and syncs files, backs up the computers and cloud accounts around it, and protects its own data with snapshots and off-site copies, all from a web browser.',
      points: [
        'Synology Drive to sync and share files from any device',
        'Active Backup for Business for PCs, servers and VMs',
        'Hyper Backup to another NAS, a USB drive or C2 Storage',
        'Immutable snapshots that cannot be changed or deleted early',
      ],
    },
    {
      name: 'Surveillance Station',
      kicker: 'Video management',
      art: {
        type: 'onPrem',
        alt: 'Cameras, I/O modules, IP speakers and door controllers connected to Surveillance Station on a Synology NAS in the building',
        devices: [
          { label: 'Cameras', icon: 'camera' },
          { label: 'I/O modules', icon: 'sensor' },
          { label: 'IP speakers', icon: 'speaker' },
          { label: 'Door access', icon: 'door' },
        ],
        server: 'Synology NAS',
        badge: 'Recorded on site',
        title: 'Your own VMS',
        sub: '2 camera licences included',
        points: ['Live view, alerts', 'Web, desktop, app', 'Multi-site CMS'],
      },
      body: 'A video management system that runs on Synology NAS units and DVA recorders. Live view, recording, playback and alerts are handled on site, and the Central Management System joins many recorders and sites into one console.',
      points: [
        'Two camera licences included, more with licence packs',
        'Cameras, I/O modules, access controllers and IP speakers',
        'Central Management System for multi-site deployments',
        'Web browser, desktop client and mobile app',
      ],
    },
  ],

  capabilitiesEyebrow: 'What it does',
  capabilitiesHeading: 'Recording, finding and protecting footage',
  capabilitiesIntro: 'On the DVA recorders the AI runs on the box itself, with nothing sent off site to be analysed. These are the features that matter most on a security job, along with the backups that keep office data safe.',
  capabilities: [
    {
      title: 'Search in everyday words',
      art: {
        type: 'search',
        alt: 'A typed description finds the same person on several cameras across a warehouse in seconds',
        query: 'Man in a red jacket carrying a box',
        badge: '4 matches',
        results: [
          { label: 'Dock 14:02', score: 'Cam 3', highlight: true },
          { label: 'Rear door 14:04', score: 'Cam 7' },
          { label: 'Car park 14:06', score: 'Cam 9' },
          { label: 'Side gate 14:07', score: 'Cam 8' },
        ],
        caption: 'Semantic Video Search on the DVA7400 finds moments by description',
      },
      body: 'Semantic Video Search on the DVA7400 lets you type a description, or filter by clothing colour or vehicle type, and see every camera that caught it. Find Repeated Objects links one person’s sightings into a path across the site.',
    },
    {
      title: 'Licence plate recognition',
      art: {
        type: 'plate',
        alt: 'A car at a staff car park has its plate read by the recorder and matched against an allow list',
        plate: '2XY 7KD',
        confidence: 'DVA7400 read',
        status: 'Allowed vehicle',
        statusTone: 'ok',
        lines: ['Staff car park · 07:48', 'Allow list: open gate'],
      },
      body: 'Plates are read and logged as vehicles come and go, with allow and block lists that can run an action, such as opening a gate or sending an alert.',
    },
    {
      title: 'Intrusion detection',
      art: {
        type: 'perimeter',
        alt: 'A virtual line along a rear fence alerts on a person crossing it at night and ignores a possum',
        lineLabel: 'Rear fence line',
        alert: 'Person crossed 2:14 am',
        ignored: 'Possum ignored',
      },
      body: 'Virtual boundaries alert the moment a person or vehicle crosses from the direction you set, and loitering alerts flag anyone lingering in a no-go zone such as a back entrance.',
    },
    {
      title: 'People and vehicle counting',
      art: {
        type: 'dashboard',
        alt: 'A counting report for a shopping centre entrance showing people in and out, vehicles and hourly traffic',
        title: 'Front entrance counts',
        tiles: [
          { label: 'People in', value: '1,284', tone: 'accent' },
          { label: 'People out', value: '1,251', tone: 'muted' },
          { label: 'Vehicles', value: '312', tone: 'ok' },
          { label: 'Busiest hour', value: '12 pm', tone: 'warn' },
        ],
        bars: [40, 85, 120, 160, 210, 180, 150, 95],
        chart: 'People per hour',
        eventsTitle: 'Alerts',
        events: [
          { text: 'Crowd alert · Foyer', tone: 'warn' },
          { text: 'Car in no-parking bay', tone: 'alert' },
          { text: 'Report emailed 6 pm', tone: 'ok' },
        ],
      },
      body: 'Counts of people and vehicles in and out of a site, with reports for later review. Crowd detection can warn staff before an area gets too busy.',
    },
    {
      title: 'A cloud copy of the footage',
      art: {
        type: 'cloud',
        alt: 'Synology recorders and cameras at three Victorian sites sending a copy of their footage to Surveillance365, viewed from a browser or phone',
        title: 'Surveillance365',
        sub: 'Cloud copy of NAS footage',
        badge: 'MFA and your own key',
        sites: [
          { label: 'Melbourne', sub: 'Office NAS', icon: 'server' },
          { label: 'Geelong', sub: 'Store cameras', icon: 'camera' },
          { label: 'Bendigo', sub: 'Depot NAS', icon: 'server' },
        ],
        clients: [
          { label: 'Portal', icon: 'laptop' },
          { label: 'App', icon: 'phone' },
        ],
      },
      body: 'Surveillance365 keeps a copy of Surveillance Station recordings in Synology’s cloud, so footage survives if the NAS is stolen or damaged. Access needs multi-factor sign-in and an encryption key only the account holder holds, with retention from 45 days to ten years.',
    },
    {
      title: 'Backups for the whole office',
      art: {
        type: 'network',
        alt: 'A Synology NAS running Active Backup for Business to back up office PCs, a file server, a virtual machine host and Microsoft 365',
        uplink: 'To C2',
        switchLabel: 'Active Backup',
        switchSub: 'One NAS, every device',
        ports: [
          { label: 'Office PCs', icon: 'laptop' },
          { label: 'Files', icon: 'server' },
          { label: 'VM host', icon: 'server' },
          { label: 'M365', icon: 'cloud' },
        ],
        caption: 'Scheduled backups; restore one file or a whole PC from the portal',
      },
      body: 'Active Backup for Business pulls PCs, file servers, virtual machines and Microsoft 365 accounts onto the NAS, managed from one portal. Hyper Backup then sends an encrypted, deduplicated copy to another NAS or C2 Storage.',
    },
  ],

  rangeEyebrow: 'The range',
  rangeHeading: 'What Synology makes',
  range: [
    {
      title: 'Desktop NAS',
      items: ['DS925+ and DS1825+ Plus Series', 'DS425+ and DS225+ compact Plus models', 'DS423 and DS223 Value Series', 'DS223j and DS124 for small offices'],
    },
    {
      title: 'Rackmount and enterprise',
      items: ['RS1226+ and RS2825RP+ Plus rackmounts', 'XS+ Series such as the RS6426xs+', 'FS all-flash, SA, HD and PAS enterprise storage', 'DX and RX expansion units'],
    },
    {
      title: 'Surveillance',
      items: ['Surveillance Station on every NAS', 'DVA7400 and DVA1622 AI recorders', 'Synology Cameras, including the BC800Z', 'VisualStation for video walls', 'Surveillance Device License Packs'],
    },
    {
      title: 'Drives and cloud',
      items: ['Synology Plus and Enterprise Series hard drives', 'Enterprise Series SATA and M.2 NVMe SSDs', 'C2 Storage and C2 OneStorage', 'Surveillance365 cloud surveillance'],
    },
  ],

  architectureEyebrow: 'How it fits together',
  architectureHeading: 'A Teracom Synology setup, end to end',
  architectureArt: {
    type: 'architecture',
    alt: 'Cameras, office PCs and servers feed a Synology NAS, which keeps an off-site copy in C2, used by the security desk, staff and Teracom',
    columns: ['On site', 'Synology', 'People'],
    devices: [
      { label: 'IP cameras', sub: 'Recorded 24/7', icon: 'camera' },
      { label: 'Office PCs', sub: 'Backed up nightly', icon: 'laptop' },
      { label: 'Servers and VMs', sub: 'Backed up nightly', icon: 'server' },
      { label: 'I/O and doors', sub: 'Events into the VMS', icon: 'door' },
    ],
    platforms: [
      { label: 'Synology NAS', sub: 'DSM and Surveillance', icon: 'server' },
      { label: 'C2 cloud', sub: 'Off-site copies', icon: 'cloud' },
    ],
    people: [
      { label: 'Security desk', sub: 'Live view and playback', icon: 'laptop' },
      { label: 'Staff', sub: 'Files and restores', icon: 'person' },
      { label: 'Teracom', sub: 'Health and upkeep', icon: 'headset' },
    ],
    footer: 'One NAS records the cameras and protects the office data, with an encrypted copy kept off site',
  },
  architectureCaption: 'Cameras record to Surveillance Station and office machines back up to the same Synology NAS, which sends an encrypted copy off site. The security desk plays back footage, staff restore their own files, and we keep an eye on the health of the box.',

  industriesHeading: 'Where we put it to work',
  industries: ['Small and medium businesses', 'Retail', 'Schools', 'Medical and allied health', 'Professional offices', 'Warehousing and logistics', 'Multi-site businesses'],

  teracomHeading: 'What Teracom does with Synology',
  teracom: [
    { title: 'Advise', body: 'NAS model, drives and RAID level worked out from the camera count, how long footage must be kept and how much office data needs backing up.' },
    { title: 'Supply', body: 'Synology NAS units, compatible drives and camera licences supplied as one package, matched to the site.' },
    { title: 'Set up', body: 'Storage pools, Surveillance Station, user accounts and backup jobs configured, and a restore tested before handover.' },
    { title: 'Support', body: 'Drive health, DSM updates and backup results checked on a maintenance plan, with a failing drive replaced before it puts data at risk.' },
  ],

  links: [
    { label: 'Synology Surveillance Station', href: 'https://www.synology.com/en-au/surveillance' },
    { label: 'Synology DiskStation Manager', href: 'https://www.synology.com/en-au/dsm' },
    { label: 'Synology DVA7400 AI recorder', href: 'https://www.synology.com/en-au/products/DVA7400' },
  ],
};

export default synology;