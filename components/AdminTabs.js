'use client';

import { useEffect, useState } from 'react';

// Tabs for a console page: tabs = [{ key, label, content }]. The first tab
// shows unless the address ends in #<key>; choosing a tab puts its key in
// the address so a reload or a shared link opens the same tab. Every panel
// stays mounted (hidden, not removed) so a half-written form survives a
// look at another tab.
export default function AdminTabs({ tabs, ariaLabel }) {
  const list = tabs || [];
  const [active, setActive] = useState(list[0]?.key);

  useEffect(() => {
    const wanted = window.location.hash.replace(/^#/, '');
    if (wanted && list.some((t) => t.key === wanted)) setActive(wanted);
    // Only on first load: the tabs themselves never change after that.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function choose(key) {
    setActive(key);
    window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}#${key}`);
  }

  return (
    <div>
      <div className="admin-tabs" role="tablist" aria-label={ariaLabel}>
        {list.map((tab) => (
          <button
            key={tab.key}
            type="button"
            role="tab"
            id={`tab-${tab.key}`}
            aria-selected={active === tab.key}
            aria-controls={`panel-${tab.key}`}
            className={active === tab.key ? 'admin-tab active' : 'admin-tab'}
            onClick={() => choose(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {list.map((tab) => (
        <div key={tab.key} role="tabpanel" id={`panel-${tab.key}`} aria-labelledby={`tab-${tab.key}`} hidden={active !== tab.key}>
          {tab.content}
        </div>
      ))}
    </div>
  );
}
