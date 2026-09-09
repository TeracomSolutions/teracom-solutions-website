export const metadata = {
  title: 'Warranty & Returns | Teracom Solutions',
  description: 'Teracom Solutions warranty and product returns information, including manufacturer warranty links for the brands we supply.',
};

const manufacturerWarranties = [
  {
    brand: 'Everki',
    text: 'EVERKI products carry a lifetime warranty. We warrant, to the original owner, our products against defects in materials or workmanship; should any such defect arise, we will repair or replace the product at our discretion. This warranty does not cover incidental or consequential damage, and does not apply to normal wear and tear, accidental damage, abuse, misuse, alterations or cosmetic damage. To start a warranty claim, contact us -- you will be responsible for return shipping to our Melbourne facility.',
    url: 'https://www.everki.com/au_en/warranty',
  },
  {
    brand: 'Seagate',
    text: 'Applies to Seagate, Maxtor and LaCie branded products (other than Business Storage/NAS products, which have their own policy).',
    url: 'https://www.seagate.com/au/en/support/warranty-and-replacements/limited-consumer-warranty/',
  },
  {
    brand: 'Ubiquiti',
    text: 'Ubiquiti offers product warranties to end users only on products purchased from an authorised Ubiquiti distributor or reseller, accompanied by a Return Materials Authorisation (RMA). Products from unauthorised sellers do not carry a Ubiquiti warranty.',
    url: 'https://www.ui.com/support/warranty/',
  },
  {
    brand: 'Synology',
    text: 'Current support status and warranty terms for all Synology products and accessories.',
    url: 'https://www.synology.com/en-au/company/legal/warranty',
  },
  {
    brand: 'Power Shield',
    text: 'Power Shield encourages customers to register their products -- failure to do so does not diminish warranty rights.',
    url: 'https://powershield.com.au/support-menu/warranty-registration/',
  },
  {
    brand: 'BenQ',
    text: 'Warranty information for BenQ projectors, monitors and interactive flat panels.',
    url: 'https://www.benq.com/en-au/support/registration-warranty/warranty-information.html',
  },
];

export default function Warranty(){return <main><section className="hero hero-product"><div className="container hero-layout"><div className="hero-copy"><span className="eyebrow">Warranty & Returns</span><h1>Warranty & Product Returns</h1><p className="lead">Please take care to package your return carefully. Teracom Solutions is not responsible for damage or a lost product caused by shipping -- damage related to inappropriate packaging will result in additional charges for repair.</p></div></div></section><section className="section section-spacious"><div className="container"><div className="section-heading"><span className="eyebrow">Manufacturer warranties</span><h2>Warranty terms by brand.</h2><p>Many of the products we supply carry their own manufacturer warranty, separate to our own returns process. Current terms for the brands we supply most often:</p></div><div className="feature-grid">{manufacturerWarranties.map(w=><article key={w.brand}><h3>{w.brand}</h3><p>{w.text}</p><a className="btn btn-secondary" href={w.url} target="_blank" rel="noopener noreferrer" style={{marginTop:'12px'}}>View {w.brand} warranty ↗</a></article>)}</div></div></section></main>}
