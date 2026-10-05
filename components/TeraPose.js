import Image from 'next/image';

// Tera, the Teracom dinosaur mascot, in one of the poses in
// public/assets/tera (from the graphics library, Robert, 2026-10-05).
// Decorative, so the picture has no alt text.
const POSES = {
  celebrate: { file: 'tera-celebrate.webp', width: 560, height: 518 },
  grin: { file: 'tera-grin.webp', width: 560, height: 534 },
  laptop: { file: 'tera-laptop.webp', width: 560, height: 514 },
  presenting: { file: 'tera-presenting.webp', width: 560, height: 525 },
  ready: { file: 'tera-ready.webp', width: 560, height: 536 },
  sitting: { file: 'tera-sitting.webp', width: 560, height: 531 },
  'thumbs-up': { file: 'tera-thumbs-up.webp', width: 560, height: 550 },
  'thumbs-up-grin': { file: 'tera-thumbs-up-grin.webp', width: 560, height: 527 },
  turn: { file: 'tera-turn.webp', width: 560, height: 538 },
  walking: { file: 'tera-walking.webp', width: 560, height: 535 },
  wink: { file: 'tera-wink.webp', width: 560, height: 550 },
};

export default function TeraPose({ pose = 'thumbs-up', size = 160, className = '' }) {
  const spec = POSES[pose] || POSES['thumbs-up'];
  return (
    <Image
      className={`tera-pose ${className}`.trim()}
      src={`/assets/tera/${spec.file}`}
      alt=""
      width={size}
      height={Math.round((size * spec.height) / spec.width)}
      sizes={`${size}px`}
      aria-hidden="true"
    />
  );
}