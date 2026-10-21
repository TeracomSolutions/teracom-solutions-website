'use client';

import { useEffect, useState } from 'react';

// Two tabs on the AI Connections page: the connections (with the routing
// picture) and the governance rules. #governance in the address opens the
// second tab directly and the choice is kept in the hash.
const TABS = [
  { key: 'connections', label: 'Connections' },
  { key: 'governance', label: 'Governance' },
];

export default function AdminAiTabs({ connections, governance, idPrefix = '', useHash = true }) {
  const [active, setActive] = useState('connections');

  useEffect(() => {
    if (useHash && typeof window !== 'undefined' && window.location.hash === '#governance') setActive('governance');
  }, []);

  function choose(key) {
    setActive(key);
    if (useHash && typeof window !== 'undefined') {
      const url = `${window.location.pathname}${key === 'governance' ? '#governance' : ''}`;
      window.history.replaceState(null, '', url);
    }
  }

  return (
    <div>
      <div className="admin-tabs" role="tablist" aria-label="AI Connections sections">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            role="tab"
            id={`${idPrefix}ai-tab-${tab.key}`}
            aria-selected={active === tab.key}
            aria-controls={`${idPrefix}ai-panel-${tab.key}`}
            className={active === tab.key ? 'admin-tab active' : 'admin-tab'}
            onClick={() => choose(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div role="tabpanel" id={`${idPrefix}ai-panel-connections`} aria-labelledby={`${idPrefix}ai-tab-connections`} hidden={active !== 'connections'}>
        {connections}
      </div>
      <div role="tabpanel" id={`${idPrefix}ai-panel-governance`} aria-labelledby={`${idPrefix}ai-tab-governance`} hidden={active !== 'governance'}>
        {governance}
      </div>
    </div>
  );
}
