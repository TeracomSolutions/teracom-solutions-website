import Link from 'next/link';

import { NEWS_SOURCES, categoriseHeadline, getAllIndustryNews } from '@/lib/industryNews';

// The Industry News live ticker on the homepage, just under the banner
// (Robert, 2026-10-03). Same feeds, look and hourly refresh as
// /resources/industry-news. If no headlines load, nothing is shown.
const link = { target: '_blank', rel: 'noopener noreferrer' };

function withTopic(item) {
  const topic =
    item.sourceId === 'security' ? categoriseHeadline(item.title, item.excerpt) : { id: item.sourceId, label: item.industry };
  return { ...item, topic };
}

export default async function HomeNewsTicker() {
  let items = [];
  try {
    const bySource = await getAllIndustryNews(6);
    items = NEWS_SOURCES.flatMap((s) => bySource[s.id] || [])
      .map(withTopic)
      .sort((a, b) => (b.date || '').localeCompare(a.date || ''))
      .slice(0, 16);
  } catch {
    items = [];
  }
  if (items.length === 0) return null;

  return (
    <section className="home-news" aria-label="Latest industry news">
      <div className="container news-topbar home-news-bar">
        <Link href="/resources/industry-news" className="news-live">
          <span className="news-live-dot" /> Live
        </Link>
        <div className="news-ticker" aria-label="Latest headlines">
          <div className="news-ticker-track">
            {[0, 1].map((copy) =>
              items.map((item) => (
                <a
                  key={`${copy}-${item.link}`}
                  href={item.link}
                  {...link}
                  aria-hidden={copy === 1 ? 'true' : undefined}
                  tabIndex={copy === 1 ? -1 : undefined}
                >
                  <span className="news-ticker-dot" data-topic={item.topic.id} />
                  {item.title}
                </a>
              ))
            )}
          </div>
        </div>
        <Link href="/resources/industry-news" className="home-news-all">All news &rarr;</Link>
      </div>
    </section>
  );
}