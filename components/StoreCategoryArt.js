import {
  Activity,
  Battery,
  BatteryCharging,
  Bell,
  BellRing,
  Boxes,
  Cable,
  Camera,
  Cctv,
  Cloud,
  Database,
  DoorOpen,
  Film,
  Fingerprint,
  Gauge,
  HardDrive,
  HouseWifi,
  IdCard,
  KeyRound,
  Keyboard,
  Laptop,
  Lightbulb,
  Lock,
  Maximize2,
  Mic,
  Monitor,
  Mouse,
  Music,
  Network,
  PackageOpen,
  Phone,
  Plug,
  PlugZap,
  Presentation,
  Projector,
  Radar,
  Router,
  Ruler,
  ScanFace,
  Server,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Speaker,
  Sun,
  Tag,
  Thermometer,
  Tv,
  UserCheck,
  Video,
  Volume2,
  Wifi,
  Zap,
} from 'lucide-react';

// Store category hero art: the category's emblem, gently floating, with three
// themed badges orbiting it. The orbit spins slowly and each badge counter-
// rotates so its icon stays upright -- the store's livelier take on the
// emblem heroes used across the rest of the site.
const ART = {
  'new-arrivals': [Sparkles, PackageOpen, Tag, Zap],
  cctv: [Cctv, Camera, Video, HardDrive],
  'access-control': [KeyRound, IdCard, DoorOpen, Fingerprint],
  intrusion: [BellRing, Radar, ShieldAlert, Activity],
  networking: [Network, Wifi, Router, Cable],
  audio: [Speaker, Music, Volume2, Mic],
  ups: [BatteryCharging, Zap, PlugZap, Gauge],
  cable: [Cable, Ruler, Plug, Network],
  intercoms: [Phone, Video, DoorOpen, Bell],
  'facial-recognition': [ScanFace, UserCheck, Fingerprint, Camera],
  'video-accessories': [Boxes, Plug, Cable, Video],
  nas: [HardDrive, Database, Cloud, ShieldCheck],
  'power-supplies': [Zap, Battery, Plug, Gauge],
  screens: [Monitor, Tv, Presentation, Maximize2],
  projectors: [Projector, Presentation, Sun, Film],
  zwave: [HouseWifi, Lightbulb, Thermometer, Lock],
  'it-equipment': [Laptop, Server, Keyboard, Mouse],
  // Product-only groupings: these have no category listing of their own,
  // but their product pages still need a hero emblem.
  software: [Sparkles, Cloud, Server, Zap],
  digital: [Database, Cloud, Boxes, Tag],
  services: [UserCheck, ShieldCheck, Ruler, Network],
};

export default function StoreCategoryArt({ slug }) {
  const [Main, ...badges] = ART[slug] || [Boxes, Tag, PackageOpen, Sparkles];
  return (
    <div className="store-art" aria-hidden="true">
      <span className="store-art-ring tool-hero-ring">
        <Main size={92} strokeWidth={1.3} focusable="false" />
      </span>
      <span className="store-art-orbit">
        {badges.map((Badge, i) => (
          <span className={`store-art-badge store-art-badge-${i + 1}`} key={i}>
            <span>
              <Badge size={22} strokeWidth={1.8} focusable="false" />
            </span>
          </span>
        ))}
      </span>
    </div>
  );
}
