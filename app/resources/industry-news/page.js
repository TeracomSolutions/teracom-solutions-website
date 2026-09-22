import { BellRing, Cctv, Cpu, Globe, KeyRound, Newspaper, Radio, Rss } from 'lucide-react';
import ResourceHero from '@/components/ResourceHero';
import ResourcesSubNav from '@/components/ResourcesSubNav';
import { getSenNews, categoriseHeadline } from '@/lib/industryNews';
import { pageMetadata } from '@/lib/seo';

// Re-fetch the SEN.news feed at most once an hour.
export const revalidate = 3600;

export const metadata = pageMetadata({
  title: 'Australian Security Industry News | Teracom Solutions',
  description:
    'The latest Australian electronic security industry headlines from SEN.news -- CCTV, access control, alarms, cyber and industry news, updated automatically throughout the day.',
  path: '/resources/industry-news',
});

const TOPIC_ICONS = { video: Cctv, access: KeyRound, alarms: BellRing, cyber: Cpu, industry: Newspaper };

const whenFormat = new Intl.DateTimeFormat('en-AU', {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
  hour: 'numeric',
  minute: '2-digit',
  timeZone: 'Australia/Melbourne',
});
const when = (iso) => (iso ? whenFormat.format(new Date(iso)) : null);

function NewsArt({ topic, size = 64, large = false }) {
  const Icon = TOPIC_ICONS[topic] || Newspaper;
  return (
    <div className={large ? 'news-art news-art-lg' : 'news-art'} data-topic={topic} aria-hidden="true">
      <Icon size={size} strokeWidth={1.2} />
    </div>
  );
}

function Meta({ item }) {
  const stamp = when(item.date);
  return (
    <span className="news-meta">
      <span className="news-tag" data-topic={item.topic.id}>{item.topic.label}</span>
      {stamp ? <span>{stamp}</span> : null}
      <span>SEN.news</span>
    </span>
  );
}

export default async function IndustryNews() {
  const items = (await getSenNews(10)).map((item) => ({ ...item, topic: categoriseHeadline(item.title, item.excerpt) }));
  const [lead, ...rest] = items;
  const topStories = rest.slice(0, 4);
  const more = rest.slice(4);
  const link = { target: '_blank', rel: 'noopener noreferrer' };

  return (
    <main id="main-content">
      <ResourceHero title="Industry News" icon={Newspaper} badges={[Radio, Rss, Globe]}>
        <p className="lead">The latest Australian security industry headlines, updated automatically.</p>
      </ResourceHero>

      <section className="section news-section">
        <div className="container">
          <ResourcesSubNav />

          {items.length === 0 ? (
            <div className="form-note-banner" role="status">
              Industry headlines are temporarily unavailable. Please check back soon.
            </div>
          ) : (
            <>
              <div className="news-topbar">
                <span className="news-live"><span className="news-live-dot" /> Live</span>
                <div className="news-ticker" aria-label="Latest headlines">
                  <div className="news-ticker-track">
                    {[0, 1].map((copy) =>
                      items.map((item) => (
                        <a key={`${copy}-${item.link}`} href={item.link} {...link} aria-hidden={copy === 1 ? 'true' : undefined} tabIndex={copy === 1 ? -1 : undefined}>
                          <span className="news-ticker-dot" data-topic={item.topic.id} />
                          {item.title}
                        </a>
                      ))
                    )}
                  </div>
                </div>
              </div>

              <div className="news-top">
                <a className="news-lead" href={lead.link} {...link}>
                  <NewsArt topic={lead.topic.id} size={140} large />
                  <div className="news-lead-body">
                    <Meta item={lead} />
                    <h2>{lead.title}</h2>
                    {lead.excerpt ? <p>{lead.excerpt}</p> : null}
                    <span className="news-read">Read the full story on SEN.news &rarr;</span>
                  </div>
                </a>

                {topStories.length > 0 ? (
                  <aside className="news-top-list" aria-label="Top stories">
                    <h3>Top stories</h3>
                    <ol>
                      {topStories.map((item, i) => (
                        <li key={item.link}>
                          <a href={item.link} {...link}>
                            <span className="news-rank">{String(i + 2).padStart(2, '0')}</span>
                            <span>
                              <Meta item={item} />
                              <strong>{item.title}</strong>
                            </span>
                          </a>
                        </li>
                      ))}
                    </ol>
                  </aside>
                ) : null}
              </div>

              {more.length > 0 ? (
                <>
                  <h2 className="news-section-title">More headlines</h2>
                  <div className="news-grid">
                    {more.map((item) => (
                      <a className="news-card" href={item.link} key={item.link} {...link}>
                        <NewsArt topic={item.topic.id} size={56} />
                        <div className="news-card-body">
                          <Meta item={item} />
                          <h3>{item.title}</h3>
                          {item.excerpt ? <p>{item.excerpt}</p> : null}
                          <span className="news-read">Read on SEN.news &rarr;</span>
                        </div>
                      </a>
                    ))}
                  </div>
                </>
              ) : null}
            </>
          )}

          <p className="form-note news-attribution">
            Headlines courtesy of{' '}
            <a href="https://sen.news" target="_blank" rel="noopener noreferrer">SEN.news</a>{' '}
            (Security Electronics &amp; Networks), refreshed hourly. Articles open on sen.news.
          </p>
        </div>
      </section>
    </main>
  );
}
