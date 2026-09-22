// Free installer calculators shown on /tools. `config: true` tools are driven by
// lib/toolConfigs.js; the rest have their own component in components/tools
// (see CUSTOM_CALCULATORS in app/tools/[slug]/page.js). `group` sets the section
// on /tools and the icon pattern behind each calculator.
export const toolGroups = [
  { id: 'cctv', eyebrow: 'CCTV & video', title: 'Plan cameras, storage and recording.' },
  { id: 'power', eyebrow: 'Power & cabling', title: 'Size supplies, batteries and cable runs.' },
  { id: 'network', eyebrow: 'Networks, audio & display', title: 'Subnets, speaker lines and projectors.' },
];

export const tools = [
  {
    slug: 'cctv-storage-calculator',
    group: 'cctv',
    title: 'CCTV Storage Calculator',
    description: 'Estimate how much recording storage a CCTV system needs from camera count, bitrate, recording hours and retention.',
    howItWorks: 'Storage per camera per day is the bitrate x the recording time (hours x the share of time actually recording). Multiply by the number of cameras and the retention period in days to get the total capacity the recorder needs.',
  },
  {
    slug: 'cctv-lens-calculator',
    group: 'cctv',
    config: true,
    title: 'CCTV Lens & Pixel Density Calculator',
    description: 'Check the scene width and pixels per metre a camera gives at a distance, and whether it can detect, recognise or identify a person.',
    howItWorks: "Scene width is 2 x distance x tan(half the horizontal field of view). Pixel density is the camera's horizontal resolution divided by that width. Detail levels use the IEC 62676-4 (DORI) thresholds: 25 px/m to detect, 62.5 to observe, 125 to recognise and 250 to identify; the furthest distance for each level is where the density falls to that threshold.",
  },
  {
    slug: 'cctv-bandwidth-calculator',
    group: 'cctv',
    config: true,
    title: 'CCTV Network Bandwidth Calculator',
    description: 'Work out the network bandwidth your cameras need to the recorder and for remote viewing.',
    howItWorks: "Recording bandwidth is the number of cameras x bitrate, plus an allowance for network overhead. Remote viewing adds the number of streams watched at once x their (usually lower) sub-stream bitrate -- that part has to fit within the site's internet upload speed.",
  },
  {
    slug: 'nvr-raid-planner',
    group: 'cctv',
    config: true,
    title: 'NVR Hard Drive & RAID Planner',
    description: 'Find how many drives, and what size, you need to reach a storage target at RAID 1, 5, 6 or 10.',
    howItWorks: "RAID 5 gives up one drive's capacity to parity and RAID 6 gives up two; RAID 1 and RAID 10 mirror the data, so half the raw capacity is usable. The planner adds drives until the usable capacity covers your target (respecting each level's minimum drive count), then adds any hot spares.",
  },
  {
    slug: 'poe-power-budget-calculator',
    group: 'power',
    title: 'PoE Power Budget Calculator',
    description: 'Add up the PoE power your cameras, access points and devices draw, and check it against your switch budget.',
    howItWorks: "Each device's power (the maximum for its PoE class, or its actual draw if you know it) is multiplied by the quantity and added up, then compared with the switch's total PoE budget and port count.",
  },
  {
    slug: 'access-control-psu-calculator',
    group: 'power',
    config: true,
    title: 'Access Control Power Supply Calculator',
    description: 'Add up the current your readers, locks and controllers draw and size the power supply with headroom.',
    howItWorks: "Total load is each device's current x quantity. The required rating adds your headroom, and the suggestion is the next common power supply size up. Use the total load in the Battery Standby Calculator to size the backup battery.",
  },
  {
    slug: 'battery-standby-calculator',
    group: 'power',
    title: 'Battery Standby Calculator',
    description: 'Work out the battery capacity an alarm or access control panel needs to cover its standby and alarm load.',
    howItWorks: 'Required capacity is (standby current x standby hours + alarm current x alarm hours) x a derating factor that allows for battery ageing and temperature. The suggestion is the next common sealed lead-acid size up.',
  },
  {
    slug: 'voltage-drop-calculator',
    group: 'power',
    title: 'Cable Voltage Drop Calculator',
    description: 'Check the voltage drop on a 12 V or 24 V DC cable run and find the minimum conductor size for your device.',
    howItWorks: "Current flows out to the device and back, so the calculator uses twice the one-way length. Loop resistance is that length x the resistivity of copper (0.0172 Ω·mm²/m at 20°C) divided by the conductor's cross-section; the voltage drop is the load current x that resistance. The minimum conductor size is the cross-section that keeps the drop inside your chosen limit.",
  },
  {
    slug: 'ups-runtime-calculator',
    group: 'power',
    config: true,
    title: 'UPS Runtime & Sizing Calculator',
    description: 'Estimate how long a UPS will run your equipment, and the UPS rating you need.',
    howItWorks: 'Battery energy is volts x amp-hours x number of batteries. Runtime is that energy x inverter efficiency divided by the load. The UPS rating is the load divided by its power factor, plus headroom, rounded up to a common UPS size.',
  },
  {
    slug: 'ip-subnet-calculator',
    group: 'network',
    config: true,
    title: 'IP Subnet Calculator',
    description: 'Work out the network, broadcast and usable address range for a camera or access control subnet.',
    howItWorks: 'The prefix length sets the subnet mask. The network address is the IP address with the host bits cleared, the broadcast address has them all set, and the usable host addresses sit between the two.',
  },
  {
    slug: 'speaker-load-calculator',
    group: 'network',
    config: true,
    title: '100 V Line Speaker Load Calculator',
    description: 'Add up speaker tap wattages on a 100 V or 70 V line and check the amplifier has enough headroom.',
    howItWorks: "Total load is each speaker's tap setting x quantity. The amplifier should be rated at least that plus your headroom. The impedance the line presents to the amplifier is the line voltage squared divided by the total tap load.",
  },
  {
    slug: 'projector-throw-calculator',
    group: 'network',
    config: true,
    title: 'Projector Throw & Screen Size Calculator',
    description: 'Work out the image size a projector gives at a distance from its throw ratio, or the distance for a screen width.',
    howItWorks: 'Image width is the throw distance divided by the throw ratio; the height follows from the aspect ratio and the diagonal from both. The distance for a given screen width is that width x the throw ratio.',
  },
];

export function findTool(slug) {
  return tools.find((t) => t.slug === slug);
}
