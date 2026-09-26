import AdminBrand from './AdminBrand';
import AdminNav from './AdminNav';

// The frame every admin page sits in: the console's own brand bar and menu,
// then the page. A server component, so pages stay server components too
// and read the session cookie themselves. The public site's header and
// footer are not rendered on /admin (components/PublicChrome.js).
export default function AdminShell({ children }) {
  return (
    <main id="main-content" className="admin-main">
      <section className="section section-spacious admin-section">
        <div className="container admin-container">
          <AdminBrand />
          <AdminNav />
          {children}
        </div>
      </section>
    </main>
  );
}
