import AdminNav from './AdminNav';

// The frame every admin page sits in: the site's usual section/container,
// the admin menu, then the page. A server component, so pages stay server
// components too and read the session cookie themselves.
export default function AdminShell({ children }) {
  return (
    <main id="main-content">
      <section className="section section-spacious">
        <div className="container admin-container">
          <AdminNav />
          {children}
        </div>
      </section>
    </main>
  );
}
