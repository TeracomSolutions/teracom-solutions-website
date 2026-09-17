import Image from 'next/image';
import Link from 'next/link';
import AdminEntryPoint from './AdminEntryPoint';

const socialLinks = [
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/teracomsolutions.com.au',
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path
          d="M13.5 8.5h-1.2c-.9 0-1.3.5-1.3 1.3V11h2.3l-.3 2h-2v6h-2.2v-6H9v-2h1.8V9.6c0-1.9 1.1-3.1 2.9-3.1h1.8v2z"
          fill="currentColor"
          stroke="none"
        />
      </>
    ),
  },
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/teracom_solutions/',
    icon: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17" cy="7" r="1" fill="currentColor" stroke="none" />
      </>
    ),
  },
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/company/11855559/',
    icon: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <circle cx="8" cy="8.5" r="1" fill="currentColor" stroke="none" />
        <path d="M8 11v6M12 11v6M12 13.5c0-1.5 1-2.5 2.3-2.5S17 12 17 13.5V17" />
      </>
    ),
  },
  {
    name: 'YouTube',
    href: 'https://www.youtube.com/@teracomsolutions1713',
    icon: (
      <>
        <rect x="2.5" y="6" width="19" height="12" rx="4" />
        <path d="M10.5 9.5l5 2.5-5 2.5z" fill="currentColor" stroke="none" />
      </>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-main">
        <div className="footer-brand">
          <Image
            src="/assets/teracom-logo.png"
            alt="Teracom Solutions"
            width={260}
            height={101}
          />
          <p>AI.Technology</p>
          <p className="muted">
            Building smarter solutions for the electronic security industry.
          </p>
          <Link
            className="btn btn-primary"
            href="https://app.teracomsolutions.com.au/portal"
            target="_blank"
            rel="noopener noreferrer"
            style={{marginTop:'18px'}}
          >
            Teracom AI Portal Access
          </Link>
          <div className="footer-social" aria-label="Follow Teracom Solutions on social media">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.name}
                className="footer-social-icon"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  {social.icon}
                </svg>
              </a>
            ))}
          </div>
        </div>
        <div className="footer-links">
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>
          <Link href="/securityos-ai">Teracom AI</Link>
          <Link href="/store">Teracom Store</Link>
          <Link href="/resources">Resources</Link>
          <Link href="/warranty">Warranty & Returns</Link>
          <Link href="/terms">Terms & Conditions</Link>
        </div>
        <address className="footer-contact">
          1B Yazaki Way, Carrum Downs<br/>
          VIC 3201, Australia<br/>
          <a href="tel:+61397082685">+61 3 9708 2685</a><br/>
          <a href="mailto:sales@teracomsolutions.com.au">sales@teracomsolutions.com.au</a><br/>
          <a href="mailto:accounts@teracomsolutions.com.au">accounts@teracomsolutions.com.au</a>
        </address>
      </div>
      <div className="container footer-bottom">
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <AdminEntryPoint />
          <span>Website built by Teracom AI</span>
        </div>
        <Link href="#top">Back to top ↑</Link>
      </div>
    </footer>
  );
}
