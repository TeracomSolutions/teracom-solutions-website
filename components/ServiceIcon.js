import {
  BellRing,
  Cable,
  Cctv,
  CodeXml,
  DraftingCompass,
  House,
  KeyRound,
  MonitorSpeaker,
  Network,
  Phone,
  Workflow,
  Wrench,
  Zap,
} from 'lucide-react';

// Line icons (Lucide, ISC licence) for each service, keyed by service slug.
const SERVICE_ICONS = {
  'access-control': KeyRound,
  cctv: Cctv,
  'intrusion-alarms': BellRing,
  intercoms: Phone,
  electrical: Zap,
  automation: House,
  'audio-visual': MonitorSpeaker,
  networking: Network,
  'software-development': CodeXml,
  'integration-development': Workflow,
  'security-design-consulting': DraftingCompass,
  'maintenance-support': Wrench,
};

export default function ServiceIcon({ slug, size = 24, strokeWidth = 1.75 }) {
  const Icon = SERVICE_ICONS[slug] || Cable;
  return <Icon size={size} strokeWidth={strokeWidth} aria-hidden="true" focusable="false" />;
}
