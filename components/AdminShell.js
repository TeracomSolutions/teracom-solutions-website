import { cookies } from 'next/headers';

import AdminBrand from './AdminBrand';
import AdminNav from './AdminNav';
import AdminPageInfo from './AdminPageInfo';
import AdminSidebarResizer from './AdminSidebarResizer';
import AdminZoneSetter from './AdminZoneSetter';
import { ACCESS_TOKEN_COOKIE } from '@/lib/adminSession';
import { fetchTime } from '@/lib/api/adminTime';

// The frame every admin page sits in: the menu down the left-hand side (Robert, 2026-10-25,
// like the Global platform), then the console's brand bar and the page. A server component,
// so pages stay server components too and read the session cookie themselves. The public
// site's header and footer are not rendered on /admin (components/PublicChrome.js).
export default async function AdminShell({ children }) {
  // The time zone chosen under Connections > Time; Melbourne if it cannot be read.
  let zone = '';
  try {
    const token = (await cookies()).get(ACCESS_TOKEN_COOKIE)?.value;
    if (token) zone = (await fetchTime(token)).zone || '';
  } catch {
    zone = '';
  }
  return (
    <main id="main-content" className="admin-main">
      <AdminZoneSetter zone={zone} />
      <div className="admin-layout">
        <aside className="admin-sidebar">
          <AdminBrand part="logo" />
          <AdminNav />
          <AdminSidebarResizer />
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
