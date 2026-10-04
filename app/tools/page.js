import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import ToolIcon, { CalculatorIcon } from '@/components/tools/ToolIcon';
import { toolGroups, tools } from '@/lib/tools';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Free Calculators & Tools for the Industry | Teracom Solutions',
  description:
    'Free CCTV, power, cabling, network, audio and display calculators for engineers, technicians, installers, AV specialists and customers -- storage, lens, bitrate, bandwidth, RAID, PoE, solar, battery, voltage drop, fibre loss, UPS, subnet, wireless link, screen size and more.',
  path: '/tools',
});

// Tabs across the top pick one group (/tools?category=cctv); All tools shows
// every group, as before (Robert, 2026-10-04).
export default async function Tools({ searchParams }) {
  const query = (await searchParams) || {};
  const active = toolGroups.find((group) => group.id === query.category) || null;
  const shown = active ? [active] : toolGroups;

  return (
    <main id="main-content">
      <section className="hero hero-product hero-shallow tool-hero">
        <div className="container hero-layout tool-hero-layout">
          <div className="hero-copy">
            <Breadcrumbs items={[]} current={'Tools'} />
            <span className="eyebrow">Free tools</span>
            <h1>Tools for the industry.</h1>
            <p className="lead">
              {tools.length} free calculators for engineers, technicians, installers, AV specialists and customers -- the numbers
              you check on every job, from cameras and storage to power, cabling, networks and AV.
            </p>
          </div>
          <div className="tool-hero-art" aria-hidden="true">
            <span className="tool-hero-ring">
              <CalculatorIcon size={96} strokeWidth={1.3} />
            </span>
          </div>
        </div>
      </section>

      <div className="container tools-tabs-wrap">
        <nav className="brand-tabs tools-tabs" aria-label="Tool categories">
          <Link href="/tools" scroll={false} className={active ? 'brand-tab' : 'brand-tab active'} aria-current={active ? undefined : 'page'}>
            All tools <span className="brand-tab-count">{tools.length}</span>
          </Link>
          {toolGroups.map((group) => (
            <Link
              key={group.id}
              href={`/tools?category=${group.id}`}
              scroll={false}
              className={active?.id === group.id ? 'brand-tab active' : 'brand-tab'}
              aria-current={active?.id === group.id ? 'page' : undefined}
            >
              {group.eyebrow} <span className="brand-tab-count">{tools.filter((t) => t.group === group.id).length}</span>
            </Link>
          ))}
        </nav>
      </div>

      {shown.map((group, gi) => (
        <section className={`section section-spacious${gi % 2 === 1 ? ' alt' : ''}`} key={group.id}>
          <div className="container">
            <div className="section-heading left tools-group-heading">
              <span className="eyebrow">{group.eyebrow}</span>
              <h2>{group.title}</h2>
            </div>
            <div className="tools-grid">
              {tools
                .filter((t) => t.group === group.id)
                .map((tool) => (
                  <Link href={`/tools/${tool.slug}`} className="tool-card" key={tool.slug}>
                    <span className="tool-card-icon">
                      <ToolIcon slug={tool.slug} size={26} />
                    </span>
                    <h3>{tool.title}</h3>
                    <p>{tool.description}</p>
                    <span className="tool-card-cta">
                      Open calculator <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
                    </span>
                    <span className="tool-card-watermark" aria-hidden="true">
                      <ToolIcon slug={tool.slug} size={150} strokeWidth={1} />
                    </span>
                  </Link>
                ))}
            </div>
          </div>
        </section>
      ))}
    </main>
  );
}