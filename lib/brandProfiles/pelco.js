// The deeper Pelco brand page (Robert, 2026-10-01: build the brand pages
// out from each manufacturer's own site, with drawings of what the
// technology does rather than product photos).
// Written in our own words from pelco.com (October 2026); figures are
// Pelco's own. Drawings are specs drawn by lib/brandArt.

const pelco = {
  heroArt: {
    type: 'hero',
    alt: 'A Pelco camera classifying people and vehicles on board, recording into any ONVIF VMS and passing alarms to Pelco Calipsa in the cloud',
    device: 'camera',
    left: { title: 'Your VMS', sub: 'Any ONVIF VMS', foot: 'Unity, Genetec and more', icon: 'server' },
    right: { title: 'Calipsa', sub: 'Cloud AI check', foot: 'Filters false alarms', icon: 'cloud' },
    tags: [
      { text: 'Person', tone: 'ok', icon: 'person' },
      { text: 'Vehicle', tone: 'accent', icon: 'vehicle' },
      { text: 'Loitering', tone: 'warn', icon: 'person' },
    ],
    chips: [
      { text: '100% NDAA compliant', tone: 'ok' },
      { text: 'Open platform', tone: 'accent' },
    ],
  },

  stats: [
    { value: 'Since 1957', label: 'making CCTV, and part of Motorola Solutions since 2020' },
    { value: '100% NDAA', label: 'compliant devices, built to work with any ONVIF-conformant VMS' },
    { value: '30 km', label: 'range at which Silent Sentinel Jaegar can spot a person' },
    { value: '28,000+', label: 'sites using Pelco Calipsa cloud analytics, on 200,000+ cameras' },
  ],

  platformsEyebrow: 'Two ways to use it',
  platformsHeading: 'Open cameras on site, Calipsa in the cloud',
  platformsIntro: 'Pelco cameras record into the VMS you choose, and Calipsa adds cloud analytics on top of cameras you already have. We help you decide on the VMS, bandwidth and who responds to alarms.',
  platforms: [
    {
      name: 'Pelco cameras',
      kicker: 'Open platform',
      art: {
        type: 'onPrem',
        alt: 'Sarix, Spectra, Optera and thermal cameras recording into the VMS the site already uses',
        devices: [
          { label: 'Sarix', icon: 'camera' },
          { label: 'Spectra PTZ', icon: 'camera' },
          { label: 'Optera', icon: 'camera' },
          { label: 'Thermal', icon: 'thermo' },
        ],
        server: 'Your VMS',
        badge: 'ONVIF S, G, T, M',
        title: 'Your choice of VMS',
        sub: 'Unity, Genetec, Milestone',
        points: ['Smart Analytics', 'NDAA compliant', 'Rugged housings'],
      },
      body: 'Pelco cameras are built to plug into the VMS a site already runs, including Avigilon Unity, Genetec and Milestone. Pelco now points VideoXpert users to Avigilon Unity Video as their upgrade path.',
      points: [
        'Sarix fixed, Spectra PTZ and Optera panoramic cameras',
        'Smart Analytics on the camera for people and vehicles',
        'Conformant with ONVIF Profiles S, G, T and M',
        'Integrations with Genetec, Milestone, Network Optix and more',
      ],
    },
    {
      name: 'Pelco Calipsa',
      kicker: 'Cloud analytics',
      art: {
        type: 'cloud',
        alt: 'A depot, a car yard and a substation sending camera alarms to Pelco Calipsa, checked from a browser or by a monitoring operator',
        title: 'Pelco Calipsa',
        sub: 'No new hardware on site',
        badge: 'Works with any camera',
        sites: [
          { label: 'Depot', sub: 'Motion alarms', icon: 'camera' },
          { label: 'Car yard', sub: 'Analogue + IP', icon: 'camera' },
          { label: 'Substation', sub: 'Thermal', icon: 'thermo' },
        ],
        clients: [
          { label: 'Browser', icon: 'laptop' },
          { label: 'Monitor', icon: 'headset' },
        ],
      },
      body: 'Cloud analytics that check each motion alarm for a real person or vehicle before it reaches an operator. It works with analogue or IP cameras of any brand, with no servers to install.',
      points: [
        'Drops false alarms before they reach a monitoring operator',
        'Camera health checks for blocked, tampered or offline cameras',
        'Search across cameras by object or colour',
        'Elevate-enabled Pelco cameras connect to the cloud with no gateway',
      ],
    },
  ],

  capabilitiesEyebrow: 'Analytics and specialty',
  capabilitiesHeading: 'What Pelco cameras actually do',
  capabilitiesIntro: 'Pelco’s strength is cameras for hard places, with analytics both on the camera and in the cloud. These are the functions that do the most work.',
  capabilities: [
    {
      title: 'False alarm filtering',
      art: {
        type: 'dashboard',
        alt: 'A Calipsa dashboard showing most incoming alarms filtered out and a handful passed to an operator',
        title: 'Calipsa · last 24 hours',
        tiles: [
          { label: 'Alarms in', value: '412' },
          { label: 'Filtered out', value: '377', tone: 'ok' },
          { label: 'Sent to operator', value: '35', tone: 'warn' },
          { label: 'Cameras', value: '64' },
        ],
        bars: [20, 12, 8, 6, 14, 30, 46, 38],
        chart: 'Alarms per 3 hours',
        eventsTitle: 'Passed to operator',
        events: [
          { text: 'Person · Depot gate', tone: 'alert' },
          { text: 'Vehicle · Yard 2', tone: 'warn' },
          { text: 'Person · Rear fence', tone: 'alert' },
        ],
      },
      body: 'Calipsa checks every motion alarm from a camera for a real person or vehicle and drops the rest, so operators only see the alarms worth a response.',
    },
    {
      title: 'Perimeter lines',
      art: {
        type: 'perimeter',
        alt: 'A virtual line along a compound fence alerts on a person crossing it and ignores a kangaroo',
        lineLabel: 'Compound fence',
        alert: 'Person crossed',
        ignored: 'Kangaroo · ignored',
      },
      body: 'Smart Analytics on cameras such as the Sarix Professional 4 sets one-way or two-way lines and zones that trigger only on people or vehicles, and can count how many have crossed.',
    },
    {
      title: 'Loitering and stopped vehicles',
      art: {
        type: 'activity',
        alt: 'Normal paths through a car park fade into the background while one vehicle that has stopped too long is flagged',
        place: 'Car park',
        alert: 'Vehicle stopped 8 min',
        note: 'Rule: stops over 5 min',
      },
      body: 'Rules for an object that hangs around, stops in an area, appears where it should not or goes missing, each tied to a time limit you set.',
    },
    {
      title: 'Thermal and radiometric',
      art: {
        type: 'thermal',
        alt: 'A thermal view of a substation with one transformer running far hotter than the rest',
        temp: '94 °C',
        alert: 'Transformer hot',
      },
      body: 'Thermal models see people in total darkness, smoke and mist, and radiometric versions flag equipment running hotter than a set value, such as an overloaded transformer.',
    },
    {
      title: 'Long-range surveillance',
      art: {
        type: 'sensor',
        alt: 'A Silent Sentinel Jaegar thermal and visible camera covering a coastline, tracking a vessel and a person',
        icon: 'camera',
        target: 'vehicle',
        label: 'Silent Sentinel',
        sub: 'Jaegar · thermal + day',
        coverage: 'Person at 30 km, vehicle at 46 km',
        events: [
          { text: 'Vessel', sub: '12 km · heading in', tone: 'warn' },
          { text: 'Person', sub: 'Shoreline · 3 km', tone: 'alert' },
          { text: 'Tracking', sub: 'Locked on target', tone: 'ok' },
        ],
      },
      body: 'Silent Sentinel Jaegar combines long-range visible and thermal imaging in one rugged unit with full 360° coverage, built for ports, borders, airports and large critical infrastructure.',
    },
    {
      title: 'Camera health',
      art: {
        type: 'mobile',
        alt: 'A Calipsa phone alert that a loading dock camera view is blocked, with buttons to see a snapshot or log a service call',
        app: 'Calipsa',
        icon: 'camera',
        tone: 'warn',
        notice: 'View blocked',
        sub: 'Cam 14 · Loading dock',
        time: 'Checked 06:00',
        actions: ['See snapshot', 'Log a service'],
        side: [
          { label: 'Camera', sub: 'Sarix · Dock', icon: 'camera' },
          { label: 'Site', sub: 'Dandenong DC', icon: 'map' },
          { label: 'Technician', sub: 'Service call', icon: 'person' },
        ],
      },
      body: 'Calipsa watches every camera around the clock for a blocked or tampered view or a lost connection, and the check is included free for Pelco cameras under warranty.',
    },
  ],

  rangeEyebrow: 'The range',
  rangeHeading: 'What Pelco makes',
  range: [
    {
      title: 'Fixed cameras',
      items: ['Sarix Professional 4 and Enhanced 4 domes and bullets', 'Sarix Value', 'Sarix Modular and Sarix Fisheye 3', 'Sarix Corner Camera 3'],
    },
    {
      title: 'PTZ and panoramic',
      items: ['Spectra Enhanced 7 and Spectra Professional PTZs', 'Esprit PTZ', 'Optera panoramic and multi-sensor', 'Sarix Multi Enhanced and Multi Pro'],
    },
    {
      title: 'Thermal and long range',
      items: ['Sarix Thermal Enhanced, with radiometric models', 'Optera with one thermal and one visible sensor', 'Silent Sentinel Jaegar and Aeron'],
    },
    {
      title: 'Hazardous areas and sensors',
      items: ['ExSite Enhanced 2 and ExSite Pro explosion-proof cameras', '316L stainless steel, ATEX and IECEx approved', 'HALO smart sensors'],
    },
  ],

  architectureEyebrow: 'How it fits together',
  architectureHeading: 'A Teracom Pelco system, end to end',
  architectureArt: {
    type: 'architecture',
    alt: 'Pelco fixed, PTZ, thermal and explosion-proof cameras record into any ONVIF VMS, with Calipsa checking alarms for the desk, phones and Teracom monitoring',
    devices: [
      { label: 'Sarix cameras', sub: 'Smart Analytics', icon: 'camera' },
      { label: 'Spectra PTZ', sub: 'Track and zoom', icon: 'camera' },
      { label: 'Thermal', sub: 'Radiometric', icon: 'thermo' },
      { label: 'ExSite', sub: 'Hazardous areas', icon: 'shield' },
      { label: 'HALO sensors', sub: 'Smart sensor', icon: 'sensor' },
    ],
    platforms: [
      { label: 'Your VMS', sub: 'Any ONVIF VMS', icon: 'server' },
      { label: 'Pelco Calipsa', sub: 'Cloud analytics', icon: 'cloud' },
    ],
    people: [
      { label: 'Control room', sub: 'Live and recorded', icon: 'laptop' },
      { label: 'Phones', sub: 'Alerts on the move', icon: 'phone' },
      { label: 'Teracom monitoring', sub: 'Filtered alarms', icon: 'headset' },
    ],
    footer: 'Cameras record into the VMS you choose; Calipsa checks alarms in the cloud before anyone is called',
  },
  architectureCaption: 'Pelco cameras record into the VMS you choose, from Avigilon Unity to Genetec or Milestone. Calipsa can check alarms in the cloud first, so the control room and our monitoring centre spend their time on the real ones.',

  industriesHeading: 'Where we put it to work',
  industries: ['Critical infrastructure and utilities', 'Oil, gas and mining', 'Ports and airports', 'Government and defence', 'Transport', 'Commercial property', 'Healthcare', 'Retail'],

  teracomHeading: 'What Teracom does on a Pelco job',
  teracom: [
    { title: 'Design', body: 'Camera types, lenses and housings chosen for each spot, including hazardous zones, with analytics and VMS licensing worked out before anything is ordered.' },
    { title: 'Install and commission', body: 'Every camera mounted, cabled and tuned, with analytics lines, zones and time limits set and tested so the alerts mean something from the first day.' },
    { title: 'Connect to monitoring', body: 'Camera alarms, filtered through Calipsa where it suits, can come through to our monitoring centre for after-hours response.' },
    { title: 'Look after it', body: 'Firmware, licence renewals and health checks handled on a maintenance plan, so the system stays current and supported.' },
  ],

  links: [
    { label: 'Pelco document centre', href: 'https://www.pelco.com/docs' },
    { label: 'Pelco support', href: 'https://www.pelco.com/support' },
    { label: 'Pelco camera integrations', href: 'https://www.pelco.com/partners/technical-partners/pelco-camera-integrations' },
  ],
};

export default pelco;