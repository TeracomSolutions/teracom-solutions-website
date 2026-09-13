import Image from 'next/image';
import Link from 'next/link';
import { cookies } from 'next/headers';

import MobileNav from './MobileNav';
import CartIndicator from './CartIndicator';
import { resourcesSections } from '@/lib/resourcesSections';

import { CUSTOMER_ACCESS_TOKEN_COOKIE } from '@/lib/customerSession';
import { getCurrentCustomer } from '@/lib/api/customerAuth';
import { ApiError } from '@/lib/api/client';

export default async function Header(){
  const token = cookies().get(CUSTOMER_ACCESS_TOKEN_COOKIE)?.value;
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

  return <header className="site-header"><div className="container nav-wrap"><Link className="brand" href="/"><Image src="/assets/teracom-logo.svg" alt="Teracom Solutions" width={245} height={64} priority /></Link><MobileNav /><nav className="nav"><Link href="/#what-we-do">What We Do</Link><Link href="/securityos-ai">Teracom AI</Link><Link href="/brands">Brands</Link><Link href="/store">Store</Link><div className="nav-dropdown"><Link href="/resources">Resources</Link><div className="nav-dropdown-panel">{resourcesSections.map((s)=><Link href={`/resources/${s.slug}`} key={s.slug}>{s.title}</Link>)}</div></div></nav><CartIndicator/> {customer ? (
    <Link href="/account" className="nav-signin-status">
      Hi, {customer.first_name || customer.email}
    </Link>
  ) : (
    <Link href="/account/login" className="nav-signin-status">
      Sign In
    </Link>
  )}<Link className="btn btn-primary" href="/store">Open Store</Link></div></header>}