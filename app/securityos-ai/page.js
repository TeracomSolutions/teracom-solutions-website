import Image from 'next/image';
import Link from 'next/link';
import { aiCapabilities } from '@/lib/aiCapabilities';
import CategoryIcon from '@/components/CategoryIcon';

export default function SecurityOSAI() {
  return (
    <main>
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
            <Image src="/assets/teracom-ai-mascot.png" alt="Teracom AI mascot" width={700} height={700} />
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
