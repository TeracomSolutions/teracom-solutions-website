import { renderArt } from '@/lib/brandArt';

// A brand drawing from lib/brandArt, drawn on the server as inline SVG in
// the brand's own colour. The SVG is built only from the brand profiles in
// this repository and every label in it is escaped.
export default function BrandArt({ spec, uid, accent, className }) {
  const svg = renderArt(spec, { uid, accent });
  if (!svg) return null;
  return <div className={className ? `brand-art ${className}` : 'brand-art'} dangerouslySetInnerHTML={{ __html: svg }} />;
}