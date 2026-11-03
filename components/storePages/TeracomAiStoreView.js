import Link from 'next/link';
import { Bot, Puzzle } from 'lucide-react';

import { fetchDepartmentCatalogue } from '@/lib/api/departmentCatalogue';
import { groupCatalogue } from '@/lib/departmentCatalogue';
import { pageMetadata } from '@/lib/seo';

// Store > Teracom AI (Robert, 2026-11-03): Teracom's own software in its own section
// of the store, so it is easy to find. Every Department and extension pack comes from
// Global's live catalogue (lib/departmentCatalogue.js). No prices are published yet,
// so each one asks for interest instead; when Robert approves prices they go here.
export const teracomAiStoreMetadata = pageMetadata({
  title: 'Teracom AI Departments and Extension Packs | Teracom Store',
  description: 'Teracom AI software in the Teracom Store: every Department and extension pack, what each one does, its digital workers and which plans include it.',
  path: '/store/teracom-ai',
});

const interest = (name) => `/?interest=${encodeURIComponent(`Teracom AI ${name}`)}#contact`;
const workersText = (w) => (typeof w === 'number' ? (w ? `${w} digital worker${w === 1 ? '' : 's'}` : '') : w.join(', '));

function PackCard({ pack, kind }) {
  return (
    <article className="product-card ai-pack-card">
      <div>
        <span className="badge">{kind}</span>
        <h3>{pack.name}</h3>
        {pack.description ? <p>{pack.description}</p> : null}
        <p className="ai-pack-meta">
          {[workersText(pack.workers), pack.tiers.length ? `Included in ${pack.tiers.join(', ')}` : '', pack.version ? `Version ${pack.version}` : '']
            .filter(Boolean)
            .join(' · ')}
        </p>
        {pack.extensions?.length ? (
          <p className="ai-pack-meta">Extension packs: {pack.extensions.map((e) => e.name).join(', ')}</p>
        ) : null}
      </div>
      <div>
        <p className="price">Pricing coming soon</p>
        <Link className="btn btn-primary" href={interest(pack.name)}>Register interest</Link>
      </div>
    </article>
  );
}

export default async function TeracomAiStoreView() {
  const { entries } = await fetchDepartmentCatalogue();
  const { departments, loose } = groupCatalogue(entries);
  const extensions = [...departments.flatMap((d) => d.extensions.map((e) => ({ ...e, home: d.name }))), ...loose];
  return (
    <main id="main-content">
      <section className="hero hero-product hero-shallow store-hero">
        <div className="container">
          <div className="hero-copy">
            <span className="eyebrow">Teracom Store · Teracom AI</span>
            <h1>Teracom AI Departments and extension packs.</h1>
            <p className="lead">
              Deploy a Department, or build an entire AI organisation. Each Department brings its own digital workers,
              working from one organisational memory and under your approval. Extension packs add to a Department when you
              switch them on.
            </p>
            <p className="store-gst">
              {departments.length} Departments and {extensions.length} extension pack{extensions.length === 1 ? '' : 's'}.{' '}
              <Link href="/teracom-ai" style={{ color: 'inherit', textDecoration: 'underline' }}>How Teracom AI works</Link>
            </p>
          </div>
        </div>
      </section>

      <section className="section section-spacious">
        <div className="container">
          <div className="section-heading left">
            <span className="eyebrow"><Bot size={16} aria-hidden="true" /> Departments</span>
            <h2>Departments</h2>
          </div>
          <div className="product-grid">
            {departments.map((d) => <PackCard key={d.slug} pack={d} kind="Department" />)}
          </div>
        </div>
      </section>

      {extensions.length ? (
        <section className="section section-spacious alt">
          <div className="container">
            <div className="section-heading left">
              <span className="eyebrow"><Puzzle size={16} aria-hidden="true" /> Extension packs</span>
              <h2>Extension packs</h2>
            </div>
            <div className="product-grid">
              {extensions.map((e) => <PackCard key={e.slug} pack={e} kind={e.home ? `${e.home} extension` : 'Extension pack'} />)}
            </div>
          </div>
        </section>
      ) : null}

      <section className="section">
        <div className="container">
          <p>
            Looking for Teracom AI subscriptions? They are on the <Link href="/store#subscriptions">Teracom Store</Link> front page.
            Questions about which Department fits your organisation? <Link href="/?interest=Teracom%20AI#contact">Talk to us</Link>.
          </p>
        </div>
      </section>
    </main>
  );
}
