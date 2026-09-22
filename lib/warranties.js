import { brands } from './brands.js';

// Manufacturer warranty pages for /warranty. URLs are the manufacturers' own
// official pages, checked on 22 September 2026; notes only repeat what those
// pages say. Brands without an entry (and Teracom's own brands) point to the
// contact page instead.
const WARRANTY = {
  'aritech': { url: 'https://aritech.com.au/wp-content/uploads/2024/10/KGS_Warranty_Statement_Jan2025.pdf', note: 'Control panels and powered modules: 2 years. Hardwired sensors: 5 years. Wireless sensors: 2 years.' },
  'assa-abloy': { url: 'https://www.assaabloy.com/au/en/resources/general-information/warranties-and-guarantees/assa-abloy', note: 'ASSA ABLOY products: 10 years. Electrical and electronic components: 5 years. Cylinders and keys: 3 years.' },
  'avigilon': { url: 'https://www.avigilon.com/support/warranty-unity', note: 'H6A and H5A cameras and NVR4X: 5 years. H4 series cameras and NVR3/NVR4: 3 years.' },
  'axis': { url: 'https://www.axis.com/support/warranty', note: '5-year warranty from shipment on products shipped from 1 April 2020.' },
  'beward': { url: 'https://www.beward.ru/contact/service/', note: 'Manufacturer page in Russian. Standard IP cameras: 10 years. Other BEWARD equipment: 1 year.' },
  'bosch': { url: 'https://www.keenfinity-group.com/au/en/support/after-sales-services/warranty/', note: 'Most products: 3 years from invoice, extendable to 5 years. Battery packs, headsets and ID cards: 1 year.' },
  'ccure': { url: 'https://www.swhouse.com/services-and-support/warranty-and-repair-services', note: 'Software House warranty repair and advance replacement process.' },
  'cisco': { url: 'https://www.cisco.com/c/en/us/products/warranty-listing.html', note: 'Varies by product, from 90-day limited to limited lifetime. Look up by product ID.' },
  'dsc': { url: 'https://docs.johnsoncontrols.com/dsc/r/DSC/en-US/PowerSeries-Neo-HS2016/HS2016-4/HS2032/HS2064/HS2064-E/HS2128/HS2128-E-Alarm-Control-Installation-Guide-International/1.35/Limited-Warranty', note: 'PowerSeries Neo: 12 months from purchase against defects in materials and workmanship.' },
  'eagle-eye': { url: 'https://www.een.com/wp-content/uploads/2022/05/EEN-DataSheet-Rapid-Replacement-20220527.pdf', note: 'Optional Rapid Replacement extended warranty for bridges, CMVRs, switches and cameras.' },
  'everki': { url: 'https://www.everki.com/au-en/warranty', note: 'Bags, backpacks and briefcases bought in Australia: limited lifetime warranty.' },
  'fsh': { url: 'https://www.allegion.com.au/en/resource-hub/warranty.html', note: 'FES10/15/20 strikes and FEM4300/6600 maglocks: 5 years. FES110/FES112: 2 years.' },
  'gallagher': { url: 'https://security.gallagher.com/en-AU/Legal/Warranty-and-Returns-Policy', note: 'Gallagher hardware: 2 years from manufacture. Selected products: 5 years.' },
  'genetec': { url: 'https://www.genetec.com/legal/hwterms', note: 'Hardware warranty period varies by product and territory.' },
  'hanwha-vision': { url: 'https://www.hanwhavision.com/global/support/warranty-repair', note: 'Network products shipped from 1 July 2023: 5 years from purchase. Consumable parts have shorter periods.' },
  'hid': { url: 'https://www.hidglobal.com/warranty-policy', note: 'Hardware: 1 year by default. Listed readers (Signo, iCLASS SE) and HID-branded credentials: lifetime.' },
  'hikvision': { url: 'https://www.hikvision.com/au-en/support/rma/', note: 'Periods vary by product under the Hikvision Australia & New Zealand RMA policy.' },
  'honeywell': { url: 'https://www.honeywell.com/content/dam/hbtbt/en/documents/other-files/legal-archive/warranties/BA-Security-Products-Warranty-Australia-New-Zealand-as-of-9.18.2023.pdf', note: 'Hardwired PIRs and Ai-series IP cameras: 60 months. Other intrusion sensors: 24 months from manufacture.' },
  'i-pro': { url: 'https://i-pro.com/products_and_solutions/en/surveillance/learning-and-support/warranty', note: 'Warranty period varies by region -- APAC customers contact i-PRO support.' },
  'idis': { url: 'https://idisglobal.com/index/warranty', note: 'IP cameras: 3 years + 3 months, plus a free 2-year extension. DirectIP NVRs: 5 years + 3 months.' },
  'inner-range': { url: 'https://www.innerrange.com/company-policies-document/ir-warranty-statement', note: 'Integriti and Inception: 3 years. IR detectors: 6 years. SIFER: lifetime.' },
  'ion': { url: 'https://ionups.com.au/support/warranty-statement/', note: 'Single-phase UPS products: 3-year parts and labour warranty.' },
  'kantech': { url: 'https://docs.johnsoncontrols.com/kantech/r/Kantech/en-US/KT-300-Door-Controller-Installation-Manual/R003/KANTECH-WARRANTY-TERMS', note: 'KT-300 controller: 5 years from purchase. Software is not covered.' },
  'lockwood': { url: 'https://www.assaabloy.com/au/en/resources/general-information/warranties-and-guarantees/lockwood', note: 'LOCKWOOD products: 25 years. Electrical and electronic components: 3 years. Keys: 12 months.' },
  'milestone': { url: 'https://doc.milestonesys.com/eula/pdf/2025r2/Milestone_EULA_en-US.pdf', note: 'Software EULA: material defects reported within 90 days of purchase are remedied.' },
  'mobotix': { url: 'https://www.mobotix.com/en/terms-and-conditions-for-guaranty', note: 'New MOBOTIX products: 5-year guarantee against defects.' },
  'nx-witness': { url: 'https://www.networkoptix.com/terms-of-use', note: 'Software licensed under the Network Optix terms of use.' },
  'paradox': { url: 'https://www.paradox.com/Terms/Default.asp?FILENAME=/Terms/Terms_LimitedWarrantyStatement.asp', note: 'Products warranted for 2 years from date of production.' },
  'pelco': { url: 'https://www.pelco.com/about/legal/warranty-terms', note: 'Selected cameras (e.g. Sarix Enhanced 4, Esprit Compact): 5 years. Some PTZs: 3 years. Accessories: 1 year.' },
  'powershield': { url: 'https://powershield.com.au/wp-content/uploads/Warranty/PowerShield-WARRANTY.pdf', note: 'Australian warranty terms by product. Products not listed: 12 months.' },
  'reliance': { url: 'https://aritech.com.au/wp-content/uploads/2024/10/KGS_Warranty_Statement_Jan2025.pdf', note: 'Covered by the Aritech warranty statement: security control panels 2 years.' },
  'tecom-challenger': { url: 'https://aritech.com.au/wp-content/uploads/2024/10/KGS_Warranty_Statement_Jan2025.pdf', note: 'Tecom hardware: 5 years. Tecom software: 1 year (online fixes and updates).' },
  'trimec': { url: 'https://www.assaabloy.com/au/en/resources/general-information/warranties-and-guarantees/tri-care', note: 'Tri-Care: TRIMEC products 5 years from purchase. Keys: 12 months. Batteries excluded.' },
  'ubiquiti': { url: 'https://www.ui.com/support/warranty/', note: '2 years if bought from Ubiquiti\'s own store. 1 year through distributors and resellers.' },
  'uniview': { url: 'https://www.uniview.com/Support/RMA/', note: 'Uniview warranty enquiries and RMA repair requests.' },
  'vivotek': { url: 'https://www.vivotek.com/resource/support/warranty_policy', note: 'Network cameras and NVRs: 5 years from shipment, unless the datasheet says otherwise.' },
  'wasabi': { url: 'https://wasabi.com/legal/sla', note: 'Cloud storage SLA: service credits if monthly uptime falls below 99.9%.' },
};

// Brands we supply that don't have a brand page of their own.
const OTHER_BRANDS = [
  { slug: 'seagate', name: 'Seagate', url: 'https://www.seagate.com/au/en/support/warranty-and-replacements/limited-consumer-warranty/', note: 'Warranty period is shown on the product packaging.' },
  { slug: 'synology', name: 'Synology', url: 'https://www.synology.com/en-au/company/legal/warranty', note: 'Each model\'s warranty period is on Synology\'s product support status page.' },
  { slug: 'benq', name: 'BenQ', url: 'https://www.benq.com/en-au/support/registration-warranty/warranty-information.html', note: 'ANZ monitors: 3 years. Projectors: 1 to 3 years by model. Lamps: 6 months or 750 hours.' },
];

const OWN_BRAND_NOTE = "Teracom's own brand -- contact us for warranty support.";
const CONTACT_NOTE = 'Contact us and we will help with a warranty claim.';

export const warrantyEntries = [
  ...brands.map((b) => {
    const w = WARRANTY[b.slug];
    return {
      slug: b.slug,
      name: b.name,
      logoFile: b.logoFile || null,
      accent: b.accent || null,
      url: w ? w.url : '/contact',
      note: w ? w.note : b.isOwnBrand ? OWN_BRAND_NOTE : CONTACT_NOTE,
    };
  }),
  ...OTHER_BRANDS.map((o) => ({ ...o, logoFile: null, accent: null })),
]
  .map((w) => ({ ...w, external: /^https:\/\//.test(w.url) }))
  .sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }));
