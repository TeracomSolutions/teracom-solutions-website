import Link from 'next/link';
import {
  CUSTOMER_PROMISES,
  DEPARTMENTS,
  EXTENSION_TYPES,
  INDUSTRY_PACKS,
  JOURNEY_STEPS,
  PRODUCT_RULE,
} from '@/lib/platformMessaging';

// How Teracom AI is organised (Robert, 2026-10-28, from the Teracom Product Model V1): an organisation is a set
// of Departments, specialised by Industry Packs, extended by governed Extensions, all on one organisational
// memory under human governance. Used on /teracom-ai.

export function DepartmentModel({ alt = false }) {
  return (
    <section className={`section section-spacious${alt ? ' alt' : ''}`} id="departments">
      <div className="container">
        <div className="section-heading">
          <span className="eyebrow">Departments</span>
          <h2>Deploy a Department. Or build an entire AI organisation.</h2>
          <p>
            Every organisation, from a family office to a regional trades business, runs on the same seven functions.
            Each Teracom AI Department brings its own digital workers, dashboards and reports, all working from one
            organisational memory and under your approval.
          </p>
        </div>
        <div className="dept-grid">
          {DEPARTMENTS.map((dept) => (
            <article className="dept-card" key={dept.name}>
              <h3>{dept.name}</h3>
              <p>{dept.purpose}</p>
              <p className="dept-workers">
                <strong>Workers:</strong> {dept.workers.join(', ')}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function PacksAndExtensions({ alt = false }) {
  return (
    <section className={`section section-spacious${alt ? ' alt' : ''}`} id="industry-packs">
      <div className="container">
        <div className="section-heading">
          <span className="eyebrow">Industry Packs and Extensions</span>
          <h2>Built for your industry, without custom software.</h2>
          <p>{PRODUCT_RULE}</p>
        </div>
        <div className="dept-split">
          <div>
            <h3 className="dept-subhead">Industry Packs</h3>
            <p className="dept-note">Content, not code: the words your industry uses, starter records, templates, worker instructions and knowledge.</p>
            <ul className="dept-list">
              {INDUSTRY_PACKS.map((pack) => (
                <li key={pack.name}>
                  <strong>{pack.name}</strong>
                  <span>{pack.text}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="dept-subhead">Extensions</h3>
            <p className="dept-note">The only way new capability enters the platform: reviewed, versioned and off until you switch it on.</p>
            <ul className="dept-list">
              {EXTENSION_TYPES.map((ext) => (
                <li key={ext.name}>
                  <strong>{ext.name}</strong>
                  <span>{ext.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export function CustomerJourney({ alt = false }) {
  return (
    <section className={`section section-spacious${alt ? ' alt' : ''}`} id="how-it-starts">
      <div className="container">
        <div className="section-heading">
          <span className="eyebrow">How organisations start</span>
          <h2>One Department at a time.</h2>
          <p>Each step is useful on its own, and each one adds to what your organisation remembers.</p>
        </div>
        <ol className="dept-journey">
          {JOURNEY_STEPS.map((step) => (
            <li key={step.title}>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
        <div className="dept-promises">
          <h3 className="dept-subhead">Our promises</h3>
          <ul className="tick-list">
            {CUSTOMER_PROMISES.map((promise) => (
              <li key={promise}>{promise}</li>
            ))}
          </ul>
          <Link className="btn btn-secondary" href="/?interest=Teracom%20AI#contact">
            Talk to us about your first Department
          </Link>
        </div>
      </div>
    </section>
  );
}
