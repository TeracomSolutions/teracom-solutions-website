import Image from 'next/image';
import Link from 'next/link';
import MobileNav from './MobileNav';
import CartIndicator from './CartIndicator';
import HeaderSearch from './HeaderSearch';
import NavDropdownCloser from './NavDropdownCloser';
import HeaderAccount from './HeaderAccount';
import { resourcesSections } from '@/lib/resourcesSections';
import { monitoringServices } from '@/lib/monitoring';
import { services, serviceGroups } from '@/lib/services';


// The header is two rows rather than one.
//
// Everything used to sit on a single line: seven nav items plus search, cart,
// sign-in and a button, and adding Monitoring pushed it past the point where
// it reads as navigation. Splitting the account controls into a slim utility
// row leaves the main row for navigation alone.
//
// The phone number and opening hours were briefly up here too; Robert moved
// them to the footer on 2026-09-23, where they sit with the address and ABN.

export default function Header() {

  return (
    <header className="site-header">
      <NavDropdownCloser />
      <div className="header-utility">
        <div className="container header-utility-inner">
          <div className="header-utility-actions">
            <HeaderSearch />
            <HeaderAccount />
            <CartIndicator />
          </div>
        </div>
      </div>

      <div className="container nav-wrap">
        <Link className="brand" href="/">
          <Image src="/assets/teracom-logo.png" alt="Teracom Solutions" width={170} height={66} priority />
        </Link>
        <MobileNav />
        <nav className="nav">
          <div className="nav-dropdown">
            <Link href="/services">What We Do</Link>
            <div className="nav-dropdown-panel nav-dropdown-panel-wide">
              {/* Twelve services in a single column is a scroll, not a menu.
                  Grouped into the four families they already belong to, it
                  fits on one screen and tells the visitor what Teracom does
                  before they click anything. */}
              <div className="nav-dropdown-card">
                {serviceGroups.map((group) => (
                  <div className="nav-dropdown-group" key={group.id}>
                    <span className="nav-dropdown-heading">{group.eyebrow}</span>
                    {services
                      .filter((service) => service.group === group.id)
                      .map((service) => (
                        <Link href={`/services/${service.slug}`} key={service.slug}>
                          {service.title}
                        </Link>
                      ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="nav-dropdown">
            <Link href="/monitoring">Monitoring</Link>
            <div className="nav-dropdown-panel">
              {monitoringServices.map((s) => (
                <Link href={`/monitoring/${s.slug}`} key={s.slug}>
                  {s.title}
                </Link>
              ))}
            </div>
          </div>
          <Link href="/teracom-ai">Teracom AI</Link>
          <Link href="/brands">Brands</Link>
          <div className="nav-dropdown">
            <Link href="/resources">Resources</Link>
            <div className="nav-dropdown-panel">
              {resourcesSections.map((s) => (
                <Link href={`/resources/${s.slug}`} key={s.slug}>
                  {s.title}
                </Link>
              ))}
              <Link href="/tools">Free Tools</Link>
            </div>
          </div>
          <Link href="/contact">Contact</Link>
        </nav>
        <Link className="btn btn-primary" href="/store">
          Open Store
        </Link>
      </div>
    </header>
  );
}
