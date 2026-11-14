import { cookies } from 'next/headers';

import AdminBrand from './AdminBrand';
import AdminSidebarClock from './AdminSidebarClock';
import AdminNav from './AdminNav';
import AdminPageInfo from './AdminPageInfo';
import AdminSidebarKeeper from './AdminSidebarKeeper';
import AdminSidebarResizer from './AdminSidebarResizer';
import AdminZoneSetter from './AdminZoneSetter';
import AdminAssistantBubble from './AdminAssistantBubble';
import { ACCESS_TOKEN_COOKIE } from '@/lib/adminSession';
import { fetchTime } from '@/lib/api/adminTime';
import { staffMe } from '@/lib/api/adminAuth';

// The frame every admin page sits in: the menu down the left-hand side (Robert, 2026-10-25,
// like the Global platform), then the console's brand bar and the page. A server component,
// so pages stay server components too and read the session cookie themselves. The public
// site's header and footer are not rendered on /admin (components/PublicChrome.js).
export default async function AdminShell({ children }) {
  // The time zone chosen under Connections > Time; Melbourne if it cannot be read.
  let zone = '';
  let canChat = false;
  const token = (await cookies()).get(ACCESS_TOKEN_COOKIE)?.value;
  if (token) {
    // Both at once, so the page is not held up twice.
    const [time, me] = await Promise.allSettled([fetchTime(token), staffMe(token)]);
    zone = time.status === 'fulfilled' ? time.value?.zone || '' : '';
    // The Assistant is for administrators (api/staff_assistant.py), so only they get the floating Tera.
    canChat = me.status === 'fulfilled' && me.value?.staff_role === 'platform_admin';
  }
  return (
    <main id="main-content" className="admin-main">
      <AdminZoneSetter zone={zone} />
      <div className="admin-layout">
        <aside className="admin-sidebar">
          <AdminSidebarKeeper />
          <AdminBrand part="logo" />
          <AdminSidebarClock zone={zone} />
          <AdminNav />
          <AdminSidebarResizer />
        </aside>
        <section className="admin-section admin-content">
          <AdminBrand part="bar" />
          <AdminPageInfo />
          {children}
        </section>
      </div>
      {canChat ? <AdminAssistantBubble /> : null}
    </main>
  );
}
