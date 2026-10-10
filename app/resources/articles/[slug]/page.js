import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, BookOpen, FileText, Newspaper } from 'lucide-react';

import Breadcrumbs from '@/components/Breadcrumbs';
import JsonLd from '@/components/JsonLd';
import OrbitArt from '@/components/OrbitArt';
import { articles, getArticle } from '@/lib/articles';
import { SITE_NAME, absoluteUrl, pageMetadata } from '@/lib/seo';
import { withSeoTitle } from '@/lib/seoTitles';

// A title approved on the console's Search page shows within five minutes.
export const revalidate = 300;

const HEADING_2 = { fontSize: '28px', margin: '40px 0 12px' };
const HEADING_3 = { fontSize: '21px', margin: '28px 0 8px' };
const LIST = { color: 'var(--muted)', lineHeight: 1.7, paddingLeft: '22px', margin: '0 0 18px' };

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata(props) {
  const params = await props.params;
  const article = getArticle(params.slug);
  if (!article) return {};
  return withSeoTitle(
    pageMetadata({
      title: `${article.title} | ${SITE_NAME}`,
      description: article.description,
      path: `/resources/articles/${article.slug}`,
      type: 'article',
    }),
    `/resources/articles/${article.slug}`,
  );
}

function Item({ item }) {
  if (typeof item === 'string') return <li>{item}</li>;
  return (
    <li>
      <strong style={{ color: 'var(--text)' }}>{item.term}.</strong> {item.text}
    </li>
  );
}

function Block({ block }) {
  if (block.type === 'h2') return <h2 style={HEADING_2}>{block.text}</h2>;
  if (block.type === 'h3') return <h3 style={HEADING_3}>{block.text}</h3>;
  if (block.type === 'ul') {
    return (
      <ul style={LIST}>
        {block.items.map((item, index) => (
          <Item key={index} item={item} />
        ))}
      </ul>
    );
  }
  if (block.type === 'ol') {
    return (
      <ol style={LIST}>
        {block.items.map((item, index) => (
          <Item key={index} item={item} />
        ))}
      </ol>
    );
  }
  return <p>{block.text}</p>;
}

export default async function ArticlePage(props) {
  const params = await props.params;
  const article = getArticle(params.slug);
  if (!article) notFound();

  const path = `/resources/articles/${article.slug}`;
  const schema = {
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    datePublished: article.published,
    dateModified: article.published,
    author: { '@type': 'Organization', name: SITE_NAME },
    publisher: { '@type': 'Organization', name: SITE_NAME },
    mainEntityOfPage: absoluteUrl(path),
  };

  return (
    <main id="main-content">
      <JsonLd schema={schema} />
      <section className="hero hero-product hero-shallow tool-hero">
        <div className="container hero-layout tool-hero-layout">
          <div className="hero-copy">
            <Breadcrumbs
              items={[
                { name: 'Resources', href: '/resources' },
                { name: 'Articles', href: '/resources/articles' },
              ]}
              current={article.title}
            />
            <span className="eyebrow">Article</span>
            <h1>{article.title}</h1>
            <p className="lead">{article.description}</p>
          </div>
          <OrbitArt icon={BookOpen} badges={[Newspaper, FileText, BookOpen]} />
        </div>
      </section>

      <section className="section section-spacious">
        <div className="container" style={{ maxWidth: '860px' }}>
          <article className="copy-block">
            {article.blocks.map((block, index) => (
              <Block key={index} block={block} />
            ))}
          </article>

          <div className="copy-block" style={{ marginTop: '36px' }}>
            <h2 style={HEADING_3}>Related</h2>
            <ul style={LIST}>
              {article.related.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} style={{ color: 'var(--text)', textDecoration: 'underline' }}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="form-note">
              <ArrowLeft size={16} strokeWidth={1.8} aria-hidden="true" focusable="false" />{' '}
              <Link href="/resources/articles">All articles</Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}