import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { aiCapabilities, findAiCapability } from '@/lib/aiCapabilities';
import Breadcrumbs from '@/components/Breadcrumbs';
import { pageMetadata } from '@/lib/seo';

export function generateStaticParams() {
  return aiCapabilities.map((c) => ({ capability: c.slug }));
}

export function generateMetadata({ params }) {
  const capability = findAiCapability(params.capability);
  if (!capability) return {};
  return pageMetadata({
    title: `${capability.title} | Teracom AI`,
    description: capability.summary,
    path: `/securityos-ai/${capability.slug}`,
  });
}

export default function CapabilityPage({ params }) {
  const capability = findAiCapability(params.capability);
  if (!capability) notFound();

  return (
    <main id="main-content">
      <section className="hero hero-product hero-shallow">
        <div className="container hero-layout">
          <div className="hero-copy">
            <Breadcrumbs
              items={[{ name: 'Teracom AI', href: '/securityos-ai' }]}
              current={capability.title}
            />
            <h1>{capability.title}</h1>
            <p className="lead">{capability.summary}</p>
          </div>
        </div>
      </section>
      <section className="section section-spacious">
        <div className="container showcase-grid reverse">
          <div className="showcase-copy">
            <p>{capability.description}</p>
            <ul className="tick-list">
              {capability.benefits.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
            <Link className="btn btn-primary" href="/store">
              View Plans
            </Link>
          </div>
          <div className="showcase-image capability-showcase-image">
            {capability.imageFile ? (
              <Image
                src={`/assets/ai-capabilities/${capability.imageFile}`}
                alt={`${capability.title} illustration`}
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 980px) 100vw, 45vw"
              />
            ) : (
              <Image src="/assets/securityos-dashboard.svg" alt="Teracom AI dashboard concept" width={1200} height={760} />
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
