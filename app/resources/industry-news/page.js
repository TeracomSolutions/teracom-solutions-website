import { pageMetadata } from '@/lib/seo';
import ResourcesSubNav from '@/components/ResourcesSubNav';
import Breadcrumbs from '@/components/Breadcrumbs';
import { getSenNews } from '@/lib/industryNews';

export const revalidate = 3600;

export const metadata = pageMetadata({
  title: 'Australian Security Industry News | Teracom Solutions',
  description: 'The latest Australian electronic security industry headlines from SEN.news, updated automatically throughout the day.',
  path: '/resources/industry-news'
});

export default async function IndustryNews() {
  const newsItems = await getSenNews();

  return (
    <main id="main-content">
      <section className="hero hero-product hero-shallow">
        <div className="container hero-layout">
          <div className="hero-copy">
            <Breadcrumbs
              items={[{ name: 'Resources', href: '/resources' }]}
              current={'Industry News'}
            />
            <h1>Industry News</h1>
            <p className="lead">The latest Australian security industry headlines, updated automatically.</p>
          </div>
        </div>
      </section>
      <section className="section section-spacious">
        <div className="container">
          <ResourcesSubNav />
          
          {newsItems.length > 0 ? (
            <div className="news-grid">
              {newsItems.map((item, index) => (
                <a 
                  className={index === 0 ? 'news-card news-card-featured' : 'news-card'} 
                  href={item.link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  key={item.link}
                >
                  <span className="news-meta">
                    {item.date 
                      ? new Date(item.date).toLocaleDateString('en-AU', { 
                          day: 'numeric', 
                          month: 'short', 
                          year: 'numeric' 
                        }) + ' · SEN.news'
                      : 'SEN.news'
                    }
                  </span>
                  <h3>{item.title}</h3>
                  {item.excerpt ? <p>{item.excerpt}</p> : null}
                  <span className="news-read">Read on SEN.news →</span>
                </a>
              ))}
            </div>
          ) : (
            <div className="form-note-banner" role="status">
              Industry headlines are temporarily unavailable. Please check back soon.
            </div>
          )}
          
          <p className="form-note">
            Headlines courtesy of <a href="https://sen.news" target="_blank" rel="noopener noreferrer">SEN.news</a> (Security Electronics & Networks). Articles open on sen.news.
          </p>
        </div>
      </section>
    </main>
  );
}