import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import ToolIcon, { CalculatorIcon } from '@/components/tools/ToolIcon';
import { toolGroups, tools } from '@/lib/tools';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Free Security Installer Calculators | Teracom Solutions',
  description:
    'Free CCTV, power, cabling, network, audio and projector calculators for security installers and integrators -- storage, lens, bandwidth, RAID, PoE, PSU, battery, voltage drop, UPS, subnet and more.',
  path: '/tools',
});

export default function Tools() {
  return (
    <main id="main-content">
      <section className="hero hero-product hero-shallow tool-hero">
        <div className="container hero-layout tool-hero-layout">
          <div className="hero-copy">
            <Breadcrumbs items={[]} current={'Tools'} />
            <span className="eyebrow">Free tools</span>
            <h1>Calculators for security installers.</h1>
            <p className="lead">
              {tools.length} free calculators for the numbers you check on every job -- cameras, storage, power, cabling,
              networks and AV.
            </p>
          </div>
          <div className="tool-hero-art" aria-hidden="true">
            <span className="tool-hero-ring">
              <CalculatorIcon size={96} strokeWidth={1.3} />
            </span>
          </div>
        </div>
      </section>

      {toolGroups.map((group, gi) => (
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
