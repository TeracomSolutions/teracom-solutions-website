// Brand/manufacturer copy for the "Brands We Work With" section.
//
// Where real narrative existed in the pre-rebuild teracomsolutions.com.au
// site (recovered via the Wayback Machine -- see
// ~/crewai/uploads/wayback-archive/ on the VM), it's been cleaned up and
// rewritten here in our own words rather than copy-pasted, but kept
// factually faithful to what the source said. Brands where the archive only
// had a product listing (or no archive source at all) get a short, honest
// paragraph based on well-known public facts instead of an invented "why we
// chose them" story -- those are flagged with needsInput: true so the page
// can point people at Robert for the fuller story.
//
// logoFile is only set for the 7 brands that already have a logo asset in
// public/assets/logos/ (matches app/page.js's partnerLogos list). Every
// other brand has no sourced logo file, so its index/detail card falls back
// to a plain heading, same as categories without artwork elsewhere on the
// site.
export const brands = [
  {
    slug: 'inner-range',
    name: 'Inner Range',
    tagline: 'Unified access control, intrusion and smart building systems, trusted across 25 countries.',
    body: `Inner Range builds access control and intruder alarm systems used across some of the world's most demanding sites, from single-door installations through to multi-site global deployments. An access control system replaces traditional keyed locks with a combination of electronic locks and identification devices -- card readers, smartphone and smartwatch credentials, fingerprint readers and facial recognition cameras -- so you can grant or restrict access to any area, at any time, and change that instantly rather than re-keying a building. Intrusion detection works alongside it: motion detectors, door reed switches and infrared beams pick up unauthorised entry, and the system can alert a monitoring centre, on-site security or a smartphone the moment it happens. Inner Range's Multipath IP monitoring adds encrypted IP and cellular communication paths to a monitoring station, so critical alarm information keeps getting through even if one path fails.

What sets Inner Range apart is how far that unification goes. Rather than running access control and intrusion as two separate systems, Inner Range combines them -- and, through its Integriti platform's integrations, extends into CCTV, lighting, intercoms, heating, cooling, visitor management and other third-party systems -- all managed from a single interface. That reduces equipment, installation and maintenance costs, and means operators only need to learn one piece of software rather than several. Cyber security is treated as an ongoing effort rather than a one-off feature, with products, systems and processes updated as threats evolve.

Inner Range systems have been installed on more than 50,000 sites across 25 countries, backed by a global network of over 5,000 certified system integrators and more than 30 years in the field. The software is intuitive enough for non-security-expert users to operate day to day, from simple apps through to smartwatches, and an Integriti licence is a one-off purchase rather than an ongoing subscription -- unlike much of the enterprise access control market, there are no lock-in annual licence fees driving up the total cost of ownership over time.`,
    isOwnBrand: false,
    needsInput: false,
    logoFile: 'inner-range.png',
    theme: 'access-control',
    highlightsHeading: 'Unified security that scales with you.',
    stats: [
      { value: '50,000+', label: 'Sites installed', icon: 'sites' },
      { value: '25', label: 'Countries', icon: 'countries' },
      { value: '5,000+', label: 'Certified integrators', icon: 'networking' },
      { value: '30+', label: 'Years in the field', icon: 'years' },
    ],
    highlights: [
      { title: 'Unified by Design', body: "Access control and intrusion run as one system, not two -- extending through Integriti into CCTV, lighting, intercoms, HVAC and visitor management from a single interface.", icon: 'unify' },
      { title: 'Multipath IP Monitoring', body: 'Encrypted IP and cellular paths to the monitoring centre, so critical alarm signals keep getting through even if one path fails.', icon: 'multipath' },
      { title: 'No Lock-In Licensing', body: 'An Integriti licence is a one-off purchase, not an annual subscription -- unlike much of the enterprise access control market.', icon: 'no-lockin' },
      { title: 'Built for Scale', body: 'From a single-door install to a multi-site global deployment, with software intuitive enough for non-expert operators day to day.', icon: 'scale' },
      { title: 'Flexible Credentials', body: 'Card readers, smartphone and smartwatch credentials, fingerprint readers and facial recognition -- choose how people get through the door.', icon: 'facial-recognition' },
      { title: 'Cybersecurity, Continuously', body: 'Treated as an ongoing effort rather than a one-off feature, with products, systems and processes updated as threats evolve.', icon: 'cyber-security' },
    ],
  },
  {
    slug: 'aritech',
    name: 'Aritech',
    tagline: 'Modular intrusion and access control hardware, built on the Tecom Challenger platform.',
    body: `Aritech is the brand under which Kidde Global Solutions now sells the Tecom Challenger security platform -- a modular intrusion and access control system Teracom has worked with for years under its earlier Tecom Challenger name. At the heart of a Challenger system is the Challenger panel itself: a modular, "add as you go" design that scales by adding intelligent door and lift controllers, input/output expanders, memory expanders and LAN devices as a site grows, with multiple panels able to link together under one piece of management software. That means a solution can start at a single office and expand to a multi-site environment without being re-engineered from scratch, combining intrusion detection, access control and video surveillance integration into one interface.

The current hardware range covers a few tiers. The Network Access Controller manages door and access requirements and supports intrusion applications, and can connect directly to management software or to a ChallengerPlus panel for combined access and intrusion capability. ChallengerPlus is the higher-capacity option, built for commercial and corporate environments such as banks, retail and education, with thousands of programmable options and compatibility with UltraSync and the TecomPlus mobile app. ChallengerLEPlus is the compact, cost-effective version for locations where panel space is limited, offering most of the same advanced features along with an encrypted UltraSync connection to a monitoring station and mobile app control.

On the software side, installers can program a Challenger system on site or remotely over a modem or IP connection, and end users manage doors, alarms and video surveillance through Security Commander, including an interactive map of the building for quick operator control. The TecomPlus mobile app extends day-to-day control to a phone -- arming and disarming areas, opening doors, isolating inputs and checking input/relay status -- and the wider software suite provides integrated management across multiple systems from one place.`,
    isOwnBrand: false,
    needsInput: false,
    logoFile: 'aritech.png',
    theme: 'access-control',
  },
  {
    slug: 'honeywell',
    name: 'Honeywell',
    tagline: 'UL-listed intrusion panels, keypads and the Tuxedo Touch automation controller.',
    body: `Honeywell Security's VISTA range covers control panels, keypads and communication products for intrusion detection, built to integrate with access control, CCTV and long-range radio alongside Honeywell's own burglary components. Honeywell offers a wide variety of keypads to suit different installations, from straightforward alphanumeric keypads through to touchscreen models with graphic, menu-driven prompts that guide a user through arming, disarming and day-to-day operation, plus a broad communications range for reliably getting alarm signals off site.

The Tuxedo Touch controller extends a VISTA system into home and business automation. It's a 7-inch touchscreen that centralises control of the security system, video cameras and Z-Wave-enabled devices -- thermostats, lights, locks and shades -- from one interface, with voice commands for common actions like arming the system or adjusting the temperature when leaving or returning home. It also runs a built-in web server for local control from any Wi-Fi-enabled device, connects up to 32 IP cameras (viewing up to four at once on the display or remotely), and supports up to 30 customisable scenes that trigger based on time, day or system events.`,
    isOwnBrand: false,
    needsInput: false,
    logoFile: 'honeywell.svg',
    imageFile: 'honeywell.jpg',
    theme: 'access-control',
  },
  {
    slug: 'cisco',
    name: 'Cisco',
    tagline: 'Global networking hardware for secure, reliable connectivity.',
    body: `Cisco is one of the world's largest networking equipment manufacturers, known for enterprise and small business switches, wireless access points, routers and network security products. We supply Cisco networking hardware -- including managed PoE switches and Aironet wireless access points -- as part of the network infrastructure behind the CCTV, access control and other systems we install, where reliable, secure connectivity between devices matters as much as the security equipment itself.`,
    isOwnBrand: false,
    needsInput: true,
    logoFile: 'cisco.svg',
    theme: 'networking',
  },
  {
    slug: 'kantech',
    name: 'Kantech',
    tagline: 'Access control hardware and EntraPass management software.',
    body: `Kantech is an access control brand within the Tyco Security Products portfolio -- one of the largest security product portfolios in the world, spanning video security, access control, intrusion and location-based security. The Kantech range covers door controllers (including the KT-1 and KT-400 families), card and key fob readers, and the EntraPass management software, which handles cardholders, access levels, schedules, video and reporting from a single application, with a mobile app for installers and administrators managing systems on the go.`,
    isOwnBrand: false,
    needsInput: true,
    logoFile: 'kantech.jpg',
    theme: 'access-control',
  },
  {
    slug: 'uniview',
    name: 'UNV / Uniview',
    tagline: 'A leading global IP video surveillance manufacturer with a full camera, NVR and software line-up.',
    body: `Uniview (UNV) is a pioneer and one of the largest manufacturers in IP video surveillance, having introduced IP video surveillance to the Chinese market before growing into a global player -- by 2018 it held the fourth-largest global market share in video surveillance, and has filed for more than 600 patents related to CCTV technology.

The UNV product line covers the full surveillance chain -- IP cameras, NVRs, encoders, decoders, storage, and client software and apps -- deployed across retail, commercial, industrial, education and city surveillance projects. We supply UNV's camera and NVR range, including PTZ, turret and dome cameras with smart IR ranges up to 250 metres and edge storage options, as a cost-effective option within our CCTV offering.`,
    isOwnBrand: false,
    needsInput: false,
    logoFile: 'uniview.svg',
    theme: 'cctv',
  },
  {
    slug: 'beward',
    name: 'Beward',
    tagline: 'IP intercom systems with facial recognition, SIP compatibility and push notifications.',
    body: `Beward was established in 2004 as a developer and manufacturer of IP cameras, and has since built up a strong line of IP intercom and door station products alongside its camera range. Its IP video intercoms combine access control and two-way talk with an IP camera for motion alarm and recording, and its facial recognition models allow automatic access without any extra hardware -- the whole system can run on an existing LAN with no internet connection required, or extend to WAN use with DDNS and UPnP support.

Beward's intercom units support a 3-channel controller for connecting third-party devices such as electric locks, lights or a garage door, and are compatible with any SIP-based phone system or PBX, alongside free management software and Android/iOS apps. For sites still running analog door stations, Beward also makes converters -- including a 4-wire analog-to-SIP converter -- that turn an existing analog video door station into a SIP video intercom controllable from a PC or smartphone.`,
    isOwnBrand: false,
    needsInput: false,
    logoFile: 'beward.svg',
    theme: 'access-control',
  },
  {
    slug: 'everki',
    name: 'Everki',
    tagline: 'Laptop bags and travel accessories backed by a limited lifetime warranty.',
    body: `Everki designs laptop bags, backpacks and travel accessories -- from checkpoint-friendly airport bags through to wheeled laptop trolleys -- built for people who carry a laptop for a living. The range is backed by a limited lifetime warranty against defects in materials and workmanship. We stock a selection of Everki bags and cases as an accessory line alongside our core security and networking products.`,
    isOwnBrand: false,
    needsInput: true,
    logoFile: 'everki.png',
    theme: 'accessories',
  },
  {
    slug: 'ion',
    name: 'ION',
    tagline: 'Uninterruptible power systems for industrial, retail and data centre applications.',
    body: `ION supplies uninterruptible power system (UPS) and power management products, aimed at applications where a power interruption is costly -- from industrial equipment and point-of-sale systems through to data centres and other critical IT infrastructure. We stock ION UPS units as part of our power protection range for electronic security and IT installations.`,
    isOwnBrand: false,
    needsInput: true,
    logoFile: 'ion.png',
    theme: 'power',
  },
  {
    slug: 'powershield',
    name: 'PowerShield',
    tagline: 'An Australian UPS manufacturer, purpose-built for the local market.',
    body: `PowerShield is an Australian power protection company that designs and manufactures uninterruptible power systems (UPS) and power filtration products specifically for the Australian market, rather than adapting an overseas range. The focus is on delivering clean, reliable power quality, and that focus -- combined with strong customer support -- has helped PowerShield grow into one of Australia's largest independent UPS manufacturers.

The range spans from smaller line-interactive units for individual equipment protection up to true online double-conversion tower and rack UPS systems with hot-swappable batteries, suiting everything from single-device backup through to larger security, IT and access control installations that need power protection they can rely on.`,
    isOwnBrand: false,
    needsInput: false,
    logoFile: 'powershield.png',
    theme: 'power',
  },
  {
    slug: 'reliance',
    name: 'Reliance (XR Pro)',
    tagline: 'Intrusion panels with built-in IP and 4G communication, from single-home to multi-site commercial.',
    body: `The Reliance XR Pro is an intrusion alarm panel built around built-in IP communication and encrypted connections, with two wireless receivers on board -- one for legacy 60-bit ITI wireless devices and one for the newer, fully encrypted 80Plus wireless range -- so existing Reliance equipment stays compatible as a site upgrades. It runs on the UltraSync platform for a monitored communication path with multiple levels of redundancy, and stores user codes on the panel itself as an added layer of security. An optional dual-SIM 4G/Wi-Fi module adds cellular alarm reporting and remote connection over the mobile network, and the panel is NBN-ready.

The XR Pro scales from 16 zones up to 176, with up to 256 user pin codes, suiting everything from a single residence through to multi-storey, education, retail, government, aged care and warehousing sites. Native IP camera support and Z-Wave compatibility bring camera integration and automation -- lights, door locks, heating -- into the same system, controllable either through compatible touchscreens like the XR Touch or via the UltraSync+ mobile app, which lets a user arm and disarm the system, check door and window status, and view live or recorded camera footage from anywhere.`,
    isOwnBrand: false,
    needsInput: false,
    logoFile: null,
    theme: 'access-control',
  },
  {
    slug: 'dsc',
    name: 'DSC (PowerSeries Neo)',
    tagline: 'A comprehensive hybrid intrusion system supporting wired and PowerG wireless devices.',
    body: `DSC's PowerSeries Neo is positioned as one of the most comprehensive hybrid intrusion systems on the market, built for flexible scalability with a range of expansion modules as a site's requirements grow. It supports PowerG, DSC's encrypted two-way wireless protocol, which gives the reliability of a wired system without the cost and disruption of running cable to every sensor.

The range includes both LCD and touchscreen keypads, with interactive emulators available to help installers and end users get familiar with the interface before it's on the wall. Visual verification -- linking video to an alarm event -- is treated as a core part of a modern installation rather than an add-on, letting a monitoring operator or end user confirm what actually triggered an alert rather than reacting to a signal alone.`,
    isOwnBrand: false,
    needsInput: false,
    logoFile: 'dsc.gif',
    theme: 'access-control',
  },
  {
    slug: 'teraudio',
    name: 'Teraudio',
    tagline: 'Our own in-house range of in-ceiling and architectural speakers.',
    body: `Teraudio is our own speaker range, engineered for home interiors -- easy to install, with paintable grilles designed to disappear into any decor rather than stand out as visible equipment. The range covers in-ceiling speakers in polypropylene and Kevlar woofer options with silk dome tweeters, digital power amplifiers (including Bluetooth-enabled models), and an 8-inch in-ceiling speaker with a built-in Wi-Fi amplifier for zones where running speaker cable isn't practical. Installation is designed to be straightforward, with cut-out templates and gold-plated spring-loaded terminals in the box, and an adjustable tweeter to focus high frequencies toward the listening area.`,
    isOwnBrand: true,
    needsInput: false,
    logoFile: 'teraudio.png',
    theme: 'audio',
  },
  {
    slug: 'teravision',
    name: 'TeraVision',
    tagline: 'Our own video surveillance range, built on CCTV experience dating back to 1990.',
    body: `TeraVision is our own video surveillance range, covering IP and HD-over-coax cameras, NVRs and XVRs, built for everything from small business installations through to enterprise-scale CCTV. We've been working in the electronic security, automation and CCTV industry in Australia since 1990, and that experience shapes the TeraVision range -- cameras and recorders that support AHD, CVI, TVI, IP and analog inputs on the one recorder, so a mixed-generation camera fleet doesn't need to be replaced all at once.

The range is supported by the BitVision app for remote viewing and playback from a phone, facial recognition on compatible models, and cloud backup to Dropbox or Google Drive alongside local storage. Recorders and cameras connect through iVMS320 client software on PC or Mac, with an IP search tool to find devices on a network, and every product line -- fisheye, PTZ, indoor and outdoor cameras -- comes with its own quick-start guide and user manual to make installation straightforward for installers and end users alike.`,
    isOwnBrand: true,
    needsInput: false,
    logoFile: 'teravision.png',
    theme: 'cctv',
  },
  {
    slug: 'ubiquiti',
    name: 'Ubiquiti',
    tagline: 'Wireless networking and the UniFi ecosystem for wired and wireless connectivity at scale.',
    body: `Ubiquiti Networks makes wireless networking, switching and routing hardware, best known for its UniFi ecosystem of access points, switches, gateways and cloud key controllers that manage a whole network from one interface, plus its airMAX and airFiber range for long-range point-to-point and point-to-multipoint wireless links. We stock a wide range of Ubiquiti access points, switches and antennas as part of the networking infrastructure behind our security and connectivity installations.`,
    isOwnBrand: false,
    needsInput: true,
    logoFile: 'ubiquiti.svg',
    theme: 'networking',
  },
  {
    slug: 'genetec',
    name: 'Genetec',
    tagline: 'Unified security software combining video management, access control and analytics.',
    body: `Genetec is a Canadian technology company best known for Security Center, a unified security platform that brings video management, access control, automatic license plate recognition and other security applications together in one system rather than running them as separate products. Genetec's software is widely used across large, multi-site enterprise, government, transportation and retail security deployments.`,
    isOwnBrand: false,
    needsInput: true,
    logoFile: 'genetec.svg',
    theme: 'access-control',
  },
  {
    slug: 'gallagher',
    name: 'Gallagher',
    tagline: 'Gallagher Security -- access control and perimeter security for high-security sites.',
    body: `Gallagher Security (a division of Gallagher Group, distinct from the company's agricultural fencing business) makes access control, perimeter security and intrusion detection systems, with a strong presence in government, defence, airport and other high-security environments. Its Command Centre software platform integrates access control, monitoring and perimeter detection into a single management interface.`,
    isOwnBrand: false,
    needsInput: true,
    logoFile: 'gallagher.png',
    theme: 'access-control',
  },
  {
    slug: 'hid',
    name: 'HID',
    tagline: 'HID Global -- access control credentials, readers and identity management.',
    body: `HID Global is one of the largest suppliers of access control credentials, readers and identity management technology worldwide, spanning physical access cards and fobs, mobile and biometric credentials, and identity verification systems. HID's card and reader technology underpins a large share of the access control systems installed globally, often working behind the scenes as a component within a wider access control platform.`,
    isOwnBrand: false,
    needsInput: true,
    logoFile: 'hid.svg',
    theme: 'access-control',
  },
  {
    slug: 'axis',
    name: 'Axis',
    tagline: 'Axis Communications -- the company that invented the network camera.',
    body: `Axis Communications is a Swedish manufacturer credited with releasing the world's first network camera, and remains one of the leading names in IP video surveillance, along with network audio, access control and analytics products. Axis cameras are widely specified in enterprise and government surveillance projects, and the company places a strong emphasis on open standards and cybersecurity in its product design.`,
    isOwnBrand: false,
    needsInput: true,
    logoFile: 'axis.svg',
    theme: 'cctv',
  },
  {
    slug: 'milestone',
    name: 'Milestone',
    tagline: 'Milestone Systems -- open-platform video management software.',
    body: `Milestone Systems, a Denmark-based company owned by Canon, makes XProtect, one of the most widely deployed open-platform video management software (VMS) systems in the industry. Being open-platform means XProtect is designed to work with cameras and hardware from many different manufacturers rather than locking a customer into one vendor's camera range, which is a big part of why it's used across such a broad range of surveillance deployments.`,
    isOwnBrand: false,
    needsInput: true,
    logoFile: 'milestone.svg',
    theme: 'cctv',
  },
];

export function findBrand(slug) {
  return brands.find((b) => b.slug === slug);
}
