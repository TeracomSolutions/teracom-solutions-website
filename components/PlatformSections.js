import Link from 'next/link';
import {
  AI_SECURITY,
  BUSINESS_OUTCOMES,
  GENERAL_AI_TRAITS,
  MEMORY_STEPS,
  MEMORY_THEMES,
  PLATFORM_PILLARS,
  PLATFORM_SERVICES,
  TERACOM_AI_TRAITS,
  TRUST_POINTS,
} from '@/lib/platformMessaging';

// The platform sections from lib/platformMessaging: Teracom AI as the
// platform under the services, organisational memory, outcomes, how it
// differs from general AI assistants and its security. Used on the
// homepage and on /teracom-ai.

export function PlatformStack() {
  return (
    <section className="section section-spacious alt" id="platform">
      <div className="container">
        <div className="section-heading">
          <span className="eyebrow">One platform underneath</span>
          <h2>Services, powered by Teracom AI.</h2>
          <p>Every service we deliver runs on the same platform, so what we learn on one job makes the next one better.</p>
        </div>
        <div className="platform-stack">
          <div className="platform-services">
            {PLATFORM_SERVICES.map((service) => (
              <Link className="platform-service" href={service.href} key={service.title}>
                <h3>{service.title}</h3>
                <p>{service.text}</p>
              </Link>
            ))}
          </div>
          <div className="platform-connector" aria-hidden="true" />
          <div className="platform-powered">
            <span className="platform-powered-label">Powered by</span>
            <h3>Teracom AI</h3>
            <p>The AI Operating System for Modern Organisations</p>
            <ul className="platform-pillars">
              {PLATFORM_PILLARS.map((pillar) => (
                <li key={pillar.title}>
                  <strong>{pillar.title}</strong>
                  <span>{pillar.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export function OrganisationalMemory({ alt = false }) {
  return (
    <section className={`section section-spacious${alt ? ' alt' : ''}`} id="organisational-memory">
      <div className="container">
        <div className="section-heading left memory-heading">
          <span className="eyebrow">Organisational memory</span>
          <h2>Knowledge is the organisation’s most valuable asset.</h2>
          <p className="memory-lead">Teracom AI captures, protects and transforms organisational knowledge into a workforce of digital specialists.</p>
        </div>
        <ol className="memory-steps">
          {MEMORY_STEPS.map((step) => (
            <li key={step.lead}>
              <h3>
                {step.lead} <span>{step.accent}</span>
              </h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
        <div className="mini-services">
          {MEMORY_THEMES.map((theme) => (
            <span key={theme}>{theme}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

export function BusinessOutcomes() {
  return (
    <section className="section section-spacious alt" id="outcomes">
      <div className="container">
        <div className="section-heading">
          <span className="eyebrow">Outcomes</span>
          <h2>Outcomes for managers. Tools for technicians.</h2>
          <p>
            What changes when your organisation runs on Teracom AI. The tools behind each outcome are on the{' '}
            <Link href="/teracom-ai">Teracom AI page</Link>.
          </p>
        </div>
        <ul className="outcome-grid">
          {BUSINESS_OUTCOMES.map((outcome) => (
            <li key={outcome.title}>
              <h3>{outcome.title}</h3>
              <p>{outcome.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function AiComparison({ alt = false }) {
  return (
    <section className={`section section-spacious${alt ? ' alt' : ''}`} id="why-teracom-ai">
      <div className="container">
        <div className="section-heading">
          <span className="eyebrow">Why Teracom AI</span>
          <h2>Not another chat window.</h2>
          <p>
            ChatGPT, Claude and Copilot are capable general assistants. Teracom AI is built for a different job: to become a
            permanent capability inside your organisation.
          </p>
        </div>
        <div className="ai-compare">
          <div className="ai-compare-col ai-compare-generic">
            <h3>Traditional AI tools</h3>
            <ul>
              {GENERAL_AI_TRAITS.map((trait) => (
                <li key={trait}>{trait}</li>
              ))}
            </ul>
          </div>
          <div className="ai-compare-col ai-compare-teracom">
            <h3>Teracom AI</h3>
            <ul>
              {TERACOM_AI_TRAITS.map((trait) => (
                <li key={trait}>{trait}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

// The homepage shows the short list; /teracom-ai shows each point with
// what it means.
export function SecurityTrust({ detailed = false, alt = false }) {
  return (
    <section className={`section section-spacious${alt ? ' alt' : ''}`} id="security">
      <div className="container">
        <div className="section-heading">
          <span className="eyebrow">Trust and security</span>
          <h2>{detailed ? 'Security is part of the platform.' : 'Enterprise Security & Data Protection'}</h2>
          <p>
            {detailed
              ? 'Security is a capability of Teracom AI, not a footnote. This is how your organisation’s knowledge is kept safe.'
              : 'Enterprise buyers want to know where their data lives and who can see it before they bring AI in. So do we.'}
          </p>
        </div>
        {detailed ? (
          <ul className="trust-grid trust-grid-detail">
            {AI_SECURITY.map((point) => (
              <li key={point.title}>
                <strong>{point.title}</strong>
                <span>{point.text}</span>
              </li>
            ))}
          </ul>
        ) : (
          <ul className="trust-grid">
            {TRUST_POINTS.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        )}
        {!detailed && (
          <p className="trust-more">
            <Link href="/teracom-ai#security">How Teracom AI protects your data &rarr;</Link>
          </p>
        )}
      </div>
    </section>
  );
}