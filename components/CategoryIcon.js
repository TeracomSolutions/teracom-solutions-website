const paths = {
  cctv: (
    <>
      <path d="M3 8l11-3v10L3 12V8z" />
      <path d="M14 8.5l6-2v9l-6-2" />
      <circle cx="6" cy="17" r="1.4" />
      <path d="M6 15.5V12" />
    </>
  ),
  'access-control': (
    <>
      <rect x="4" y="5" width="16" height="14" rx="2" />
      <circle cx="9.5" cy="12" r="2.2" />
      <path d="M13.5 9.5h4M13.5 12h4M13.5 14.5h2.5" />
    </>
  ),
  intrusion: (
    <>
      <path d="M12 3l8 3.6v5c0 4.6-3.2 7.8-8 9.4-4.8-1.6-8-4.8-8-9.4v-5L12 3z" />
      <path d="M12 8v4.5M12 15.2v.1" />
    </>
  ),
  networking: (
    <>
      <circle cx="12" cy="5" r="1.8" />
      <circle cx="5" cy="18" r="1.8" />
      <circle cx="19" cy="18" r="1.8" />
      <path d="M12 6.8v3M12 9.8L6.3 16.4M12 9.8l5.7 6.6" />
    </>
  ),
  audio: (
    <>
      <rect x="7" y="3" width="10" height="18" rx="4" />
      <circle cx="12" cy="8" r="2" />
      <circle cx="12" cy="15.5" r="2.5" />
    </>
  ),
  ups: (
    <>
      <rect x="6" y="3" width="12" height="18" rx="2" />
      <path d="M13 7l-4 6h3l-1 5 5-7h-3l1-4z" fill="currentColor" stroke="none" />
    </>
  ),
  cable: (
    <>
      <path d="M8 5v3a4 4 0 004 4 4 4 0 004-4V5" />
      <path d="M12 12v9" />
      <path d="M6 3h4M14 3h4" />
    </>
  ),
  intercoms: (
    <>
      <rect x="7" y="3" width="10" height="18" rx="2" />
      <circle cx="12" cy="8" r="2.3" />
      <path d="M9.5 14h5M9.5 17h3" />
    </>
  ),
  'facial-recognition': (
    <>
      <path d="M4 8V6a2 2 0 012-2h2M4 16v2a2 2 0 002 2h2M20 8V6a2 2 0 00-2-2h-2M20 16v2a2 2 0 01-2 2h-2" />
      <circle cx="12" cy="12" r="3.4" />
    </>
  ),
  'video-accessories': (
    <>
      <rect x="3" y="7" width="18" height="10" rx="2" />
      <path d="M7 10.5v3M11 10.5v3M15 10.5v3M19 10.5v3" />
    </>
  ),
  nas: (
    <>
      <rect x="4" y="4" width="16" height="6" rx="1.5" />
      <rect x="4" y="14" width="16" height="6" rx="1.5" />
      <circle cx="7.5" cy="7" r="1" fill="currentColor" stroke="none" />
      <circle cx="7.5" cy="17" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  'power-supplies': (
    <>
      <rect x="5" y="4" width="14" height="16" rx="2" />
      <path d="M13 8l-4 5.5h3l-1 4.5 4.5-6h-3l0.5-4z" fill="currentColor" stroke="none" />
    </>
  ),
  screens: (
    <>
      <rect x="3" y="4" width="18" height="12" rx="1.5" />
      <path d="M8 20h8M12 16v4" />
    </>
  ),
  projectors: (
    <>
      <rect x="3" y="8" width="14" height="8" rx="2" />
      <circle cx="9" cy="12" r="2.6" />
      <path d="M17 11l4-2v6l-4-2z" />
    </>
  ),
  zwave: (
    <>
      <path d="M4 20L11 4l2 8 3-5 4 13" />
      <circle cx="11" cy="4" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  'cyber-security': (
    <>
      <path d="M12 3l8 3.6v5c0 4.6-3.2 7.8-8 9.4-4.8-1.6-8-4.8-8-9.4v-5L12 3z" />
      <path d="M8.7 12l2.3 2.3 4.3-4.6" />
    </>
  ),
  sites: (
    <>
      <rect x="6" y="3" width="12" height="18" rx="1" />
      <path d="M9 7h1.5M13.5 7H15M9 10.5h1.5M13.5 10.5H15M9 14h1.5M13.5 14H15" />
      <path d="M10 21v-4h4v4" />
    </>
  ),
  countries: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17" />
      <path d="M12 3.5c2.8 2.4 4.3 5.4 4.3 8.5s-1.5 6.1-4.3 8.5c-2.8-2.4-4.3-5.4-4.3-8.5S9.2 5.9 12 3.5z" />
    </>
  ),
  years: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l4 2" />
    </>
  ),
  unify: (
    <>
      <circle cx="9.2" cy="12" r="6" />
      <circle cx="14.8" cy="12" r="6" />
    </>
  ),
  multipath: (
    <>
      <circle cx="5" cy="12" r="1.8" />
      <path d="M7 12h3M10 12l4-5M10 12l4 5" />
      <circle cx="18" cy="7" r="1.8" />
      <circle cx="18" cy="17" r="1.8" />
    </>
  ),
  'no-lockin': (
    <>
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 017.6-1.8" />
    </>
  ),
  scale: (
    <>
      <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
    </>
  ),
  help: (
    <>
      <path d="M4 5.5A2.5 2.5 0 016.5 3h11A2.5 2.5 0 0120 5.5v9a2.5 2.5 0 01-2.5 2.5H10l-4.5 4v-4H6.5A2.5 2.5 0 014 14.5v-9z" />
      <path d="M9.6 9.3a2.4 2.4 0 114 1.8c-.7.5-1.6 1-1.6 2.1" />
      <circle cx="12" cy="15.3" r="0.1" fill="currentColor" stroke="currentColor" strokeWidth="1.8" />
    </>
  ),
};

export default function CategoryIcon({ slug }) {
  const content = paths[slug];
  if (!content) return null;
  return (
    <svg
      className="category-icon"
      viewBox="0 0 24 24"
      width="28"
      height="28"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {content}
    </svg>
  );
}
