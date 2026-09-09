import Image from 'next/image';
import Link from 'next/link';
import MobileNav from './MobileNav';
import CartIndicator from './CartIndicator';
export default function Header(){return <header className="site-header"><div className="container nav-wrap"><Link className="brand" href="/"><Image src="/assets/teracom-logo.svg" alt="Teracom Solutions" width={245} height={64} priority /></Link><MobileNav /><nav className="nav"><Link href="/#what-we-do">What We Do</Link><Link href="/securityos-ai">Teracom AI</Link><Link href="/#expertise">Expertise</Link><Link href="/store">Store</Link><Link href="/resources">Resources</Link></nav><CartIndicator/><Link className="btn btn-primary" href="/store">Open Store</Link></div></header>}
