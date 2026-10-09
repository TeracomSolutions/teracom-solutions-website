import Link from 'next/link';
import { ArrowRight, BookOpen, FileText, LifeBuoy, Newspaper } from 'lucide-react';

import ResourceHero from '@/components/ResourceHero';
import ResourcesSubNav from '@/components/ResourcesSubNav';
import { articles } from '@/lib/articles';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Security, Power and AV Guides | Teracom Solutions',
  description:
    'Plain-English guides from Teracom Solutions: access control, intruder alarms, uninterruptible power supplies and projector screens.',
  path: '/resources/articles',
});

export default function ArticlesPage() {
  return (
    <main id="main-content">
      <ResourceHero title="Articles" icon={BookOpen} badges={[Newspaper, FileText, LifeBuoy]}>
        <p className="lead">Plain-English guides to the security, power and audio visual equipment we supply and install.</p>
      </ResourceHero>
      <section className="section section-spacious">
        <div className="container">
          <ResourcesSubNav />
          <div className="tools-grid">
            {articles.map((article) => (
              <Link href={`/resources/articles/${article.slug}`} className="tool-card" key={article.slug}>
                <h3>{article.title}</h3>
                <p>{article.description}</p>
                <span className="tool-card-cta">
                  Read <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}