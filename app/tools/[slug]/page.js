import { notFound } from 'next/navigation';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import ConfigCalculator from '@/components/tools/ConfigCalculator';
import { tools } from '@/lib/tools';
import { pageMetadata } from '@/lib/seo';

// Calculators driven by lib/toolConfigs.js. The four original calculators keep
// their own folders under app/tools/, which take precedence over this route.
const configTools = tools.filter((t) => t.config);

export const dynamicParams = false;

export function generateStaticParams() {
  return configTools.map((t) => ({ slug: t.slug }));
}

export function generateMetadata({ params }) {
  const tool = configTools.find((t) => t.slug === params.slug);
  if (!tool) return {};
  return pageMetadata({
    title: `${tool.title} | Teracom Solutions`,
    description: tool.description,
    path: `/tools/${tool.slug}`,
  });
}

export default function ToolPage({ params }) {
  const tool = configTools.find((t) => t.slug === params.slug);
  if (!tool) notFound();

  return (
    <main id="main-content">
      <section className="hero hero-product hero-shallow">
        <div className="container hero-layout">
          <div className="hero-copy">
            <Breadcrumbs items={[{ name: 'Tools', href: '/tools' }]} current={tool.title} />
            <h1>{tool.title}</h1>
            <p className="lead">{tool.description}</p>
          </div>
        </div>
      </section>

      <ConfigCalculator slug={tool.slug} />

      <section className="section section-spacious">
        <div className="container">
          <h2>How it works</h2>
          <p>{tool.howItWorks}</p>
          <p>
            Need help designing a system? <Link href="/contact">Talk to our team</Link>.
          </p>
        </div>
      </section>
    </main>
  );
}
