/*
 * Shows the platform time under the logo (Robert, 2026-11-08)
 */
'use client';

import { useEffect, useState } from 'react';

export default function AdminSidebarClock({ zone }) {
  const [now, setNow] = useState(null);

  useEffect(() => {
    // Set initial time immediately
    setNow(new Date());

    // Update every second
    const intervalId = setInterval(() => {
      setNow(new Date());
    }, 1000);

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  if (now === null) {
    return <div className="admin-sidebar-clock" aria-hidden="true" />;
  }

  const timeZone = zone || 'Australia/Melbourne';

  // Helper function to format date/time with fallback
  function formatDateTime(date, options) {
    try {
      return new Intl.DateTimeFormat('en-AU', { ...options, timeZone }).format(date);
    } catch (e) {
      // If the timezone is invalid, fall back to Melbourne
      return new Intl.DateTimeFormat('en-AU', { ...options, timeZone: 'Australia/Melbourne' }).format(date);
    }
  }

  const date = formatDateTime(now, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  const time = formatDateTime(now, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZoneName: 'short'
  });

  return (
    <div className="admin-sidebar-clock" role="timer" aria-label="Platform date and time">
      <span className="admin-sidebar-clock-date">{date}</span>
      <span className="admin-sidebar-clock-time">{time}</span>
    </div>
  );
}