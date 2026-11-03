import ToolBrandBand from '@/components/tools/ToolBrandBand';
import Link from 'next/link';
import { ArrowRight, Bot, FileStack, HardDrive, Zap } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import OrbitArt from '@/components/OrbitArt';
import { CalculatorIcon } from '@/components/tools/ToolIcon';
import ToolsBrowser from '@/components/tools/ToolsBrowser';
import { toolGroups, tools } from '@/lib/tools';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Free Calculators & Tools for Security, IT and AI | Teracom Solutions',
  description:
    'Free CCTV, power, cabling, network, Wi-Fi, access control, AV, IT and AI tools -- storage, lens, PoE, battery, voltage drop, fibre loss, subnet, access points, backup, downtime, false alarm cost, AI model picker, AI running cost and more.',
  path: '/tools',
});

// Every area folds up, with Expand all / Collapse all and a search (components/tools/ToolsBrowser.js).
// ?category=<area> still works for the calculators' breadcrumbs: only that area starts open.
export default async function Tools({ searchParams }) {
  const query = (await searchParams) || {};
  const active = toolGroups.find((group) => group.id === query.category) || null;
  const list = tools.map(({ slug, group, title, description, isNew }) => ({ slug, group, title, description, isNew: Boolean(isNew) }));

  return (
    <main id="main-content">
      <section className="hero hero-product hero-shallow tool-hero">
        <div className="container hero-layout tool-hero-layout">
          <div className="hero-copy">
            <Breadcrumbs items={[]} current={'Tools'} />
            <span className="eyebrow">Free tools</span>
            <h1>Tools for the industry.</h1>
            <p className="lead">
              {tools.length} free tools in {toolGroups.length} areas, for engineers, technicians, installers, IT teams and
              business owners -- from cameras, power and cabling to Wi-Fi, access control, backups and choosing the right AI.
            </p>
          </div>
          <OrbitArt icon={CalculatorIcon} badges={[HardDrive, Zap, Bot]} />
        </div>
      </section>

      <div className="container tools-project-callout">
        <span className="tools-project-callout-icon" aria-hidden="true">
          <FileStack size={30} strokeWidth={1.6} />
        </span>
        <div>
          <h2>One report from any of these tools</h2>
          <p>
            Add results from as many tools as the job needs to one project, with the client, site and your notes, and save it
            all as a single PDF. Import the PDF again later to change any result.
          </p>
        </div>
        <Link className="btn btn-primary" href="/tools/project">
          Open the project report <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
        </Link>
      </div>

      <section className="section">
        <ToolsBrowser groups={toolGroups} tools={list} initialOpen={active ? [active.id] : null} />
      </section>
      <ToolBrandBand showAllTools={false} />
    </main>
  );
}
