// Hero art for every page: the page's emblem, gently floating, with three
// badges on a slowly spinning orbit -- the same moving look as the store and
// Monitoring heroes (Robert, 2026-10-05: "I want them all to appear like
// they're moving"). Pass `icon`, or the emblem itself as children when it
// needs props (ToolIcon, ServiceIcon). Styles: .store-art in globals.css.
export default function OrbitArt({ icon: Icon, badges = [], children }) {
  return (
    <div className="store-art" aria-hidden="true">
      <span className="store-art-ring tool-hero-ring">
        {children || (Icon ? <Icon size={92} strokeWidth={1.3} aria-hidden="true" focusable="false" /> : null)}
      </span>
      <span className="store-art-orbit">
        {badges.slice(0, 3).map((Badge, i) => (
          <span className={`store-art-badge store-art-badge-${i + 1}`} key={i}>
            <span>
              <Badge size={22} strokeWidth={1.8} aria-hidden="true" focusable="false" />
            </span>
          </span>
        ))}
      </span>
    </div>
  );
}