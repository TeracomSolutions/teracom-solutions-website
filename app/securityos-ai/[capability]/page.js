import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { aiCapabilities, findAiCapability } from '@/lib/aiCapabilities';

export function generateStaticParams() {
  return aiCapabilities.map((c) => ({ capability: c.slug }));
}

export function generateMetadata({ params }) {
  const capability = findAiCapability(params.capability);
  if (!capability) return {};
  return {
    title: `${capability.title} | Teracom AI`,
    description: capability.summary,
  };
}

export default function CapabilityPage({ params }) {
  const capability = findAiCapability(params.capability);
  if (!capability) notFound();

  return (
    <main>
      <section className="hero hero-product hero-shallow">
        <div className="container hero-layout">
          <div className="hero-copy">
            <span className="eyebrow">
              <Link href="/securityos-ai" style={{ color: 'inherit' }}>
                &larr; Teracom AI
              </Link>
            </span>
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
          <div className="showcase-image">
            <Image src="/assets/securityos-dashboard.svg" alt="Teracom AI dashboard concept" width={1200} height={760} />
          </div>
        </div>
      </section>
    </main>
  );
}
