import {
  Activity,
  Bell,
  BellRing,
  Cable,
  Camera,
  Cctv,
  ClipboardCheck,
  Clock,
  Cloud,
  Code,
  CodeXml,
  Database,
  DoorOpen,
  DraftingCompass,
  Fingerprint,
  HardDrive,
  House,
  IdCard,
  KeyRound,
  Lightbulb,
  Link,
  Lock,
  MonitorSpeaker,
  Network,
  Phone,
  Plug,
  Projector,
  Radar,
  Router,
  Ruler,
  Server,
  Settings,
  ShieldAlert,
  ShieldCheck,
  Speaker,
  Thermometer,
  Tv,
  Video,
  Wifi,
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

// The three badges that orbit each service's hero emblem (OrbitArt).
const SERVICE_BADGES = {
  'access-control': [IdCard, DoorOpen, Fingerprint],
  cctv: [Camera, HardDrive, Video],
  'intrusion-alarms': [Radar, ShieldAlert, Activity],
  intercoms: [Video, DoorOpen, Bell],
  electrical: [Plug, Lightbulb, Cable],
  automation: [Lightbulb, Thermometer, Lock],
  'audio-visual': [Speaker, Tv, Projector],
  networking: [Router, Wifi, Server],
  'software-development': [Code, Cloud, Database],
  'integration-development': [Link, Server, Cloud],
  'security-design-consulting': [Ruler, ClipboardCheck, Lightbulb],
  'maintenance-support': [Settings, ShieldCheck, Clock],
};

export function serviceBadges(slug) {
  return SERVICE_BADGES[slug] || [ShieldCheck, Network, Wrench];
}

export default function ServiceIcon({ slug, size = 24, strokeWidth = 1.75 }) {
  const Icon = SERVICE_ICONS[slug] || Cable;
  return <Icon size={size} strokeWidth={strokeWidth} aria-hidden="true" focusable="false" />;
}
