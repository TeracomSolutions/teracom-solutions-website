import Link from 'next/link';

// Shared frame for the account pages (sign in, create account, account):
// the cart's glowing background, an orbiting emblem, a short benefits list
// and the form itself on a glass panel.
export default function AuthShell({ eyebrow, title, lead, icon: Icon, badges = [], benefits = [], children, footer }) {
  return (
    <main id="main-content" className="cart-page">
      <section className="section">
        <div className="container auth-layout">
          <div className="auth-intro">
            <span className="eyebrow">{eyebrow}</span>
            <h1>{title}</h1>
            {lead ? <p className="lead">{lead}</p> : null}
            {benefits.length > 0 ? (
              <ul className="auth-benefits">
                {benefits.map(({ icon: BenefitIcon, text }) => (
                  <li key={text}>
                    <span className="tool-card-icon">
                      <BenefitIcon size={20} strokeWidth={1.8} aria-hidden="true" focusable="false" />
                    </span>
                    {text}
                  </li>
                ))}
              </ul>
            ) : null}
            {footer ? <p className="auth-footer-note">{footer}</p> : null}
          </div>

          <div className="auth-card">
            {Icon ? (
              <span className="auth-card-emblem" aria-hidden="true">
                <Icon size={26} strokeWidth={1.8} focusable="false" />
              </span>
            ) : null}
            {children}
          </div>

          <div className="store-art auth-art" aria-hidden="true">
            <span className="store-art-ring tool-hero-ring">
              {Icon ? <Icon size={84} strokeWidth={1.3} focusable="false" /> : null}
            </span>
            <span className="store-art-orbit">
              {badges.slice(0, 3).map((Badge, i) => (
                <span className={`store-art-badge store-art-badge-${i + 1}`} key={i}>
                  <span>
                    <Badge size={22} strokeWidth={1.8} focusable="false" />
                  </span>
                </span>
              ))}
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}

export function AuthAside({ children }) {
  return <p className="auth-aside">{children}</p>;
}

export function AuthLink({ href, children }) {
  return <Link href={href}>{children}</Link>;
}
