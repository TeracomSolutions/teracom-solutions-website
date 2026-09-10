import Image from 'next/image';
import Link from 'next/link';
import MobileNav from './MobileNav';
import CartIndicator from './CartIndicator';
import { resourcesSections } from '@/lib/resourcesSections';
export default function Header(){return <header className="site-header"><div className="container nav-wrap"><Link className="brand" href="/"><Image src="/assets/teracom-logo.svg" alt="Teracom Solutions" width={245} height={64} priority /></Link><MobileNav /><nav className="nav"><Link href="/#what-we-do">What We Do</Link><Link href="/securityos-ai">Teracom AI</Link><Link href="/store">Store</Link><div className="nav-dropdown"><Link href="/resources">Resources</Link><div className="nav-dropdown-panel">{resourcesSections.map((s)=><Link href={`/resources/${s.slug}`} key={s.slug}>{s.title}</Link>)}</div></div></nav><CartIndicator/><Link className="btn btn-primary" href="/store">Open Store</Link></div></header>}
