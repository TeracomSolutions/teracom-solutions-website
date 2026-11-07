'use client';

import { setAdminZone } from '@/lib/adminFormat';

// Tells the date formatting which time zone the console is set to (Connections > Time). It renders
// before the page content, on the server and in the browser, so every time on the page agrees.
export default function AdminZoneSetter({ zone }) {
  setAdminZone(zone);
  return null;
}
