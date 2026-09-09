export const metadata = {
  title: 'Resources | Teracom Solutions',
  description: 'Help centre, FAQs, user manuals, datasheets and product videos for Teracom Solutions products and services.',
};

const resourceGroups = [
  {
    title: 'Help Centre',
    description: 'We know that finding the right information can be difficult and time consuming -- if you can’t find what you’re after here, contact us and we’ll deal with your query promptly.',
    available: true,
  },
  {
    title: 'FAQs',
    description: 'Frequently asked questions about our store, products, shipping, returns and payment details.',
    available: true,
  },
  {
    title: 'User Manuals',
    description: 'Product manuals for the systems and equipment we supply and install.',
    available: false,
  },
  {
    title: 'Datasheets',
    description: 'Technical specification sheets for our product range.',
    available: false,
  },
  {
    title: 'Product Videos',
    description: 'Installation, configuration and product overview videos.',
    available: false,
  },
  {
    title: 'Downloads',
    description: 'Software, firmware and supporting documents.',
    available: false,
  },
];

export default function Resources(){return <main><section className="hero hero-product"><div className="container hero-layout"><div className="hero-copy"><span className="eyebrow">Resources</span><h1>Documentation, manuals and support.</h1><p className="lead">We know that finding the right information can be difficult and time consuming -- this page brings it together in one place.</p></div></div></section><section className="section section-spacious"><div className="container"><div className="feature-grid">{resourceGroups.map((r)=><article key={r.title}><h3>{r.title}</h3><p>{r.description}</p>{!r.available && <p className="form-note" style={{marginTop:'10px'}}>Coming soon</p>}</article>)}</div><div className="form-note-banner" role="status" style={{marginTop:'40px'}}>Rebuilding this section from our previous site -- if you need a manual, datasheet or video right now, <a href="/#contact" style={{color:'var(--text)',textDecoration:'underline'}}>contact us</a> directly and we&apos;ll get it to you.</div></div></section></main>}
