import Image from 'next/image';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import MobileNav from './MobileNav';
import CartIndicator from './CartIndicator';
import HeaderSearch from './HeaderSearch';
import NavDropdownCloser from './NavDropdownCloser';
import SiteMotion from './SiteMotion';
import HeaderAccount from './HeaderAccount';
import { resourcesSections } from '@/lib/resourcesSections';
import { COMMISSIONING_FORM_URL, monitoringServices } from '@/lib/monitoring';
import { MONITORING_LOGIN_PATH, monitoringLoginEnabled } from '@/lib/monitoringLogin';
import { services, serviceGroups } from '@/lib/services';


// One slim row: logo, navigation, then search, account, cart and the store
// button as quiet round icons (Robert, 2026-11-06: "more modern, industry
// standard"). It used to be two rows, with the account controls on a utility
// line above the navigation; as icons they fit beside it again. The bar
// tightens and gains a red edge once the page scrolls, and the page you are on
// is marked (NavDropdownCloser does both).
//
// The phone number and opening hours were briefly up here too; Robert moved
// them to the footer on 2026-09-23, where they sit with the address and ABN.

const chevron = <ChevronDown className="nav-chevron" size={14} strokeWidth={2.2} aria-hidden="true" />;

export default function Header() {

  return (
    <header className="site-header">
      <NavDropdownCloser />
      <SiteMotion />
      <div className="container nav-wrap">
        <Link className="brand" href="/" aria-label="Teracom Solutions home">
          <Image src="/assets/teracom-logo.png" alt="Teracom Solutions" width={170} height={66} priority />
        </Link>
        <nav className="nav" aria-label="Main">
          <div className="nav-dropdown">
            <Link className="nav-link" href="/services">What We Do{chevron}</Link>
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
            <Link className="nav-link" href="/monitoring">Monitoring{chevron}</Link>
            <div className="nav-dropdown-panel">
              <div className="nav-dropdown-list">
                {monitoringServices.map((s) => (
                  <Link href={`/monitoring/${s.slug}`} key={s.slug}>
                    {s.title}
                  </Link>
                ))}
                <Link href={COMMISSIONING_FORM_URL}>Monitoring sign-up form</Link>
                {monitoringLoginEnabled() ? <Link href={MONITORING_LOGIN_PATH}>Customer login</Link> : null}
              </div>
            </div>
          </div>
          <Link className="nav-link" href="/teracom-ai">Teracom AI</Link>
          <Link className="nav-link" href="/brands">Brands</Link>
          <div className="nav-dropdown">
            <Link className="nav-link" href="/resources" data-match="/resources /tools">Resources{chevron}</Link>
            <div className="nav-dropdown-panel">
              <div className="nav-dropdown-list">
                {resourcesSections.map((s) => (
                  <Link href={`/resources/${s.slug}`} key={s.slug}>
                    {s.title}
                  </Link>
                ))}
                <Link href="/tools">Free Tools</Link>
              </div>
            </div>
          </div>
          <Link className="nav-link" href="/contact">Contact</Link>
        </nav>
        <div className="header-actions">
          <HeaderSearch />
          <HeaderAccount />
          <CartIndicator />
          <Link className="btn btn-primary header-cta" href="/store">
            Open Store
          </Link>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
