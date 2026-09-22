import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, MessageSquareText, PackageCheck, PackageOpen, RotateCcw, ShieldCheck, Truck } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import ProcessSteps from '@/components/ProcessSteps';
import { warrantyEntries } from '@/lib/warranties';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Warranty & Returns | Teracom Solutions',
  description:
    'How to return a product to Teracom Solutions, and links to the manufacturer warranty terms for every brand we supply.',
  path: '/warranty',
});

const RETURN_STEPS = [
  {
    icon: MessageSquareText,
    title: 'Contact us first',
    text: 'Tell us the product, where and when you bought it, and what is wrong with it.',
  },
  {
    icon: PackageOpen,
    title: 'Pack it carefully',
    text: 'Teracom Solutions is not responsible for damage or loss caused by shipping -- damage from inappropriate packaging will result in additional repair charges.',
  },
  {
    icon: Truck,
    title: 'Send it back',
    text: 'We will confirm where to send it and let you know the next steps.',
  },
];

export default function Warranty() {
  return (
    <main id="main-content">
      <section className="hero hero-product hero-shallow tool-hero">
        <div className="container hero-layout tool-hero-layout">
          <div className="hero-copy">
            <Breadcrumbs items={[]} current="Warranty & Returns" />
            <span className="eyebrow">Warranty & Returns</span>
            <h1>Warranty & Product Returns</h1>
            <p className="lead">
              How to send a product back to us, and the manufacturer warranty terms for every brand we supply.
            </p>
          </div>
          <div className="tool-hero-art orbit-emblem" aria-hidden="true">
            <span className="tool-hero-ring">
              <PackageCheck size={96} strokeWidth={1.3} aria-hidden="true" focusable="false" />
            </span>
            <span className="orbit-sat orbit-sat-1"><ShieldCheck size={22} strokeWidth={1.8} /></span>
            <span className="orbit-sat orbit-sat-2"><RotateCcw size={22} strokeWidth={1.8} /></span>
            <span className="orbit-sat orbit-sat-3"><Truck size={22} strokeWidth={1.8} /></span>
          </div>
        </div>
      </section>

      <section className="section section-spacious">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">Returns</span>
            <h2>Returning a product.</h2>
            <p>Talk to us before sending anything back, so we can get it to the right place quickly.</p>
          </div>
          <ProcessSteps steps={RETURN_STEPS} />
          <p className="warranty-cta">
            <Link className="btn btn-primary" href="/contact">
              Start a return <ArrowRight size={18} strokeWidth={2} aria-hidden="true" />
            </Link>
          </p>
        </div>
      </section>

      <section className="section section-spacious alt" id="brands">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">Manufacturer warranties</span>
            <h2>Warranties by brand.</h2>
            <p>
              Most products we supply carry the manufacturer&apos;s own warranty, separate to our returns process.
              Select a brand to read its current warranty terms.
            </p>
          </div>
          <div className="feature-grid brands-grid warranty-grid">
            {warrantyEntries.map((w) => {
              const card = (
                <article>
                  <div className="brand-card-heading">
                    <h3>{w.name}</h3>
                    {w.logoFile && (
                      <Image
                        className="brand-card-logo"
                        src={`/assets/logos/${w.logoFile}`}
                        alt={`${w.name} logo`}
                        width={110}
                        height={30}
                      />
                    )}
                  </div>
                  <p>{w.note}</p>
                  <span className="warranty-link">
                    {w.external ? 'View warranty' : 'Contact us'}{' '}
                    {w.external ? (
                      <ArrowUpRight size={16} strokeWidth={2} aria-hidden="true" />
                    ) : (
                      <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
                    )}
                  </span>
                </article>
              );
              const style = w.accent ? { '--card-accent': w.accent } : undefined;
              return w.external ? (
                <a
                  key={w.slug}
                  href={w.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={style}
                  aria-label={`${w.name} warranty terms (opens the manufacturer's website)`}
                >
                  {card}
                </a>
              ) : (
                <Link key={w.slug} href={w.url} style={style} aria-label={`${w.name} warranty -- contact Teracom`}>
                  {card}
                </Link>
              );
            })}
          </div>
          <p className="form-note warranty-footnote">
            Manufacturer warranty terms are set by each manufacturer and can change -- the linked page is always the
            current version. Your rights under the Australian Consumer Law are not affected.
          </p>
        </div>
      </section>
    </main>
  );
}
