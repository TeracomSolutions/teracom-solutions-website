import { notFound } from 'next/navigation';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import ConfigCalculator from '@/components/tools/ConfigCalculator';
import CctvStorageCalculator from '@/components/tools/CctvStorageCalculator';
import PoeBudgetCalculator from '@/components/tools/PoeBudgetCalculator';
import BatteryStandbyCalculator from '@/components/tools/BatteryStandbyCalculator';
import VoltageDropCalculator from '@/components/tools/VoltageDropCalculator';
import ToolIcon, { ToolBackdrop } from '@/components/tools/ToolIcon';
import { findTool, tools } from '@/lib/tools';
import { pageMetadata } from '@/lib/seo';

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

  return (
    <main id="main-content">
      <section className="hero hero-product hero-shallow tool-hero">
        <div className="container hero-layout tool-hero-layout">
          <div className="hero-copy">
            <Breadcrumbs items={[{ name: 'Tools', href: '/tools' }]} current={tool.title} />
            <h1>{tool.title}</h1>
            <p className="lead">{tool.description}</p>
          </div>
          <div className="tool-hero-art" aria-hidden="true">
            <span className="tool-hero-ring">
              <ToolIcon slug={tool.slug} size={96} strokeWidth={1.3} />
            </span>
          </div>
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
    </main>
  );
}
