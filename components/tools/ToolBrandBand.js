import Image from 'next/image';
import Link from 'next/link';
import { ClipboardCheck, PackageSearch, Radar, Wrench } from 'lucide-react';

// The free tools advertise the business (Robert, 2026-11-03): every tool page and
// the tools index end with who made them, what we do, and the way to a quote.
const STEPS = [
  { Icon: ClipboardCheck, title: 'Design', text: 'Site surveys, plans and cable schedules' },
  { Icon: PackageSearch, title: 'Supply', text: 'Trade pricing on the brands we install' },
  { Icon: Wrench, title: 'Install', text: 'Installed and commissioned by our own team' },
  { Icon: Radar, title: 'Monitor', text: 'Monitoring and support once it is running' },
];

const tag = (path, slug) => `${path}?utm_source=${encodeURIComponent(slug || 'tools')}&utm_medium=tool-band&utm_campaign=free-tools`;

export default function ToolBrandBand({ slug = '', toolTitle = '', showAllTools = true }) {
  return (
    <section className="tool-brand-band print-hide" aria-labelledby="tool-brand-title">
      <div className="container tool-brand-inner">
        <div className="tool-brand-copy">
          <Image src="/assets/teracom-logo.png" alt="Teracom Solutions" width={220} height={85} className="tool-brand-logo" />
          <p className="eyebrow">Free tools from Teracom Solutions</p>
          <h2 id="tool-brand-title">{toolTitle ? `Worked it out? We can build it.` : 'Free tools. Real installs.'}</h2>
          <p className="lead">
            Teracom Solutions designs, supplies, installs and monitors CCTV, alarms, access control, intercoms, networks and AV for
            businesses. {toolTitle ? `Send us your ${toolTitle} results and we will quote the job, free.` : 'Use the tools, then let us quote the job, free.'}
          </p>
          <div className="tool-brand-actions">
            <Link className="btn btn-primary" href={tag('/contact', slug)}>Get a free quote</Link>
            <Link className="btn btn-secondary" href={tag('/store', slug)}>Shop the parts</Link>
            {showAllTools ? <Link className="btn btn-secondary" href="/tools">All free tools</Link> : null}
          </div>
        </div>
        <ul className="tool-brand-steps">
          {STEPS.map(({ Icon, title, text }) => (
            <li key={title}>
              <Icon size={26} strokeWidth={1.8} aria-hidden="true" />
              <strong>{title}</strong>
              <span>{text}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
