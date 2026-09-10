import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-main">
        <div className="footer-brand">
          <Image
            src="/assets/teracom-logo.svg"
            alt="Teracom Solutions"
            width={260}
            height={68}
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
          1B Yazaki Way, Carrum Downs, VIC 3201, Australia<br/>
          <a href="tel:+61397082685">+61 3 9708 2685</a><br/>
          <a href="mailto:sales@teracomsolutions.com.au">sales@teracomsolutions.com.au</a><br/>
          <a href="mailto:accounts@teracomsolutions.com.au">accounts@teracomsolutions.com.au</a>
        </address>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} Teracom Solutions — all prices displayed are inclusive of GST</span>
        <Link href="#top">Back to top ↑</Link>
      </div>
    </footer>
  );
}
