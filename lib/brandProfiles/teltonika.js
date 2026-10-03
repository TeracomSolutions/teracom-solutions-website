// The deeper Teltonika brand page (Robert, 2026-10-01: build the brand pages
// out from each manufacturer's own site, with drawings of what the
// technology does rather than product photos).
// Written in our own words from teltonika-networks.com, teltonika-iot-group.com
// and community.teltonika.lt (October 2026); figures are Teltonika's own.
// Drawings are specs drawn by lib/brandArt.

const teltonika = {
  heroArt: {
    type: 'hero',
    alt: 'A Teltonika cellular router linking cameras and an alarm panel on site to RMS in the cloud, switching SIMs when one network drops',
    device: 'wifi',
    left: { title: 'On site', sub: 'Cameras, panel', foot: 'Ethernet, serial and I/O', icon: 'camera' },
    right: { title: 'RMS', sub: 'Cloud platform', foot: 'Management, Connect, VPN', icon: 'cloud' },
    tags: [
      { text: 'SIM 1 dropped', tone: 'warn', icon: 'phone' },
      { text: 'SIM 2 online', tone: 'ok', icon: 'phone' },
      { text: 'VPN up', tone: 'accent', icon: 'lock' },
    ],
    chips: [
      { text: '4G and 5G', tone: 'accent' },
      { text: '-40 °C to +75 °C', tone: 'muted' },
    ],
  },

  stats: [
    { value: '3.4 Gbps', label: 'top 5G speed of the compact RUTM50, with dual SIM failover' },
    { value: '-40 to 75 °C', label: 'operating range the rugged routers and gateways are built for' },
    { value: '24 months', label: 'standard warranty, with repair or replacement by Teltonika' },
    { value: 'Since 1998', label: 'designed and made in Lithuania, and sold in more than 150 countries' },
  ],

  platformsEyebrow: 'Two halves of one system',
  platformsHeading: 'RutOS on the device, RMS in the cloud',
  platformsIntro: 'Every Teltonika router, gateway and access point runs the same operating system, RutOS. RMS then brings the whole fleet into one login, so a router at a far-off gate is looked after the same way as the one in the office.',
  platforms: [
    {
      name: 'Routers and gateways',
      kicker: 'Running RutOS',
      art: {
        type: 'network',
        alt: 'A RUT956 router on a 4G link feeding a camera, an NVR, an alarm panel, a gate input and site Wi-Fi',
        uplink: '4G, 2 SIMs',
        switchLabel: 'RUT956',
        switchSub: 'Dual SIM · RS485 · I/O',
        ports: [
          { label: 'Camera', icon: 'camera' },
          { label: 'NVR', icon: 'server' },
          { label: 'Alarm', icon: 'alarm' },
          { label: 'Gate input', icon: 'door' },
          { label: 'Site Wi-Fi', icon: 'wifi' },
        ],
        caption: 'One rugged router gives a remote site its own mobile data link',
      },
      body: 'Compact industrial routers and gateways that put a site online over 4G or 5G, with Ethernet, Wi-Fi, serial ports and inputs and outputs for the equipment around them. RutOS gives each one a web interface, a firewall, VPNs and industrial protocols without extra hardware.',
      points: [
        'Dual SIM with automatic failover and backup WAN',
        'OpenVPN, IPsec and WireGuard built in',
        'Modbus, MQTT, DNP3 and OPC UA for field equipment',
        'Starlink status and failover in the same web interface',
      ],
    },
    {
      name: 'Teltonika RMS',
      kicker: 'Remote Management System',
      art: {
        type: 'dashboard',
        alt: 'The RMS dashboard showing routers online and offline, mobile data use for the month and recent events across several sites',
        title: 'RMS · All devices',
        tiles: [
          { label: 'Online', value: '46', tone: 'ok' },
          { label: 'Offline', value: '2', tone: 'alert' },
          { label: 'On backup SIM', value: '3', tone: 'warn' },
          { label: 'Data this month', value: '18 GB', tone: 'accent' },
        ],
        bars: [12, 14, 13, 18, 16, 15, 19, 17],
        chart: 'Mobile data per day',
        eventsTitle: 'Recent events',
        events: [
          { text: 'Yard RUT241 offline', tone: 'alert' },
          { text: 'Depot back online', tone: 'ok' },
          { text: 'SIM 2 in use · Gate', tone: 'warn' },
          { text: 'VPN up · Head office', tone: 'accent' },
        ],
      },
      body: 'A cloud platform for watching and managing every Teltonika device from a browser, even where the router has no public IP address. It is sold as three services, so a site pays only for what it uses, and the Management service has a 30-day free trial for every new device.',
      points: [
        'Management: status, settings and control of each device',
        'Connect: reach cameras and other equipment behind the router',
        'VPN: encrypted links between many endpoints',
        'RMS API for linking into other platforms',
      ],
    },
  ],

  capabilitiesEyebrow: 'What it does',
  capabilitiesHeading: 'Keeping a remote site online and reachable',
  capabilitiesIntro: 'On a security job the router is what gets camera footage and alarm signals off a site that has no fixed line. These are the features that do that work.',
  capabilities: [
    {
      title: 'Backup links and failover',
      art: {
        type: 'mobile',
        alt: 'A router event saying it has switched from SIM 1 to SIM 2 after the first network dropped, with the cameras still online',
        app: 'RUT241 · Events',
        icon: 'phone',
        tone: 'warn',
        notice: 'Now on SIM 2',
        sub: 'SIM 1 lost signal',
        time: 'Today 1:12 am',
        actions: ['Open in RMS', 'Dismiss'],
        side: [
          { label: 'SIM 1', sub: 'No signal', icon: 'phone' },
          { label: 'SIM 2', sub: 'Online', icon: 'phone' },
          { label: 'Cameras', sub: 'Still up', icon: 'camera' },
        ],
      },
      body: 'Dual SIM routers move to the second carrier when the first one drops, and back again when it returns. A fixed line or Starlink can be the main link with the mobile network behind it, so cameras and alarms keep reporting.',
    },
    {
      title: 'Encrypted remote access',
      art: {
        type: 'lock',
        alt: 'A router opened up to show its OpenVPN, IPsec and WireGuard tunnels and its firewall rules',
        variant: 'electronic',
        parts: [
          { label: 'OpenVPN', tone: 'accent' },
          { label: 'IPsec', tone: 'accent' },
          { label: 'WireGuard', tone: 'accent' },
          { label: 'Firewall, IP rules', tone: 'ok' },
        ],
        caption: 'Encrypted tunnels from each site, built into RutOS',
      },
      body: 'RutOS builds OpenVPN, IPsec and WireGuard tunnels without a separate VPN appliance, with HTTPS admin access, firewall rules and IP restrictions to limit who can reach the management page.',
    },
    {
      title: 'Industrial protocols',
      art: {
        type: 'network',
        alt: 'A TRB245 gateway reading a PLC, an energy meter and sensors over Modbus and M-Bus and sending the values on by MQTT',
        uplink: 'MQTT out',
        switchLabel: 'TRB245 gateway',
        switchSub: 'RS232 · RS485 · I/O',
        ports: [
          { label: 'PLC', icon: 'server' },
          { label: 'Meter', icon: 'chart' },
          { label: 'Sensor', icon: 'sensor' },
          { label: 'Pump', icon: 'bolt' },
        ],
        caption: 'Data to Server sends chosen readings on as JSON over MQTT or HTTPS',
      },
      body: 'Modbus RTU and TCP, DNP3, IEC 60870-5, OPC UA, M-Bus and DLMS are handled in the device, so PLCs, meters and sensors connect without protocol converters. Data to Server then sends the chosen values to a broker or platform.',
    },
    {
      title: 'Inputs, outputs and alerts',
      art: {
        type: 'sensor',
        alt: 'A gate contact wired to a router input, raising an alert when the gate opens after hours and again when it closes',
        icon: 'sensor',
        target: 'door',
        label: 'Gate contact',
        sub: 'Digital input 1',
        coverage: 'Wired to the RUT956 inputs and outputs',
        events: [
          { text: 'Gate opened', sub: 'Input 1 · 11:42 pm', tone: 'warn' },
          { text: 'Alert sent', sub: 'To on-call phone', tone: 'accent' },
          { text: 'Gate closed', sub: 'Input 1 · 11:47 pm', tone: 'ok' },
        ],
      },
      body: 'Digital inputs and outputs on routers such as the RUT956 can watch a gate contact or a pump fault and drive a relay. RutOS turns those changes into event notifications, and GNSS adds location and accurate time.',
    },
    {
      title: 'Site Manager',
      art: {
        type: 'onPrem',
        alt: 'A Teltonika router acting as the local manager for TSW switches and TAP access points on the same site, with no cloud needed',
        devices: [
          { label: 'TSW202', icon: 'switch' },
          { label: 'TAP200', icon: 'wifi' },
          { label: 'TAP200', icon: 'wifi' },
          { label: 'Cameras', icon: 'camera' },
        ],
        server: 'Router',
        badge: 'Site Manager',
        title: 'One local WebUI',
        sub: 'Pairs TSW and TAP devices',
        points: ['Settings and VLANs', 'Firmware upgrades', 'No cloud needed'],
      },
      body: 'A compatible router can find the TSW switches and TAP access points on its network and manage them from its own web interface: addressing, management VLANs, reboots and firmware upgrades, all without a cloud service.',
    },
    {
      title: 'Reach devices behind the router',
      art: {
        type: 'cloud',
        alt: 'RMS Connect reaching an NVR, a camera and a sensor at three Victorian sites from a laptop or phone without a public IP address',
        title: 'RMS Connect',
        sub: 'Into a site, no public IP',
        badge: 'Encrypted connection',
        sites: [
          { label: 'Ballarat', sub: 'Depot NVR', icon: 'server' },
          { label: 'Geelong', sub: 'Gate camera', icon: 'camera' },
          { label: 'Shepparton', sub: 'Tank sensor', icon: 'sensor' },
        ],
        clients: [
          { label: 'Laptop', icon: 'laptop' },
          { label: 'Phone', icon: 'phone' },
        ],
      },
      body: 'RMS Connect opens a path through the router to the equipment behind it, such as an NVR, a camera or a PLC, without port forwarding or a public IP address. Every company gets its first 5 GB of Connect and VPN data free.',
    },
  ],

  rangeEyebrow: 'The range',
  rangeHeading: 'What Teltonika makes',
  range: [
    {
      title: 'Cellular routers',
      items: ['RUT241 compact 4G router with eSIM', 'RUT956 with dual SIM, serial ports and GNSS', 'RUTX11 4G Cat 6 with four Gigabit ports', 'RUTX50 and RUTM50 5G routers'],
    },
    {
      title: 'Gateways and modems',
      items: ['TRB140 compact LTE gateway', 'TRB245 dual SIM gateway with RS232 and RS485', 'LTE-M and NB-IoT gateways for low-power sites', 'Cellular modems'],
    },
    {
      title: 'Switches and Wi-Fi',
      items: ['TSW202 managed PoE+ switch with two SFP ports', 'Industrial Ethernet switches', 'TAP200 dual-band Wi-Fi 5 access point'],
    },
    {
      title: 'Software and accessories',
      items: ['RutOS on routers, gateways and access points', 'RMS Management, Connect and VPN', 'RMS API and developer sandbox', 'Antennas, power supplies and cables'],
    },
  ],

  architectureEyebrow: 'How it fits together',
  architectureHeading: 'A Teracom Teltonika link, end to end',
  architectureArt: {
    type: 'architecture',
    alt: 'Cameras, an alarm panel and a gate input connect to a Teltonika router and RMS, used by head office, the monitoring centre and Teracom',
    columns: ['On site', 'Connectivity', 'People'],
    devices: [
      { label: 'Cameras and NVR', sub: 'Over Ethernet', icon: 'camera' },
      { label: 'Alarm panel', sub: 'IP reporting', icon: 'alarm' },
      { label: 'Gate and pumps', sub: 'Inputs and outputs', icon: 'door' },
    ],
    platforms: [
      { label: 'RUT956 router', sub: 'Dual SIM 4G, VPN', icon: 'wifi' },
      { label: 'Teltonika RMS', sub: 'Management and Connect', icon: 'cloud' },
    ],
    people: [
      { label: 'Head office', sub: 'Live view over VPN', icon: 'laptop' },
      { label: 'Monitoring centre', sub: 'Alarm signals', icon: 'headset' },
      { label: 'Teracom', sub: 'Remote support', icon: 'person' },
    ],
    footer: 'One router gives the site a mobile link with a backup SIM; RMS lets us see and reach it from anywhere',
  },
  architectureCaption: 'Cameras, the alarm panel and gate inputs plug into a Teltonika router, which carries them over 4G or 5G with a second SIM as backup. Head office views over VPN, alarms come through to our monitoring centre, and RMS lets us check the link remotely.',

  industriesHeading: 'Where we put it to work',
  industries: ['Construction sites', 'Farms and rural properties', 'Water and utilities', 'Councils and car parks', 'Warehousing and logistics', 'Retail', 'Temporary and event sites'],

  teracomHeading: 'What Teracom does on a Teltonika job',
  teracom: [
    { title: 'Design', body: 'Router, SIMs and antennas chosen from the site’s coverage and the data the cameras will send, with the backup link planned before anything is ordered.' },
    { title: 'Install and commission', body: 'Router and antennas mounted, failover, firewall and VPN set up, and the cameras and alarm panel tested over the mobile link.' },
    { title: 'Connect to monitoring', body: 'Alarm signals and camera events can come through the router to our monitoring centre for after-hours response.' },
    { title: 'Look after it', body: 'Link health and data use watched through RMS and firmware kept current on a maintenance plan, so a dropped SIM is found before it matters.' },
  ],

  links: [
    { label: 'Teltonika RMS', href: 'https://www.teltonika-networks.com/products/rms' },
    { label: 'RutOS explained', href: 'https://www.teltonika-networks.com/newsroom/teltonika-rutos-explained' },
    { label: 'Teltonika warranty and repair', href: 'https://www.teltonika-networks.com/support/warranty-repair' },
  ],
};

export default teltonika;