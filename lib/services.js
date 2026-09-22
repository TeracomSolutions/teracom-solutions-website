// Grouped on /services (see serviceGroups). `image` is an optional scene from the
// graphics library for the service page (services without one get icon art),
// and `tags` are the short capability chips shown on each service card.
export const serviceGroups = [
  { id: 'security', eyebrow: 'Security technology', title: 'Protect people, places and assets.', text: 'Access, video, alarms and intercoms -- designed to work together.' },
  { id: 'building', eyebrow: 'Building, power & AV', title: 'Power, automation and audio visual.', text: 'Licensed electrical, smart automation and AV for the spaces people use.' },
  { id: 'digital', eyebrow: 'Networks, software & integration', title: 'Connect it, build it, make it work as one.', text: 'The network underneath, and the software and integration on top.' },
  { id: 'advisory', eyebrow: 'Advice & support', title: 'Design it right. Keep it running.', text: 'Independent design up front, and support for the life of the system.' },
];

export const services = [
  {
    slug: 'access-control',
    group: 'security',
    image: '/assets/hero-security-command-centre.webp',
    tags: ['Cards & mobile', 'Biometrics', 'Multi-site'],
    title: 'Access Control Systems',
    seoTitle: 'Access Control Systems Installation | Teracom',
    description: 'Design, supply, installation and commissioning of access control systems for single-site and multi-site organisations.',
    lead: 'Electronic access that lets the right people in at the right time -- designed, installed and supported by one team.',
    intro: [
      'Access control systems replace traditional keyed locks with electronic credentials such as card readers, smartphone and smartwatch credentials, fingerprint readers and facial recognition cameras. This allows you to grant or restrict access to any area, at any time, and change that instantly rather than re-keying a building.',
      'Access control can also be integrated with intrusion detection, video surveillance, intercoms and other building systems, so operators manage doors, alarms and cameras together rather than as separate systems.'
    ],
    includes: [
      'Independent advice on system selection and technical design',
      'Supply of access control hardware from leading manufacturers',
      'Installation by licensed technicians and electricians',
      'System commissioning and testing',
      'Training for operators and maintenance staff',
      'Ongoing monitoring and support services',
      'Integration with existing security systems'
    ],
    brandSlugs: ['gallagher','inner-range','genetec','hid','kantech',
      'tecom-challenger','ccure','assa-abloy','lockwood','trimec','fsh'],
    storeCategory: 'access-control'
  },
  {
    slug: 'cctv',
    group: 'security',
    image: '/assets/teracom-ai-command-centre.webp',
    tags: ['Cameras', 'Recording', 'Video management'],
    title: 'CCTV & Video Surveillance',
    seoTitle: 'CCTV Installation Melbourne | Teracom',
    description: 'CCTV and video surveillance design, supply and installation, including integration with existing security platforms.',
    lead: 'Video systems designed around what you need to see, record and act on.',
    intro: [
      'Video surveillance systems provide visual monitoring of areas for security purposes. Our CCTV solutions include high-definition cameras, recording systems, and management software to capture, store and review video footage.',
      'We design CCTV systems that integrate with existing access control, intrusion detection and other security platforms, ensuring a comprehensive security solution tailored to your needs.'
    ],
    includes: [
      'Security assessment and system design',
      'Supply of cameras and recording equipment',
      'Installation by licensed technicians',
      'System commissioning and testing',
      'Integration with existing security systems',
      'Training for operators',
      'Ongoing support and maintenance'
    ],
    brandSlugs: ['axis','milestone','genetec','hanwha-vision','avigilon','hikvision',
      'pelco','uniview','vivotek','i-pro','mobotix','nx-witness','eagle-eye'],
    storeCategory: 'cctv'
  },
  {
    slug: 'intrusion-alarms',
    group: 'security',
    image: null,
    tags: ['Motion & beams', 'Door sensors', 'Monitoring'],
    title: 'Intrusion Detection & Alarm Systems',
    seoTitle: 'Intrusion Alarms Installation | Teracom',
    description: 'Intrusion detection and alarm systems designed and installed by licensed technicians and electricians.',
    lead: 'Detection and alarm systems that alert the right people the moment something happens.',
    intro: [
      'Intrusion detection systems work alongside access control to detect unauthorised entry. These systems include motion detectors, door reed switches and infrared beams that pick up unauthorised activity and alert a monitoring centre, on-site security or a smartphone the moment it happens.',
      'Our intrusion detection solutions integrate with access control and video surveillance systems for a comprehensive approach to security, providing multiple layers of protection.'
    ],
    includes: [
      'Security assessment and system design',
      'Supply of intrusion detection hardware',
      'Installation by licensed technicians and electricians',
      'System commissioning and testing',
      'Integration with access control and video systems',
      'Training for operators',
      'Ongoing support and maintenance'
    ],
    brandSlugs: ['inner-range','tecom-challenger','aritech','dsc',
      'paradox','honeywell','bosch','reliance'],
    storeCategory: 'intrusion'
  },
  {
    slug: 'intercoms',
    group: 'security',
    image: null,
    tags: ['IP & SIP', 'Facial recognition', 'Mobile alerts'],
    title: 'Intercom Systems',
    seoTitle: 'Intercom Systems Installation | Teracom',
    description: 'IP intercom solutions with facial recognition, SIP and push notification support.',
    lead: 'IP intercoms that connect visitors, staff and your access control.',
    intro: [
      'Intercom systems provide secure communication between different areas of a building or site. Our IP intercom solutions offer features such as facial recognition, SIP integration and push notifications for enhanced functionality.',
      'These systems can be integrated with access control and video surveillance to create a unified security platform that provides both communication and security capabilities.'
    ],
    includes: [
      'System design and consultation',
      'Supply of intercom equipment',
      'Installation by licensed technicians',
      'System commissioning and testing',
      'Integration with access control and video systems',
      'Training for operators',
      'Ongoing support and maintenance'
    ],
    brandSlugs: ['beward'],
    storeCategory: 'intercoms'
  },
  {
    slug: 'audio-visual',
    group: 'building',
    image: null,
    tags: ['Meeting rooms', 'Presentation', 'Common areas'],
    title: 'Audio Visual',
    seoTitle: 'Audio Visual Solutions | Teracom',
    description: 'Audio visual solutions for business spaces including presentation systems, meeting rooms and common areas.',
    lead: 'Sound and vision for meeting rooms, presentation spaces and common areas.',
    intro: [
      'Audio visual systems combine speakers, microphones, displays and control systems to create effective communication environments. Our AV solutions are tailored for business spaces including presentation rooms, meeting areas and common workspaces.',
      'We integrate audio visual systems with existing security and IT infrastructure to ensure seamless operation and maximum effectiveness.'
    ],
    includes: [
      'Consultation and system design',
      'Supply of audio visual equipment',
      'Installation by licensed technicians',
      'System commissioning and testing',
      'Integration with existing IT infrastructure',
      'Training for users',
      'Ongoing support and maintenance'
    ],
    brandSlugs: ['teraudio','teravision'],
    storeCategory: 'audio'
  },
  {
    slug: 'electrical',
    group: 'building',
    image: '/assets/teracom-on-site.webp',
    tags: ['Power supplies', 'UPS', 'Licensed electricians'],
    title: 'Electrical Services',
    seoTitle: 'Electrical Installation & Support | Teracom',
    description: 'Licensed electrical services for technology systems, including power supplies, UPS and related infrastructure.',
    lead: 'Licensed electrical work, planned alongside the technology it powers.',
    intro: [
      'Electrical infrastructure is fundamental to the operation of every technology system on site. Our electrical services include supply and installation of power supplies, uninterruptible power systems (UPS), and related electrical components.',
      'Electrical work is carried out by our licensed electricians, alongside the technicians installing your security, AV and IT systems, so power and technology infrastructure are planned together.'
    ],
    includes: [
      'Electrical system design',
      'Supply of electrical equipment',
      'Installation by licensed electricians',
      'System integration with your technology infrastructure',
      'Testing and commissioning',
      'Ongoing maintenance support',
      'Work carried out by licensed electricians'
    ],
    brandSlugs: ['ion','powershield'],
    storeCategory: 'power-supplies'
  },
  {
    slug: 'automation',
    group: 'building',
    image: '/assets/hero-bigger-together.webp',
    tags: ['Lighting', 'Climate', 'Remote control'],
    title: 'Home & Building Automation',
    seoTitle: 'Home Automation Systems | Teracom',
    description: 'Smart home and building automation solutions for lighting, climate control, security and more.',
    lead: 'Smart control of lighting, climate, locks and more from one platform.',
    intro: [
      'Building automation systems integrate lighting, climate control, security and other building systems into a unified platform. Our solutions provide convenience, energy efficiency and enhanced security through automated controls.',
      'We design and implement automation systems that can be controlled remotely through smartphones or integrated with existing security infrastructure for comprehensive building management.'
    ],
    includes: [
      'Consultation and system design',
      'Supply of automation equipment',
      'Installation by licensed technicians',
      'System integration with existing infrastructure',
      'Commissioning and testing',
      'User training',
      'Ongoing support and maintenance'
    ],
    brandSlugs: [],
    storeCategory: 'zwave'
  },
  {
    slug: 'networking',
    group: 'digital',
    image: null,
    tags: ['Switching', 'Wireless', 'Network security'],
    title: 'Networking & IT Infrastructure',
    seoTitle: 'Network Installation Melbourne | Teracom',
    description: 'Complete networking and IT infrastructure solutions for technology systems and business operations.',
    lead: 'The network backbone every modern technology system runs on.',
    intro: [
      'Networking infrastructure forms the backbone of modern technology and business operations. Our networking solutions include routers, switches, wireless access points and network management tools to ensure reliable connectivity.',
      'We design and implement networking systems that integrate seamlessly with existing security and IT infrastructure to provide secure, scalable communication networks.'
    ],
    includes: [
      'Network assessment and design',
      'Supply of networking equipment',
      'Installation by licensed technicians',
      'System integration with your technology infrastructure',
      'Testing and commissioning',
      'Ongoing support and maintenance',
      'Security configuration'
    ],
    brandSlugs: ['cisco','ubiquiti'],
    storeCategory: 'networking'
  },
  {
    slug: 'software-development',
    group: 'digital',
    image: '/assets/teracom-ai-ask-tera.webp',
    tags: ['Web apps', 'Automation', 'AI tools'],
    title: 'Software Development',
    seoTitle: 'Custom Software Development | Teracom',
    description: 'Custom software, workflow automation and AI tools from the team that builds the Teracom AI platform in-house.',
    lead: 'Custom software and AI tools from the team that builds Teracom AI in-house.',
    intro: [
      'Teracom builds its own software. The Teracom AI platform -- AI support agents, scope of works generation, estimation assistance and tender response tools -- is designed and developed in-house by our own development team, and the same team builds custom software tools for clients.',
      'That can mean workflow automation that removes manual steps, knowledge management that puts the right documentation in front of the right people, or tools that connect to the systems you already run. Because we also design and install technology on site, the software is built around how those systems are really used.'
    ],
    includes: [
      'Requirements and solution design',
      'Custom web applications and tools',
      'Workflow automation',
      'AI assistants and knowledge management',
      'Integration with your existing systems',
      'Testing, deployment and ongoing support'
    ],
    brandSlugs: [],
    storeCategory: null
  },
  {
    slug: 'integration-development',
    group: 'digital',
    image: '/assets/hero-security-command-centre.webp',
    tags: ['Platform APIs', 'Middleware', 'Unified interfaces'],
    title: 'Systems Integration & Development',
    seoTitle: 'Systems Integration & Development | Teracom',
    description: 'High-level integration that connects access control, video, alarms, building systems and business software so they work as one.',
    lead: 'High-level integration that makes separate systems work as one.',
    intro: [
      'Most sites run several systems from different manufacturers -- access control, video, alarms, intercoms, building management and business software. On their own each does one job; integrated, they share events, users and data, so an alarm can bring up the right camera, a new starter has access on day one, and operators work from one screen.',
      'Teracom plans and builds those integrations, from standard manufacturer integrations through to custom development against platform APIs where an off-the-shelf connector does not exist. Integration planning starts at design stage, so the systems chosen can actually talk to each other.'
    ],
    includes: [
      'Integration planning and architecture',
      'Manufacturer and platform integrations',
      'Custom API and middleware development',
      'Unified operator interfaces',
      'Testing and commissioning of integrated systems',
      'Documentation and ongoing support'
    ],
    brandSlugs: ['genetec', 'milestone', 'gallagher', 'inner-range', 'ccure'],
    storeCategory: null
  },
  {
    slug: 'security-design-consulting',
    group: 'advisory',
    image: '/assets/hero-tera-intelligence.webp',
    tags: ['System selection', 'Architecture', 'Specifications'],
    title: 'Technology Design & Consulting',
    seoTitle: 'Technology Design & Consulting | Teracom',
    description: 'Independent advice on system selection, architecture and technical design before a product is ordered.',
    lead: 'Independent advice on system selection, architecture and design -- before anything is ordered.',
    intro: [
      'Our technology design and consulting services provide independent advice on system selection, solution architecture and technical design. We work with you to understand your requirements and develop a tailored approach that addresses your specific needs.',
      'Before any product is ordered, we conduct detailed assessments and provide recommendations to ensure the selected solutions are appropriate for your environment and operational requirements.'
    ],
    includes: [
      'Requirements analysis',
      'System architecture design',
      'Technical specification development',
      'Product selection guidance',
      'Solution validation',
      'Integration planning',
      'Technical documentation'
    ],
    brandSlugs: [],
    storeCategory: null
  },
  {
    slug: 'maintenance-support',
    group: 'advisory',
    image: '/assets/teracom-storefront-van.webp',
    tags: ['Monitoring', 'Fault finding', 'Upgrades'],
    title: 'Maintenance & Support',
    seoTitle: 'System Maintenance & Support | Teracom',
    description: 'Ongoing monitoring, technical support and account management for the life of the system.',
    lead: 'Maintenance, monitoring and support for the life of your systems.',
    intro: [
      'Our maintenance and support services ensure that your technology systems continue to operate effectively throughout their lifecycle. We provide ongoing monitoring, technical support and account management to keep your systems running smoothly.',
      'From routine maintenance to fault finding and repairs, our support keeps systems working as intended and reduces downtime.'
    ],
    includes: [
      'Ongoing system monitoring',
      'Technical support and troubleshooting',
      'Routine maintenance and inspections',
      'Fault finding and repairs',
      'System updates and upgrades',
      'Performance optimisation',
      'Account management'
    ],
    brandSlugs: [],
    storeCategory: null
  },
];

export function findService(slug) {
  return services.find((s) => s.slug === slug);
}