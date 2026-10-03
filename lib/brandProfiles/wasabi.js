// The deeper Wasabi brand page (Robert, 2026-10-01: build the brand pages
// out from each manufacturer's own site, with drawings of what the
// technology does rather than product photos).
// Written in our own words from wasabi.com and docs.wasabi.com (October
// 2026); figures are Wasabi's own. Drawings are specs drawn by lib/brandArt.

const wasabi = {
  heroArt: {
    type: 'hero',
    alt: 'Wasabi cloud storage taking older footage and a disaster recovery copy from an on-site VMS, locked against change and still playable by the security team',
    device: 'cloud',
    left: { title: 'Your VMS', sub: 'On-site server', foot: 'Recent footage stays', icon: 'server' },
    right: { title: 'Your team', sub: 'Same VMS', foot: 'Plays back from cloud', icon: 'laptop' },
    tags: [
      { text: 'Immutable', tone: 'ok', icon: 'lock' },
      { text: 'DR copy', tone: 'accent', icon: 'shield' },
      { text: 'Moved by age', tone: 'muted', icon: 'server' },
    ],
    chips: [
      { text: 'No egress fees', tone: 'ok' },
      { text: 'Sydney region', tone: 'accent' },
    ],
  },

  stats: [
    { value: '11 nines', label: 'of durability (99.999999999%), with 99.9% system availability' },
    { value: '16 regions', label: 'worldwide, including Sydney for footage kept in Australia' },
    { value: '350+', label: 'applications validated against Wasabi’s S3-compatible API' },
    { value: 'SIA award', label: '2023 Best New Product for video surveillance data storage' },
  ],

  platformsEyebrow: 'Two ways to use it',
  platformsHeading: 'Surveillance Cloud, or the storage on its own',
  platformsIntro: 'Most security sites want the first: the existing recorders keep running and older footage overflows to the cloud. The second is the same storage on its own, for software that already writes to S3. We help you choose on retention, upload bandwidth and how the footage needs to be protected.',
  platforms: [
    {
      name: 'Wasabi Surveillance Cloud',
      kicker: 'For an existing VMS',
      art: {
        type: 'storage',
        alt: 'Recent footage kept on the recording server while older footage moves to a Wasabi bucket by policy and still plays back in the VMS',
        tiers: [
          { label: 'Recording server', sub: 'Newest footage on local drives', icon: 'server' },
          { label: 'Wasabi bucket', sub: 'Older footage, still playable', icon: 'cloud' },
        ],
        active: 1,
        stat: '80%',
        statLabel: 'full: oldest moves out',
        badge: 'Storage Extension',
        points: ['Move by age or size', 'Plays back in the VMS', 'Same VMS for operators'],
        caption: 'Recent video stays on site; older video moves to the cloud by policy',
      },
      body: 'Software that sits beside your existing VMS and pairs it with Wasabi storage. Recent footage stays on the local drives, policies move older recordings to the cloud, and operators keep playing them back from the VMS they already use.',
      points: [
        'Storage Extension moves recordings out by age or by disk use',
        'Disaster Recovery keeps a full copy in the cloud',
        'Job Manager schedules offloads and brings footage back, on supported VMS',
        'Versioning and compliance settings for each bucket from the client',
      ],
    },
    {
      name: 'Wasabi Hot Cloud Storage',
      kicker: 'Object storage',
      art: {
        type: 'cloud',
        alt: 'A VMS archive, backup software and file shares all writing to Wasabi buckets, managed from the console or over the S3 API',
        title: 'Wasabi buckets',
        sub: 'S3 compatible, all hot',
        badge: 'No egress or API fees',
        sites: [
          { label: 'VMS archive', sub: 'Through WSC', icon: 'server' },
          { label: 'Backups', sub: 'Backup apps', icon: 'shield' },
          { label: 'File shares', sub: 'Cloud NAS', icon: 'laptop' },
        ],
        clients: [
          { label: 'Console', icon: 'laptop' },
          { label: 'S3 API', icon: 'server' },
        ],
      },
      body: 'The storage underneath, available on its own for any application that writes to S3. Everything sits in one hot tier, so there is no wait to bring old data back, and the charge is for capacity only, with no fees for egress or API requests.',
      points: [
        'Compatible with the Amazon S3 and IAM APIs',
        'Pay as you go, or Reserved Capacity in 1, 3 or 5-year terms',
        'Encryption in transit and at rest, with MFA and SSO',
        'Wasabi Cloud NAS for file servers and NAS boxes',
      ],
    },
  ],

  capabilitiesEyebrow: 'What it does',
  capabilitiesHeading: 'Keeping footage longer, and keeping it safe',
  capabilitiesIntro: 'Wasabi does not record or analyse video. Its job is to give an existing system more room and an off-site copy that cannot be tampered with. These are the parts that matter on a security job.',
  capabilities: [
    {
      title: 'Works with the VMS you have',
      art: {
        type: 'network',
        alt: 'The Wasabi Surveillance Cloud client linking Milestone, Axis, Nx Witness, Vivotek, OpenEye and Hanwha systems to the Sydney region',
        uplink: 'To Sydney',
        switchLabel: 'WSC client',
        switchSub: 'Installed beside the VMS',
        ports: [
          { label: 'Milestone', icon: 'server', tone: 'accent' },
          { label: 'Axis ACS', icon: 'server', tone: 'accent' },
          { label: 'Nx Witness', icon: 'server', tone: 'accent' },
          { label: 'Vivotek', icon: 'server', tone: 'accent' },
          { label: 'OpenEye', icon: 'server', tone: 'accent' },
          { label: 'Hanwha', icon: 'server', tone: 'accent' },
        ],
        caption: 'One bridge for the major VMS platforms, with no change for operators',
      },
      body: 'WSC works with the major video management systems, among them Milestone XProtect, AXIS Camera Station, Nx Witness, Vivotek VAST Security Station, OpenEye and Hanwha. It follows the VMS’s own retention settings, so operators keep working the way they do now.',
    },
    {
      title: 'Disaster recovery copy',
      art: {
        type: 'storage',
        alt: 'Each recording on the local server copied to a Wasabi bucket as soon as the file closes, giving two copies of every recording',
        tiers: [
          { label: 'Recording server', sub: 'Original footage on local drives', icon: 'server' },
          { label: 'Wasabi bucket', sub: 'Identical copy as each file closes', icon: 'cloud' },
        ],
        active: 1,
        stat: '2',
        statLabel: 'copies, site and cloud',
        badge: 'Disaster Recovery',
        points: ['On by default', 'Copied as files close', 'Restore to the VMS'],
        caption: 'If the recorder is stolen or fails, the footage is already off site',
      },
      body: 'With the Disaster Recovery policy on, which is the default, each recording is copied to Wasabi as soon as the VMS closes the file. If a recorder is damaged, stolen or encrypted, the off-site copy can be restored. It can run alongside Storage Extension.',
    },
    {
      title: 'Evidence that cannot be changed',
      art: {
        type: 'lock',
        alt: 'A locked bucket with Object Lock on in compliance mode, a 90-day retention period and a delete request refused',
        variant: 'electronic',
        parts: [
          { label: 'Object Lock on', tone: 'accent' },
          { label: 'Compliance mode', tone: 'ok' },
          { label: 'Retain 90 days', tone: 'muted' },
          { label: 'Delete refused', tone: 'alert' },
        ],
        caption: 'Locked clips cannot be changed, even by an administrator',
      },
      body: 'Object Lock and immutable buckets keep footage write-once for a set retention period. In compliance mode no one, not even Wasabi’s own engineers, can alter or delete it early, which helps hold the chain of custody for an investigation. It is switched on when the bucket is created.',
    },
    {
      title: 'Covert Copy and sign-off',
      art: {
        type: 'door',
        alt: 'Two administrators approve a request before a hidden Covert Copy bucket is opened, with the approvals logged',
        credentials: [
          { label: 'Admin 1', icon: 'person' },
          { label: 'Admin 2', icon: 'person' },
          { label: 'Admin 3', icon: 'person' },
        ],
        active: 1,
        result: 'Access granted',
        resultTone: 'ok',
        log: ['Copy requested', 'Admin 1 approved', 'Admin 2 approved', 'Hidden copy opened'],
      },
      body: 'Covert Copy keeps a hidden, locked copy of a bucket that only privileged users can see, kept in step every 30, 60 or 90 days. Multi-User Authorization means one stolen login is not enough: several administrators must approve before the copy is opened or a bucket is deleted.',
    },
    {
      title: 'Source monitoring',
      art: {
        type: 'dashboard',
        alt: 'The WSC Source Dashboard showing local free space, upload rate, media in queue and days until the drives fill, with service alerts',
        title: 'WSC Source Dashboard',
        tiles: [
          { label: 'Local free space', value: '38%', tone: 'ok' },
          { label: 'Upload rate', value: '42 MB/s', tone: 'accent' },
          { label: 'Media in queue', value: '12', tone: 'muted' },
          { label: 'Days to full', value: '9.5', tone: 'ok' },
        ],
        bars: [60, 62, 58, 70, 66, 64, 72, 68],
        chart: 'Upload vs recording',
        eventsTitle: 'Alerts',
        events: [
          { text: 'Tiersvc running', tone: 'ok' },
          { text: 'Msxpsvc running', tone: 'ok' },
          { text: 'CPU 85% · 01:40', tone: 'warn' },
          { text: 'Upload caught up 02:10', tone: 'ok' },
        ],
      },
      body: 'An optional dashboard on the server running WSC tracks local free space, upload speed against recording speed, and the services doing the work. It emails an alert when a threshold is crossed, and warns when the local drives look like filling within three days.',
    },
    {
      title: 'Kept in Australia',
      art: {
        type: 'cloud',
        alt: 'Recording servers at sites in Melbourne, Geelong and Bendigo storing footage in the Wasabi Sydney region',
        title: 'Sydney region',
        sub: 'ap-southeast-2',
        badge: 'SOC 2 · ISO 27001 · PCI',
        sites: [
          { label: 'Melbourne', sub: 'Head office', icon: 'server' },
          { label: 'Geelong', sub: 'Warehouse VMS', icon: 'server' },
          { label: 'Bendigo', sub: 'Clinic VMS', icon: 'server' },
        ],
        clients: [
          { label: 'Console', icon: 'laptop' },
          { label: 'VMS', icon: 'laptop' },
        ],
      },
      body: 'Each bucket lives in the region you pick, so footage from Victorian sites can be held in Wasabi’s Sydney region. Every Wasabi region runs in data centres certified for SOC 2, ISO 27001 and PCI-DSS.',
    },
  ],

  rangeEyebrow: 'The range',
  rangeHeading: 'What Wasabi offers',
  range: [
    {
      title: 'For surveillance',
      items: ['Wasabi Surveillance Cloud software and storage', 'Storage Extension and Disaster Recovery policies', 'Job Manager for offloads and retrievals', 'WSC Source Dashboard'],
    },
    {
      title: 'Cloud storage',
      items: ['Wasabi Hot Cloud Storage', 'Wasabi Cloud NAS', 'Pay as you go or Reserved Capacity Storage'],
    },
    {
      title: 'Data protection',
      items: ['Object Lock and immutable buckets', 'Covert Copy hidden buckets', 'Multi-User Authorization', 'Encryption in transit and at rest'],
    },
    {
      title: 'Getting data in',
      items: ['S3 and IAM compatible APIs', 'Wasabi Ball transfer appliance', 'Direct Connect at up to 100 Gbps'],
    },
  ],

  architectureEyebrow: 'How it fits together',
  architectureHeading: 'A Teracom Wasabi setup, end to end',
  architectureArt: {
    type: 'architecture',
    alt: 'Cameras record to an on-site VMS server, the WSC client sends older footage and a recovery copy to locked buckets in Sydney, and the team plays it back',
    columns: ['On site', 'Wasabi cloud', 'People'],
    devices: [
      { label: 'Cameras', sub: 'Existing cameras', icon: 'camera' },
      { label: 'Recording server', sub: 'Local drives', icon: 'server' },
      { label: 'WSC client', sub: 'Policies and upload', icon: 'switch' },
    ],
    platforms: [
      { label: 'Sydney region', sub: 'ap-southeast-2', icon: 'cloud' },
      { label: 'Locked bucket', sub: 'Object Lock on', icon: 'lock' },
    ],
    people: [
      { label: 'Security team', sub: 'Plays back in the VMS', icon: 'laptop' },
      { label: 'Investigators', sub: 'Locked evidence', icon: 'person' },
      { label: 'Teracom support', sub: 'Health alerts', icon: 'headset' },
    ],
    footer: 'Recent video stays on the recorder; older video and a recovery copy go to Wasabi, still playable in the VMS',
  },
  architectureCaption: 'Cameras keep recording to your VMS as they do now. The WSC client sends older footage and a recovery copy to locked buckets in the Sydney region, your team plays it back from the same VMS, and health alerts can come through to us.',

  industriesHeading: 'Where we put it to work',
  industries: ['Schools and universities', 'Councils and government', 'Healthcare', 'Retail chains', 'Commercial property', 'Warehousing and logistics', 'Transport'],

  teracomHeading: 'What Teracom does on a Wasabi job',
  teracom: [
    { title: 'Advise', body: 'Retention, upload bandwidth and local disk worked out from the camera count, so the split between site and cloud makes sense before you commit.' },
    { title: 'Supply', body: 'Wasabi Surveillance Cloud sized to the site, with buckets in the Sydney region and locking chosen to match how long footage must be kept.' },
    { title: 'Set up', body: 'The WSC client installed beside your VMS, Storage Extension and Disaster Recovery policies set, and a restore tested before handover.' },
    { title: 'Support', body: 'Free space, upload speed and service health watched through the source dashboard, with policies adjusted as cameras are added.' },
  ],

  links: [
    { label: 'Wasabi Surveillance Cloud', href: 'https://wasabi.com/cloud-object-storage/surveillance-cloud' },
    { label: 'Wasabi Surveillance Cloud documentation', href: 'https://docs.wasabi.com/docs/wsc-wasabi-surveillance-cloud' },
    { label: 'Wasabi storage regions', href: 'https://wasabi.com/company/storage-regions' },
  ],
};

export default wasabi;