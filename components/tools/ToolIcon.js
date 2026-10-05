import {
  Antenna,
  BatteryCharging,
  Cable,
  Calculator,
  Camera,
  Cctv,
  Cpu,
  Database,
  Eye,
  Film,
  Gauge,
  HardDrive,
  Layers,
  MemoryStick,
  Monitor,
  MoveVertical,
  Network,
  PlugZap,
  Projector,
  RadioTower,
  Receipt,
  Router,
  Ruler,
  Server,
  ServerCog,
  Signal,
  Speaker,
  Spline,
  Sun,
  SunMedium,
  Timer,
  Tv,
  Unplug,
  Video,
  Volume2,
  Waypoints,
  Wifi,
  Zap,
} from 'lucide-react';

// Line icons (Lucide, ISC licence) for the free calculators.
const TOOL_ICONS = {
  'cctv-storage-calculator': Database,
  'cctv-lens-calculator': Cctv,
  'cctv-bandwidth-calculator': Gauge,
  'nvr-raid-planner': Server,
  'cctv-bitrate-calculator': Film,
  'cctv-mounting-height-calculator': MoveVertical,
  '4g-cctv-data-calculator': Signal,
  'poe-power-budget-calculator': PlugZap,
  'access-control-psu-calculator': Zap,
  'battery-standby-calculator': BatteryCharging,
  'ups-runtime-calculator': Unplug,
  'solar-battery-calculator': Sun,
  'running-cost-calculator': Receipt,
  'voltage-drop-calculator': Cable,
  'fibre-loss-budget-calculator': Waypoints,
  'cable-quantity-calculator': Ruler,
  'ip-subnet-calculator': Network,
  'wireless-link-calculator': RadioTower,
  'data-transfer-time-calculator': Timer,
  'speaker-load-calculator': Speaker,
  'projector-throw-calculator': Projector,
  'screen-size-calculator': Tv,
  'projector-brightness-calculator': SunMedium,
  'pc-power-supply-calculator': Cpu,
  'cctv-recording-server-calculator': ServerCog,
  'virtual-server-calculator': Layers,
  'rack-size-heat-calculator': Server,
};

const GROUP_ICONS = {
  cctv: [Cctv, Camera, Database, Server, Eye, Video, HardDrive, Film],
  power: [Zap, BatteryCharging, PlugZap, Sun, Unplug, Gauge, Receipt, BatteryCharging],
  cabling: [Cable, Waypoints, Ruler, Spline, Cable, Waypoints, Ruler, Spline],
  network: [Network, Router, Wifi, RadioTower, Antenna, Timer, Network, Wifi],
  av: [Speaker, Projector, Monitor, Tv, Volume2, SunMedium, Speaker, Tv],
  it: [Server, Cpu, HardDrive, MemoryStick, ServerCog, Layers, Server, Cpu],
};

export default function ToolIcon({ slug, size = 24, strokeWidth = 1.75 }) {
  const Icon = TOOL_ICONS[slug] || Calculator;
  return <Icon size={size} strokeWidth={strokeWidth} aria-hidden="true" focusable="false" />;
}

export function CalculatorIcon({ size = 24, strokeWidth = 1.75 }) {
  return <Calculator size={size} strokeWidth={strokeWidth} aria-hidden="true" focusable="false" />;
}

// Scattered positions for the faint icon pattern behind a calculator. The left
// edge and the right-hand side stay clear of the calculator panel itself.
const PATTERN = [
  { top: '7%', left: '2%', size: 54, rot: -12 },
  { top: '31%', left: '5.5%', size: 30, rot: 10 },
  { top: '56%', left: '1.5%', size: 44, rot: 16 },
  { top: '81%', left: '6%', size: 34, rot: -8 },
  { top: '6%', left: '64%', size: 32, rot: 8 },
  { top: '13%', left: '88%', size: 46, rot: -14 },
  { top: '72%', left: '66%', size: 38, rot: 12 },
  { top: '86%', left: '90%', size: 52, rot: -6 },
];

export function ToolBackdrop({ slug, group }) {
  const icons = GROUP_ICONS[group] || GROUP_ICONS.cctv;
  return (
    <div className="tool-backdrop" aria-hidden="true">
      <span className="tool-backdrop-main">
        <ToolIcon slug={slug} size={520} strokeWidth={0.6} />
      </span>
      {PATTERN.map((p, i) => {
        const Icon = icons[i % icons.length];
        return (
          <span key={i} className="tool-backdrop-icon" style={{ top: p.top, left: p.left, transform: `rotate(${p.rot}deg)` }}>
            <Icon size={p.size} strokeWidth={1.1} />
          </span>
        );
      })}
    </div>
  );
}