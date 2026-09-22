import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ServiceIcon from '@/components/ServiceIcon';

// Service tile in the same style as the tool cards on /tools: icon, number,
// capability chips and a large watermark icon that turns on hover.
export default function ServiceCard({ service, number }) {
  return (
    <Link href={`/services/${service.slug}`} className="tool-card service-card">
      <span className="service-card-top">
        <span className="tool-card-icon">
          <ServiceIcon slug={service.slug} size={26} />
        </span>
        {number ? <span className="service-card-number">{String(number).padStart(2, '0')}</span> : null}
      </span>
      <h3>{service.title}</h3>
      <p>{service.lead}</p>
      {service.tags?.length ? (
        <span className="service-tags">
          {service.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </span>
      ) : null}
      <span className="tool-card-cta">
        Explore <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
      </span>
      <span className="tool-card-watermark" aria-hidden="true">
        <ServiceIcon slug={service.slug} size={150} strokeWidth={1} />
      </span>
    </Link>
  );
}
