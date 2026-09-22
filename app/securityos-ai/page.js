import Image from 'next/image';
import Link from 'next/link';
import { aiCapabilities } from '@/lib/aiCapabilities';
import CategoryIcon from '@/components/CategoryIcon';
import JsonLd from '@/components/JsonLd';
import { pageMetadata, SITE_ORIGIN, absoluteUrl } from '@/lib/seo';


export const metadata = pageMetadata({
  title: 'Teracom AI | AI Platform for Security & Technical Teams',
  description:
    'Teracom AI is an AI operating system for technicians, engineers and project teams. Product-specific support agents, scope generation, documentation and knowledge tools for platforms including Gallagher, Genetec, Milestone, Inner Range and HID.',
  path: '/securityos-ai',
});

// SoftwareApplication describes the product itself; the ItemList enumerates
// its capabilities so each one is discoverable as a named feature with its own
// URL rather than only as prose inside this page. `offers` is omitted on
// purpose -- subscription pricing lives behind the store's sign-in gate, so
// declaring a price here would contradict what an anonymous visitor sees.
const AI_PLATFORM_SCHEMA = {
  '@type': 'SoftwareApplication',
  name: 'Teracom AI',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  url: absoluteUrl('/securityos-ai'),
  description:
    'An AI operating system for modern organisations. Teracom AI helps technicians, engineers, estimators and project teams access expert knowledge, generate documentation and solve technical challenges faster.',
  publisher: { '@id': `${SITE_ORIGIN}/#organisation` },
  featureList: aiCapabilities.map((capability) => capability.title),
};

const AI_CAPABILITIES_SCHEMA = {
  '@type': 'ItemList',
  name: 'Teracom AI capabilities',
  itemListElement: aiCapabilities.map((capability, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: capability.title,
    url: absoluteUrl(`/securityos-ai/${capability.slug}`),
  })),
};

export default function SecurityOSAI() {
  return (
    <main id="main-content">
      <JsonLd schema={AI_PLATFORM_SCHEMA} />
      <JsonLd schema={AI_CAPABILITIES_SCHEMA} />
      <section className="hero hero-product">
        <div className="container hero-layout">
          <div className="hero-copy">
            <span className="eyebrow">Available now</span>
            <h1>Teracom AI: the AI operating system for modern organisations.</h1>
            <p className="lead">
              A focused platform for technical support, documentation, estimation assistance, tender support and
              knowledge management — built from real electronic security industry expertise, designed for
              organisations of any kind.
            </p>
            <div className="hero-actions">
              <Link className="btn btn-primary" href="/store">
                View Plans
              </Link>
              <Link className="btn btn-secondary" href="/">
                Back to Teracom
              </Link>
            </div>
          </div>
          <div className="hero-image">
            <Image
              src="/assets/teracom-ai-ask-tera.webp"
              alt="Ask Tera -- the Teracom AI mascot at a laptop with options to find a product, get technical support, create a scope, get a quote or tender assistance"
              width={1536}
              height={1024}
              sizes="(max-width: 980px) 100vw, 55vw"
              priority
            />
          </div>
        </div>
      </section>

      <section className="section section-spacious">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">Capabilities</span>
            <h2>Designed for the workflows technical and project teams repeat every day.</h2>
            <p>
              Every capability below is live today, not a roadmap slide — grounded in real electronic security
              product knowledge, not generic search results.
            </p>
          </div>
        </div>
      </section>

      {aiCapabilities.map((c, i) => (
        <section className="section section-spacious capability-section" key={c.slug}>
          <div className={`container showcase-grid${i % 2 === 1 ? ' reverse' : ''}`}>
            <div className="showcase-copy">
              <div className="category-heading-row">
                {c.icon && (
                  <span className="category-icon-badge">
                    <CategoryIcon slug={c.icon} />
                  </span>
                )}
                <h2>{c.title}</h2>
              </div>
              <p className="lead">{c.summary}</p>
              <p>{c.description}</p>
              <ul className="tick-list">
                {c.benefits.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
              <Link className="btn btn-secondary" href={`/securityos-ai/${c.slug}`}>
                Explore {c.title} &rarr;
              </Link>
            </div>
            <div className="showcase-image capability-showcase-image">
              {c.imageFile ? (
                <Image
                  src={`/assets/ai-capabilities/${c.imageFile}`}
                  alt={`${c.title} illustration`}
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 980px) 100vw, 45vw"
                />
              ) : null}
            </div>
          </div>
        </section>
      ))}

      <section className="section section-spacious">
        <div className="container">
          <div className="brand-store-cta">
            <div>
              <h3>Ready to see it running on your own work?</h3>
              <p>View plans to get your organisation set up on Teracom AI.</p>
            </div>
            <Link className="btn btn-primary" href="/store">
              View Plans
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
