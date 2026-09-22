import Link from 'next/link';
import {
  BellRing,
  BrainCircuit,
  Cctv,
  Cpu,
  Droplets,
  Globe,
  HardHat,
  HouseWifi,
  KeyRound,
  Megaphone,
  MonitorSpeaker,
  Newspaper,
  Radio,
  Rss,
  Server,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import ResourceHero from '@/components/ResourceHero';
import ResourcesSubNav from '@/components/ResourcesSubNav';
import { NEWS_SOURCES, categoriseHeadline, findNewsSource, getAllIndustryNews } from '@/lib/industryNews';
import { pageMetadata } from '@/lib/seo';

// Feeds are re-fetched at most once an hour (see lib/industryNews.js).
export const revalidate = 3600;

export const metadata = pageMetadata({
  title: 'Industry News: Security, Electrical, AV, IT & More | Teracom Solutions',
  description:
    'The latest Australian industry headlines in one place -- security, electrical, plumbing, building and construction, audio visual, IT and cyber, AI, marketing and smart home -- updated automatically every hour.',
  path: '/resources/industry-news',
});

// Security headlines keep their finer topic tags; every other industry is
// tagged with the industry itself.
const TOPIC_ICONS = {
  video: Cctv,
  access: KeyRound,
  alarms: BellRing,
  cyber: Cpu,
  industry: Newspaper,
  security: ShieldCheck,
  electrical: Zap,
  plumbing: Droplets,
  construction: HardHat,
  av: MonitorSpeaker,
  it: Server,
  ai: BrainCircuit,
  marketing: Megaphone,
  'smart-home': HouseWifi,
};

const whenFormat = new Intl.DateTimeFormat('en-AU', {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
  hour: 'numeric',
  minute: '2-digit',
  timeZone: 'Australia/Melbourne',
});
const when = (iso) => (iso ? whenFormat.format(new Date(iso)) : null);
const newestFirst = (a, b) => (b.date || '').localeCompare(a.date || '');
const link = { target: '_blank', rel: 'noopener noreferrer' };

function withTopic(item) {
  const topic =
    item.sourceId === 'security' ? categoriseHeadline(item.title, item.excerpt) : { id: item.sourceId, label: item.industry };
  return { ...item, topic };
}

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
      <span>{item.source}</span>
    </span>
  );
}

function NewsCard({ item }) {
  return (
    <a className="news-card" href={item.link} {...link}>
      <NewsArt topic={item.topic.id} size={56} />
      <div className="news-card-body">
        <Meta item={item} />
        <h3>{item.title}</h3>
        {item.excerpt ? <p>{item.excerpt}</p> : null}
        <span className="news-read">Read on {item.source} &rarr;</span>
      </div>
    </a>
  );
}

function Ticker({ items }) {
  return (
    <div className="news-topbar">
      <span className="news-live"><span className="news-live-dot" /> Live</span>
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
    </div>
  );
}

function FrontPage({ items }) {
  const [lead, ...rest] = items;
  const topStories = rest.slice(0, 4);
  const more = rest.slice(4);
  return (
    <>
      <div className="news-top">
        <a className="news-lead" href={lead.link} {...link}>
          <NewsArt topic={lead.topic.id} size={140} large />
          <div className="news-lead-body">
            <Meta item={lead} />
            <h2>{lead.title}</h2>
            {lead.excerpt ? <p>{lead.excerpt}</p> : null}
            <span className="news-read">Read the full story on {lead.source} &rarr;</span>
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
              <NewsCard item={item} key={item.link} />
            ))}
          </div>
        </>
      ) : null}
    </>
  );
}

export default async function IndustryNews(props) {
  const searchParams = await props.searchParams;
  const selected = findNewsSource(typeof searchParams?.industry === 'string' ? searchParams.industry : '');
  const bySource = await getAllIndustryNews(8);
  const all = NEWS_SOURCES.flatMap((s) => bySource[s.id].map(withTopic));
  const available = NEWS_SOURCES.filter((s) => bySource[s.id].length > 0);
  const items = selected ? bySource[selected.id].map(withTopic) : all;
  const tickerItems = [...items].sort(newestFirst).slice(0, 16);

  return (
    <main id="main-content">
      <ResourceHero title="Industry News" icon={Newspaper} badges={[Radio, Rss, Globe]}>
        <p className="lead">
          The latest Australian industry headlines in one place -- security, electrical, plumbing, construction, AV,
          IT, AI, marketing and smart home -- updated automatically.
        </p>
      </ResourceHero>

      <section className="section news-section">
        <div className="container">
          <ResourcesSubNav />

          <nav className="news-tabs" aria-label="Industries">
            <Link href="/resources/industry-news" aria-current={selected ? undefined : 'page'}>All industries</Link>
            {NEWS_SOURCES.map((s) => (
              <Link
                key={s.id}
                href={`/resources/industry-news?industry=${s.id}`}
                data-topic={s.id}
                aria-current={selected?.id === s.id ? 'page' : undefined}
              >
                {s.label}
              </Link>
            ))}
          </nav>

          {items.length === 0 ? (
            <div className="form-note-banner" role="status">
              {selected ? `${selected.label} headlines are` : 'Industry headlines are'} temporarily unavailable. Please
              check back soon.
            </div>
          ) : (
            <>
              <Ticker items={tickerItems} />
              {selected ? (
                <FrontPage items={items} />
              ) : (
                <>
                  <FrontPage items={bySource.security.length ? bySource.security.map(withTopic).slice(0, 5) : tickerItems.slice(0, 5)} />
                  {available
                    .filter((s) => s.id !== 'security' || !bySource.security.length)
                    .map((s) => (
                      <section className="news-industry" key={s.id} aria-labelledby={`news-${s.id}`}>
                        <div className="news-industry-head">
                          <h2 id={`news-${s.id}`} className="news-section-title">
                            <span className="news-industry-dot" data-topic={s.id} />
                            {s.label}
                            <small>{s.source}</small>
                          </h2>
                          <Link href={`/resources/industry-news?industry=${s.id}`} className="news-industry-more">
                            All {s.label.toLowerCase()} news &rarr;
                          </Link>
                        </div>
                        <div className="news-grid">
                          {bySource[s.id].slice(0, 3).map((item) => (
                            <NewsCard item={withTopic(item)} key={item.link} />
                          ))}
                        </div>
                      </section>
                    ))}
                </>
              )}
            </>
          )}

          <p className="form-note news-attribution">
            Headlines courtesy of{' '}
            {NEWS_SOURCES.map((s, i) => (
              <span key={s.id}>
                <a href={s.site} target="_blank" rel="noopener noreferrer">{s.source}</a>
                {i < NEWS_SOURCES.length - 2 ? ', ' : i === NEWS_SOURCES.length - 2 ? ' and ' : ''}
              </span>
            ))}
            , refreshed hourly. Every article opens on the publisher&apos;s own site.
          </p>
        </div>
      </section>
    </main>
  );
}
