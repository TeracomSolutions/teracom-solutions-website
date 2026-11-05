import Link from 'next/link';
import { notFound } from 'next/navigation';

import JsonLd from '@/components/JsonLd';
import { growthOn, paragraphs, publishedItems } from '@/lib/api/growthPublic';
import { absoluteUrl, pageMetadata } from '@/lib/seo';

// Questions people ask, answered (growth tool 10), with the FAQ data Google reads.
export const revalidate = 3600;

export const metadata = pageMetadata({
  title: 'Questions customers ask | Teracom Solutions',
  description: 'Straight answers about CCTV, alarms and monitoring, access control, intercoms and networks from the Teracom Solutions team.',
  path: '/questions',
});

export default async function QuestionsPage() {
  const items = (await growthOn('questions')) ? await publishedItems('questions') : [];
  if (items.length === 0) notFound();
  return (
    <main id="main-content">
      <JsonLd schema={{
        '@type': 'FAQPage',
        url: absoluteUrl('/questions'),
        mainEntity: items.map((item) => ({
          '@type': 'Question',
          name: item.title,
          acceptedAnswer: { '@type': 'Answer', text: [item.summary, ...paragraphs(item.body)].filter(Boolean).join(' ') },
        })),
      }} />
      <section className="hero hero-product hero-shallow">
        <div className="container">
          <span className="eyebrow">Questions</span>
          <h1>Questions customers ask.</h1>
          <p className="lead">Straight answers from our team. Cannot see yours? <Link href="/contact">Ask us</Link>.</p>
        </div>
      </section>
      <section className="section">
        <div className="container growth-public-questions">
          {items.map((item) => (
            <details key={item.slug} id={item.slug}>
              <summary>{item.title}</summary>
              {item.summary ? <p><strong>{item.summary}</strong></p> : null}
              {paragraphs(item.body).map((p, i) => <p key={i}>{p}</p>)}
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}
