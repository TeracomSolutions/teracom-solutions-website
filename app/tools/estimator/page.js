import { Calculator, FileText, ShoppingCart, Wrench } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import OrbitArt from '@/components/OrbitArt';
import Estimator from '@/components/tools/Estimator';
import ToolSignInGate from '@/components/tools/ToolSignInGate';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Job Estimator and Proposal Builder for Installers | Teracom Solutions',
  description:
    'Estimate security, CCTV, network and AV jobs from our store\'s products at your price, add your labour and markup, and turn it into a proposal PDF in your business name. Free for Teracom members.',
  path: '/tools/estimator',
});

// The Estimator (Robert, 20 November 2026): a signed-in customer estimates a job from
// the store's products plus their own labour, saves it to their account and drafts a
// proposal. The page is static; the estimator runs in the browser.
export default function EstimatorPage() {
  return (
    <main id="main-content">
      <section className="hero hero-product hero-shallow tool-hero">
        <div className="container hero-layout tool-hero-layout">
          <div className="hero-copy">
            <Breadcrumbs items={[{ name: 'Tools', href: '/tools' }]} current="Estimator" />
            <span className="eyebrow">Free for members</span>
            <h1>Estimator.</h1>
            <p className="lead">
              Price a job from our store at your own price, add your labour and markup, and turn it into a proposal for your
              client in your business name. Estimates are saved to your account.
            </p>
          </div>
          <OrbitArt icon={Calculator} badges={[Wrench, FileText, ShoppingCart]} />
        </div>
      </section>
      <section className="section">
        <div className="container">
          <ToolSignInGate path="/tools/estimator" title="Estimator">
            <Estimator />
          </ToolSignInGate>
          <details className="est-how">
            <summary>How the Estimator works</summary>
            <p>
              Split the job into sections, such as each floor or each system. Add materials from our store: they come in at
              the price you pay, and are shown ex GST. Add your labour as hours, at your own rate. Set a markup for the whole
              job, or for any line. The Estimator adds it up, adds GST, and keeps your costs and margin to yourself.
            </p>
            <p>
              On the Proposal tab, write the scope and edit what is and isn&apos;t included, then download the proposal as a PDF
              in your business name, with an acceptance block for your client to sign. You can also add every material to your
              cart, or send us the materials list to quote.
            </p>
            <p>
              Store prices are checked whenever you open or save an estimate, so an estimate always shows today&apos;s price.
              Materials can only be products from our store.
            </p>
          </details>
        </div>
      </section>
    </main>
  );
}
