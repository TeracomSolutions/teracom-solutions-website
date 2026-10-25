import AdminBrand from './AdminBrand';
import AdminNav from './AdminNav';
import AdminPageInfo from './AdminPageInfo';

// The frame every admin page sits in: the menu down the left-hand side (Robert, 2026-10-25,
// like the Global platform), then the console's brand bar and the page. A server component,
// so pages stay server components too and read the session cookie themselves. The public
// site's header and footer are not rendered on /admin (components/PublicChrome.js).
export default function AdminShell({ children }) {
  return (
    <main id="main-content" className="admin-main">
      <div className="admin-layout">
        <aside className="admin-sidebar">
          <AdminBrand part="logo" />
          <AdminNav />
        </aside>
        <section className="admin-section admin-content">
          <AdminBrand part="bar" />
          <AdminPageInfo />
          {children}
        </section>
      </div>
    </main>
  );
}
