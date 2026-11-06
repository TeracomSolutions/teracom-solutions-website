import Link from 'next/link';
import { ArrowRight, BookOpen, FileText, LifeBuoy, Newspaper } from 'lucide-react';

import ResourceHero from '@/components/ResourceHero';
import ResourcesSubNav from '@/components/ResourcesSubNav';
import { articles } from '@/lib/articles';
import { fetchPublishedNewsArticles } from '@/lib/api/newsArticles';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Security, Power and AV Guides | Teracom Solutions',
  description:
    'Plain-English guides from Teracom Solutions: access control, intruder alarms, uninterruptible power supplies and projector screens.',
  path: '/resources/articles',
});

// Published articles from industry news (console Resources > Articles) show within an hour,
// or at once when staff publish one.
export const revalidate = 3600;

export default async function ArticlesPage() {
  const fromNews = await fetchPublishedNewsArticles();
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
          {fromNews.length ? (
            <>
              <h2 className="request-subheading">From the industry news</h2>
              <p className="form-note">Our take on what recent industry news means for Australian businesses and installers.</p>
              <div className="tools-grid">
                {fromNews.map((article) => (
                  <Link href={`/resources/articles/${article.slug}`} className="tool-card" key={article.slug}>
                    <h3>{article.title}</h3>
                    <p>{article.description}</p>
                    <span className="tool-card-cta">
                      Read <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
                    </span>
                  </Link>
                ))}
              </div>
            </>
          ) : null}
        </div>
      </section>
    </main>
  );
}