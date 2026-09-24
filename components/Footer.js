import Image from 'next/image';
import Link from 'next/link';
import { Clock, Mail, Phone } from 'lucide-react';

import AdminEntryPoint from './AdminEntryPoint';
import { BUSINESS } from '@/lib/seo';

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
            Building smarter technology solutions, end to end.
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
        <div className="footer-mascot" aria-hidden="true">
          <Image
            src="/assets/teracom-mascot-footer.webp"
            alt=""
            width={640}
            height={675}
            sizes="(max-width: 640px) 170px, 250px"
          />
        </div>
        <div className="footer-links">
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>
          <Link href="/services">Services</Link>
          <Link href="/monitoring">Monitoring</Link>
          <Link href="/securityos-ai">Teracom AI</Link>
          <Link href="/brands">Brands</Link>
          <Link href="/store">Teracom Store</Link>
          <Link href="/resources">Resources</Link>
          <Link href="/resources/industry-news">Industry News</Link>
          <Link href="/tools">Free Tools</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/warranty">Warranty & Returns</Link>
        </div>
        <address className="footer-contact">
          {BUSINESS.legalName}<br/>
          1B Yazaki Way, Carrum Downs<br/>
          VIC 3201, Australia<br/>
          {BUSINESS.telephone ? (
            <a className="footer-phone" href={`tel:${BUSINESS.telephone}`}>
              <Phone size={15} strokeWidth={1.9} aria-hidden="true" focusable="false" />
              {BUSINESS.telephoneDisplay}
            </a>
          ) : null}
          <a className="footer-phone" href={`mailto:${BUSINESS.salesEmail}`}>
            <Mail size={15} strokeWidth={1.9} aria-hidden="true" focusable="false" />
            {BUSINESS.salesEmail}
          </a>
          <span className="footer-hours">
            <Clock size={15} strokeWidth={1.9} aria-hidden="true" focusable="false" />
            Mon&ndash;Fri {BUSINESS.openingHours.opens}&ndash;{BUSINESS.openingHours.closes}
          </span>
          {/* A business buyer must withhold 47% of a payment over $75 ex GST
              to a supplier who hasn't quoted an ABN, so a visible, verifiable
              ABN removes a real obstacle rather than just looking reputable. */}
          <span className="footer-abn">
            ABN{' '}
            <a
              href={`https://abr.business.gov.au/ABN/View?abn=${BUSINESS.abn.replace(/\s/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {BUSINESS.abn}
            </a>
            {BUSINESS.securityLicences.map((licence) => (
              <span key={licence.state}>
                <br/>
                {licence.state} security licence {licence.number}
              </span>
            ))}
          </span>
        </address>
      </div>
      <div className="container footer-bottom">
        <div className="footer-bottom-left">
          <AdminEntryPoint />
          <nav className="footer-legal" aria-label="Legal">
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms & Conditions</Link>
          </nav>
          <span>Website built by Teracom AI</span>
        </div>
        <Link href="#top">Back to top ↑</Link>
      </div>
    </footer>
  );
}
