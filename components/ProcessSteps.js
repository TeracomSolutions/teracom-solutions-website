import { CodeXml, DraftingCompass, Headset, Package, Wrench } from 'lucide-react';

// The five "How we deliver" steps, shared by the homepage, /services and each
// service page so the wording stays identical everywhere. Other pages can pass
// their own `steps` ({ icon, title, text }) for the same numbered icon strip.
export const DELIVERY_STEPS = [
  { icon: DraftingCompass, title: 'Consultancy & Design', text: 'Independent advice on system selection, architecture and technical design before a single product is ordered.' },
  { icon: CodeXml, title: 'Software Development', text: 'The Teracom AI platform and custom software tools, built in-house by our own development team.' },
  { icon: Package, title: 'Hardware Supply', text: 'Access control, CCTV, intrusion, networking and audio hardware from the manufacturers we work with directly.' },
  { icon: Wrench, title: 'Installation & Service', text: 'Licensed technicians and electricians handling installation, commissioning and ongoing maintenance on-site.' },
  { icon: Headset, title: 'Ongoing Support', text: 'Monitoring, technical support and account management for the life of the system, not just the install.' },
];

export default function ProcessSteps({ steps = DELIVERY_STEPS }) {
  return (
    <ol className="process-steps" style={{ '--steps': steps.length }}>
      {steps.map(({ icon: Icon, title, text }, i) => (
        <li className="process-step" key={title}>
          <span className="process-step-icon">
            <Icon size={26} strokeWidth={1.6} aria-hidden="true" focusable="false" />
          </span>
          <span className="process-step-number">{String(i + 1).padStart(2, '0')}</span>
          <h3>{title}</h3>
          <p>{text}</p>
        </li>
      ))}
    </ol>
  );
}
