import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Columns3, Scale, ShieldCheck, Video } from 'lucide-react';

import AskTeraNudge from '@/components/AskTeraNudge';
import ComparisonTable from '@/components/ComparisonTable';
import ResourceHero from '@/components/ResourceHero';
import ToolPrintButton from '@/components/tools/ToolPrintButton';
import { getComparison, getComparisons } from '@/lib/comparisons';
import { pageMetadata } from '@/lib/seo';

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  return (await getComparisons()).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata(props) {
  const { slug } = await props.params;
  const comparison = await getComparison(slug);
  if (!comparison) return {};
  return pageMetadata({
    title: `${comparison.title}: ${comparison.products.map((p) => p.name).slice(0, 4).join(', ')} | Teracom`,
    description: comparison.intro || `${comparison.title}, side by side from each maker's own website.`,
    path: `/resources/comparisons/${comparison.slug}`,
  });
}

export default async function ComparisonPage(props) {
  const { slug } = await props.params;
  const comparison = await getComparison(slug);
  if (!comparison || !comparison.products?.length) notFound();

  return (
    <main id="main-content">
      <ResourceHero title={comparison.title} icon={Scale} badges={[Video, Columns3, ShieldCheck]}>
        {comparison.intro ? <p className="lead">{comparison.intro}</p> : null}
        <p className="print-hide">
          <Link href="/resources/comparisons">All product comparisons</Link>
        </p>
        <ToolPrintButton />
      </ResourceHero>
      <section className="section cmp-section">
        <div className="container cmp-container">
          <ComparisonTable comparison={comparison} />
          <p>
            Choosing a system for your site? <Link href="/contact">Talk to our team</Link> and we&apos;ll help you pick
            and price the right one.
          </p>
          <p className="print-hide">
            Questions about any of these? <AskTeraNudge question={`Which is best for my site: ${comparison.products.map((p) => p.name).join(', ')}?`} label="Ask Tera" />, our AI support assistant.
          </p>
        </div>
      </section>
    </main>
  );
}
