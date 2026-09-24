import Image from 'next/image';
import LeadSubmitted from '@/components/LeadSubmitted';
import Link from 'next/link';
import { brands } from '@/lib/brands';
import { aiCapabilities } from '@/lib/aiCapabilities';
import HeroBanner from '@/components/HeroBanner';
import { getHeroSlides } from '@/lib/heroSlides';
import JsonLd from '@/components/JsonLd';
import ContactForm from '@/components/ContactForm';
import ProcessSteps from '@/components/ProcessSteps';
import { ArrowUpRight, BrainCircuit, CodeXml, DraftingCompass, Layers, Workflow } from 'lucide-react';
import { SITE_ORIGIN, absoluteUrl } from '@/lib/seo';

const partnerLogos = brands
  .filter((b) => b.logoFile)
  .map((b) => ({ name: b.name, file: b.logoFile, slug: b.slug }));

// "What we do" cards -- each links to the page that covers it in depth.
const WHAT_WE_DO = [
  {
    icon: Layers,
    title: 'Technology Expertise',
    text: 'Access control, video surveillance, intercoms, intrusion, audio visual, electrical, automation and networking -- designed, installed and supported by one team.',
    href: '/services',
  },
  {
    icon: CodeXml,
    title: 'Software Development',
    text: 'Custom web applications, workflow automation and AI tools, built in-house by the team behind the Teracom AI platform.',
    href: '/services/software-development',
  },
  {
    icon: Workflow,
    title: 'Integration Development',
    text: 'High-level integration between access, video, alarms, building systems and business software, including custom API and middleware development.',
    href: '/services/integration-development',
  },
  {
    icon: BrainCircuit,
    title: 'Digital Innovation',
    text: 'AI solutions, the Teracom AI platform, knowledge management and technology platforms for the industry.',
    href: '/securityos-ai',
  },
  {
    icon: DraftingCompass,
    title: 'Consulting & Advisory',
    text: 'Independent guidance for system selection, solution validation, technical strategy, architecture reviews, standards and documentation.',
    href: '/services/security-design-consulting',
  },
];

// Service structured data for the capabilities this page already describes in
// its "What we do" and "How we deliver" sections. Named services give Google
// something concrete to match against commercial queries ("security system
// design", "access control installation") instead of inferring everything
// from prose, and each one is tied back to the sitewide Organization node so
// they are attributed to Teracom rather than floating free.
const SERVICE_SCHEMA = {
  '@type': 'ItemList',
  name: 'Teracom Solutions services',
  itemListElement: [
    {
      name: 'Technology Design & Consulting',
      description:
        'Independent advice on system selection, solution architecture and technical design, including architecture reviews, technical documentation and integration planning.',
      serviceType: 'Technology design and consulting',
    },
    {
      name: 'Access Control Systems',
      description:
        'Design, supply, installation and commissioning of access control systems for single-site and multi-site organisations.',
      serviceType: 'Access control installation',
    },
    {
      name: 'Video Surveillance & CCTV',
      description:
        'CCTV and video surveillance design, supply and installation, including integration with existing security platforms.',
      serviceType: 'CCTV and video surveillance installation',
    },
    {
      name: 'Intrusion Detection & Intercom',
      description:
        'Intrusion detection and intercom systems, designed and installed by licensed technicians and electricians.',
      serviceType: 'Intrusion detection and intercom installation',
    },
    {
      name: 'Software Development & AI Solutions',
      description:
        'The Teracom AI platform plus custom software tools, workflow automation and knowledge management, built in-house.',
      serviceType: 'Software development and AI solutions',
    },
    {
      name: 'Systems Integration & Development',
      description:
        'High-level integration that connects access control, video, alarms, building systems and business software so they work as one.',
      serviceType: 'Systems integration and development',
    },
    {
      name: 'Installation, Service & Ongoing Support',
      description:
        'Installation, commissioning, maintenance, monitoring and technical support for the life of the system.',
      serviceType: 'Technology system maintenance and support',
    },
  ].map((service, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    item: {
      '@type': 'Service',
      name: service.name,
      description: service.description,
      serviceType: service.serviceType,
      provider: { '@id': `${SITE_ORIGIN}/#organisation` },
      areaServed: [
        { '@type': 'Country', name: 'Australia' },
        { '@type': 'State', name: 'Victoria' },
        { '@type': 'State', name: 'New South Wales' },
      ],
      url: absoluteUrl('/#what-we-do'),
    },
  })),
};

export default async function Home(props){const searchParams=await props.searchParams;const leadStatus=searchParams?.lead;const preselectedInterest=typeof searchParams?.interest==='string'?searchParams.interest:'';return <main id="main-content"><LeadSubmitted source="home_contact_form" /><JsonLd schema={SERVICE_SCHEMA} /><HeroBanner slides={await getHeroSlides()} /><section className="section intro-section"><div className="container intro-grid"><div><span className="eyebrow">The balance</span><h2>We bring together technology know-how and digital innovation.</h2></div><p>Teracom is not just a traditional installer and not just a software company. It sits between both: practical field experience, deep product understanding, technical consulting and the next generation of AI-enabled industry tools.</p></div></section><section className="section section-spacious alt" id="what-we-do"><div className="container two-column"><div className="section-sticky"><span className="eyebrow">What we do</span><h2>Technology capability on one side. Digital innovation on the other.</h2><p>Built for organisations that need both practical technology expertise and smarter digital platforms -- from one team.</p><Link className="btn btn-secondary" href="/services">Explore our services</Link></div><div className="what-list">{WHAT_WE_DO.map(({icon:Icon,title,text,href},i)=><Link href={href} className="what-card" key={title}><span className="tool-card-icon"><Icon size={26} strokeWidth={1.75} aria-hidden="true" focusable="false"/></span><span><span className="what-card-number">{String(i+1).padStart(2,'0')}</span><h3>{title}</h3><p>{text}</p></span><ArrowUpRight className="what-card-arrow" size={22} strokeWidth={2} aria-hidden="true" focusable="false"/></Link>)}</div></div></section><section className="section section-spacious alt"><div className="container"><div className="deliver-intro"><div className="deliver-image hero-blend"><Image src="/assets/teracom-on-site.webp" alt="Teracom mascot on a building site reviewing plans -- plan, install, support, evolve" width={1536} height={1024} sizes="(max-width: 980px) 100vw, 58vw" /></div><div className="section-heading left"><span className="eyebrow">How we deliver</span><h2>From consultancy to completion.</h2><p>One team across the whole journey -- not a different contractor at every stage.</p></div></div><ProcessSteps /></div></section><section className="section product-showcase" id="securityos"><div className="container showcase-grid"><div className="showcase-image hero-blend"><Image src="/assets/teracom-ai-command-centre.webp" alt="Tera, the Teracom AI mascot, at a security command centre desk -- intelligence in action" width={1536} height={1024} sizes="(max-width: 980px) 100vw, 55vw"/></div><div className="showcase-copy"><span className="eyebrow">Available now</span><h2>Teracom AI</h2><p className="large-text">The AI operating system for modern organisations.</p><p>Teracom AI helps technicians, engineers, estimators and project teams access expert knowledge, generate documentation and solve technical challenges faster.</p><ul className="tick-list tick-list-links">{aiCapabilities.map((c)=><li key={c.slug}><Link href={`/securityos-ai/${c.slug}`}>{c.title}</Link></li>)}</ul><Link className="btn btn-primary" href="/securityos-ai">View Teracom AI</Link><p className="form-note" style={{marginTop:'28px'}}>More specialised modules for different parts of the business are coming soon.</p><div className="mini-services"><span>Physical Security Services OS — coming soon</span><span>Finance OS — coming soon</span><span>Operations OS — coming soon</span><span>Construction & Trades OS — coming soon</span></div></div></div></section><section className="section section-spacious alt" id="expertise"><div className="container"><div className="section-heading"><span className="eyebrow">Industry expertise</span><h2>Technologies we understand.</h2><p>Teracom is built around the real platforms, products and technical challenges used across the security, building and IT industries.</p></div><div className="logo-wall">{partnerLogos.map(l=><Link href={`/brands/${l.slug}`} className="logo-chip" key={l.slug}><div className="logo-tile-image"><Image src={`/assets/logos/${l.file}`} alt={`${l.name} logo`} fill style={{ objectFit: 'contain' }} sizes="140px" className="logo-mono"/></div></Link>)}</div></div></section><section className="section visual-split alt"><div className="container showcase-grid reverse"><div className="showcase-copy"><span className="eyebrow">Consulting</span><h2>Practical advice, clear design and better project outcomes.</h2><p>We support project and technology teams with solution architecture, system design, product selection, documentation, integration planning and technical validation.</p><div className="mini-services"><span>System Design</span><span>Architecture Reviews</span><span>Technical Documentation</span><span>Integration Planning</span></div></div><div className="showcase-image"><Image src="/assets/consulting-visual.svg" alt="Consulting and technical strategy visual" width={1200} height={700}/></div></div></section><section className="section store-strip"><div className="container showcase-grid"><div className="showcase-image"><Image src="/assets/store-preview.svg" alt="Teracom Store preview" width={1200} height={700}/></div><div className="showcase-copy"><span className="eyebrow">Teracom Store</span><h2>Products, software and resources.</h2><p>The Teracom Store provides selected technology products, digital templates, training resources, consulting services and Teracom AI subscriptions.</p><Link className="btn btn-secondary" href="/store">View Store Page</Link></div></div></section><section className="section about-section alt"><div className="container about-layout"><div className="section-heading left"><span className="eyebrow">About</span><h2>Built from industry experience. Focused on what comes next.</h2></div><div className="copy-block"><p>Teracom Solutions was created to help transform the technology and security industry through technical excellence, practical consulting and intelligent technology.</p><p>With experience across access control, video surveillance, networking, systems integration, project delivery and business improvement, Teracom understands the real challenges faced by technicians, engineers, project teams and business leaders.</p><p>The future of our industry will combine human expertise with AI-powered tools. Teracom Solutions is being built to support that future.</p></div></div></section><section className="section contact-section" id="contact"><div className="container contact-card"><div><span className="eyebrow">Contact</span><h2>Let&apos;s start the conversation.</h2><p>Whether you&apos;re interested in Teracom AI, technical consulting, partnerships or the Teracom Store, we&apos;d love to hear from you.</p>{leadStatus==='received'&&<p className="form-note-banner" role="status">Thanks — we&apos;ve received your enquiry and will be in touch shortly.</p>}{leadStatus==='error'&&<p className="form-error" role="alert">Something went wrong submitting your enquiry. Please try again, or email us directly.</p>}<address className="contact-address">1B Yazaki Way, Carrum Downs<br/>VIC 3201, Australia<br/>Sales: <a href="mailto:sales@teracomsolutions.com.au">sales@teracomsolutions.com.au</a></address><div className="contact-map"><iframe src="https://maps.google.com/maps?q=1B%20Yazaki%20Way%2C%20Carrum%20Downs%20VIC%203201%2C%20Australia&t=&z=15&ie=UTF8&iwloc=&output=embed" title="Teracom Solutions location map" loading="lazy" referrerPolicy="no-referrer-when-downgrade"/></div></div><ContactForm preselectedInterest={preselectedInterest} returnTo="/" /></div></section></main>}
