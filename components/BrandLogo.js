import Image from 'next/image';

// A brand's logo for its card or page: the hand-made file when there is one,
// otherwise the logo the backend found or staff uploaded. A see-through logo
// is shown as a white silhouette like the others; a solid one (a square app
// icon) is shown as it is, on a tile (.brand-logo-tile in globals.css).
export default function BrandLogo({ brand, className, width, height }) {
  if (brand.logoFile) {
    return <Image className={className} src={`/assets/logos/${brand.logoFile}`} alt={`${brand.name} logo`} width={width} height={height} />;
  }
  if (brand.logoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        className={`${className}${brand.logoTile ? ' brand-logo-tile' : ''}`}
        src={brand.logoUrl}
        alt={`${brand.name} logo`}
        loading="lazy"
      />
    );
  }
  return null;
}