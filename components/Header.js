import Image from 'next/image';
import Link from 'next/link';
import { cookies } from 'next/headers';
import MobileNav from './MobileNav';
import CartIndicator from './CartIndicator';
import HeaderSearch from './HeaderSearch';
import { resourcesSections } from '@/lib/resourcesSections';
import { monitoringServices } from '@/lib/monitoring';
import { services, serviceGroups } from '@/lib/services';

import { CUSTOMER_ACCESS_TOKEN_COOKIE } from '@/lib/customerSession';
import { getCurrentCustomer } from '@/lib/api/customerAuth';
import { ApiError } from '@/lib/api/client';

// The header is two rows rather than one.
//
// Everything used to sit on a single line: seven nav items plus search, cart,
// sign-in and a button, and adding Monitoring pushed it past the point where
// it reads as navigation. Splitting the account controls into a slim utility
// row leaves the main row for navigation alone.
//
// The phone number and opening hours were briefly up here too; Robert moved
// them to the footer on 2026-09-23, where they sit with the address and ABN.

export default async function Header() {
  const token = (await cookies()).get(CUSTOMER_ACCESS_TOKEN_COOKIE)?.value;
  let customer = null;
  if (token) {
    try {
      customer = await getCurrentCustomer(token);
    } catch (err) {
      // Any failure (expired token, backend unreachable, etc.) --
      // fall back to showing "Sign In" rather than crashing the
      // header on every single page. Do not rethrow; do not log
      // anything special here that doesn't already exist elsewhere
      // in this file.
    }
  }

  return (
    <header className="site-header">
      <div className="header-utility">
        <div className="container header-utility-inner">
          <div className="header-utility-actions">
            <HeaderSearch />
            {customer ? (
              <Link href="/account" className="nav-signin-status">
                Hi, {customer.first_name || customer.email}
              </Link>
            ) : (
              <Link href="/account/login" className="nav-signin-status">
                Sign In
              </Link>
            )}
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
          <Link href="/securityos-ai">Teracom AI</Link>
          <Link href="/store">Store</Link>
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
