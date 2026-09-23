import { BellRing, Clock, Cctv, ShieldCheck, Siren } from 'lucide-react';

const ICONS = {
  alarm: BellRing,
  camera: Cctv,
  clock: Clock,
  shield: ShieldCheck,
  duress: Siren,
};

export default function MonitoringIcon({ name, size = 26, strokeWidth = 1.75 }) {
  const Icon = ICONS[name] || ShieldCheck;
  return <Icon size={size} strokeWidth={strokeWidth} aria-hidden="true" focusable="false" />;
}
