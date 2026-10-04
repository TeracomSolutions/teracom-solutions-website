import Image from 'next/image';
import { notFound } from 'next/navigation';
import ShopTheParts from '@/components/ShopTheParts';
import CalculatorUsage from '@/components/CalculatorUsage';
import Link from 'next/link';
import { Battery, Cable, Cctv, Gauge, HardDrive, Monitor, Network, Projector, Router, Ruler, Speaker, Video, Wifi, Zap } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import OrbitArt from '@/components/OrbitArt';
import ConfigCalculator from '@/components/tools/ConfigCalculator';
import CctvStorageCalculator from '@/components/tools/CctvStorageCalculator';
import PoeBudgetCalculator from '@/components/tools/PoeBudgetCalculator';
import BatteryStandbyCalculator from '@/components/tools/BatteryStandbyCalculator';
import VoltageDropCalculator from '@/components/tools/VoltageDropCalculator';
import ToolIcon, { ToolBackdrop } from '@/components/tools/ToolIcon';
import ToolPrintButton, { PrintDate } from '@/components/tools/ToolPrintButton';
import { findTool, toolGroups, tools } from '@/lib/tools';
import { BUSINESS, pageMetadata } from '@/lib/seo';

// The three badges that orbit the hero emblem, by tool category.
const GROUP_BADGES = {
  cctv: [Cctv, HardDrive, Video],
  power: [Zap, Battery, Gauge],
  cabling: [Cable, Ruler, Network],
  network: [Router, Wifi, Network],
  av: [Monitor, Speaker, Projector],
};

// Every calculator page shares this layout: hero with the tool's icon emblem,
// then the calculator on a panel over a faint icon pattern for its group.
// Most calculators are described in lib/toolConfigs.js; these four have their
// own components.
const CUSTOM_CALCULATORS = {
  'cctv-storage-calculator': CctvStorageCalculator,
  'poe-power-budget-calculator': PoeBudgetCalculator,
  'battery-standby-calculator': BatteryStandbyCalculator,
  'voltage-drop-calculator': VoltageDropCalculator,
};

export const dynamicParams = false;

export function generateStaticParams() {
  return tools.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata(props) {
  const params = await props.params;
  const tool = findTool(params.slug);
  if (!tool) return {};
  return pageMetadata({
    title: `${tool.title} | Teracom Solutions`,
    description: tool.description,
    path: `/tools/${tool.slug}`,
  });
}

export default async function ToolPage(props) {
  const params = await props.params;
  const tool = findTool(params.slug);
  if (!tool) notFound();
  const Custom = CUSTOM_CALCULATORS[tool.slug];
  const group = toolGroups.find((g) => g.id === tool.group);

  return (
    <main id="main-content">
      {/* Shown only on the Save as PDF report (print styles in globals.css). */}
      <div className="print-only tool-print-header">
        <Image src="/assets/teracom-logo.png" alt="Teracom Solutions" width={150} height={58} />
        <div>
          <p>Teracom Solutions free tools</p>
          <h1>{tool.title}</h1>
        </div>
      </div>
      <p className="print-only tool-print-lead">{tool.description}</p>

      <section className="hero hero-product hero-shallow tool-hero">
        <div className="container hero-layout tool-hero-layout">
          <div className="hero-copy">
            <Breadcrumbs
              items={[
                { name: 'Tools', href: '/tools' },
                ...(group ? [{ name: group.eyebrow, href: `/tools?category=${group.id}` }] : []),
              ]}
              current={tool.title}
            />
            <h1>{tool.title}</h1>
            <p className="lead">{tool.description}</p>
            <ToolPrintButton />
          </div>
          <OrbitArt badges={GROUP_BADGES[tool.group] || GROUP_BADGES.cctv}>
            <ToolIcon slug={tool.slug} size={92} strokeWidth={1.3} />
          </OrbitArt>
        </div>
      </section>

      <div className="tool-stage">
        <ToolBackdrop slug={tool.slug} group={tool.group} />
        <div className="tool-stage-inner">{Custom ? <Custom /> : <ConfigCalculator slug={tool.slug} />}</div>
      </div>

      <section className="section section-spacious">
        <div className="container">
          <h2>How it works</h2>
          <p>{tool.howItWorks}</p>
          <p>
            Need help designing a system? <Link href="/contact">Talk to our team</Link>, or{' '}
            <Link href="/tools">see all {tools.length} free calculators</Link>.
          </p>
        </div>
      </section>

      <CalculatorUsage slug={tool.slug} group={tool.group} />
      <div className="print-hide">
        <ShopTheParts toolSlug={tool.slug} />
      </div>

      <div className="print-only tool-print-footer">
        <p>
          © {new Date().getFullYear()} {BUSINESS.legalName} · ABN {BUSINESS.abn} · teracomsolutions.com.au/tools/{tool.slug}
        </p>
        <p>
          Worked out on <PrintDate />. These figures are estimates for planning; check them against the manufacturers&apos;
          datasheets, or ask our team.
        </p>
      </div>
    </main>
  );
}
