'use client';

import { useState, useEffect } from 'react';
import { moveInList, providerState, stateLabel, ringLayout, workShare } from '@/lib/aiRouting';

export default function AdminAiRouting({ initialRouting, providersCatalogue }) {
  const [routing, setRouting] = useState(initialRouting);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Auto-refresh every 60 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch('/api/admin/ai-connections/routing');
        if (response.ok) {
          const data = await response.json();
          setRouting(data);
        }
      } catch (error) {
        console.error('Failed to auto-refresh routing data:', error);
      }
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      const response = await fetch('/api/admin/ai-connections/routing');
      if (response.ok) {
        const data = await response.json();
        setRouting(data);
      }
    } catch (error) {
      console.error('Failed to refresh routing data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleMoveInList = async (flowType, providerKey, direction) => {
    // Create new order array
    let newOrder;
    if (flowType === 'assistant') {
      newOrder = moveInList(routing.assistant_order, providerKey, direction);
    } else {
      newOrder = moveInList(routing.research_order, providerKey, direction);
    }
    
    try {
      const response = await fetch('/api/admin/ai-connections/order', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ providers: newOrder }),
      });
      
      if (response.ok) {
        // Update local state
        setRouting(prev => ({
          ...prev,
          [flowType === 'assistant' ? 'assistant_order' : 'research_order']: newOrder
        }));
      }
    } catch (error) {
      console.error('Failed to update order:', error);
    }
  };

  const handleCheckProvider = async (providerKey) => {
    try {
      const response = await fetch(`/api/admin/ai-connections/${providerKey}/check`, {
        method: 'POST',
      });
      
      if (response.ok) {
        // Refresh the data to show updated status
        const refreshResponse = await fetch('/api/admin/ai-connections/routing');
        if (refreshResponse.ok) {
          const data = await refreshResponse.json();
          setRouting(data);
        }
      }
    } catch (error) {
      console.error('Failed to check provider:', error);
    }
  };

  // Get all configured providers (enabled ones)
  const configuredProviders = Object.entries(routing.providers)
    .filter(([key, info]) => info.enabled)
    .map(([key, info]) => ({ key, ...info }));

  // Calculate positions for ring layout
  const centerX = 360;
  const centerY = 230;
  const radius = 140;
  
  const providerPositions = ringLayout(configuredProviders.length, centerX, centerY, radius);
  
  // Get work share (which provider did most of the work)
  const workShareResult = workShare(routing.providers);

  const stateColors = {
    healthy: '#4ade80',
    failing: '#ff4b4b',
    off: '#6b7280',
    unknown: '#fbbf24'
  };

  return (
    <div className="admin-ai-routing">
      <div className="admin-ai-map">
        <svg width="720" height="460" viewBox="0 0 720 460" xmlns="http://www.w3.org/2000/svg">
          {/* Lines from center to providers */}
          {configuredProviders.map((provider, index) => {
            const pos = providerPositions[index];
            const state = providerState(provider);
            const isAssistantFirst = routing.assistant_order[0] === provider.key;
            const isResearchFirst = routing.research_order[0] === provider.key;
            
            // Determine line style
            let strokeColor = '#9ca3af';
            let strokeWidth = 1;
            let dashArray = null;
            
            if (isAssistantFirst || isResearchFirst) {
              strokeColor = '#6b7280';
              strokeWidth = 2;
            }
            
            return (
              <g key={provider.key}>
                {/* Line from center to provider */}
                <line
                  x1={centerX}
                  y1={centerY}
                  x2={pos.x}
                  y2={pos.y}
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  strokeDasharray={dashArray}
                />
                
                {/* Label for assistant/research */}
                {isAssistantFirst && (
                  <text
                    x={(centerX + pos.x) / 2}
                    y={(centerY + pos.y) / 2 - 10}
                    textAnchor="middle"
                    fill="#6b7280"
                    fontSize="12"
                    fontWeight="bold"
                  >
                    Assistant
                  </text>
                )}
                
                {isResearchFirst && (
                  <text
                    x={(centerX + pos.x) / 2}
                    y={(centerY + pos.y) / 2 - 10}
                    textAnchor="middle"
                    fill="#6b7280"
                    fontSize="12"
                    fontWeight="bold"
                  >
                    Research
                  </text>
                )}
              </g>
            );
          })}
          
          {/* Internet node */}
          <g>
            <circle cx="600" cy="230" r="30" fill="#ffffff" stroke="#9ca3af" strokeWidth="1" />
            <text x="600" y="225" textAnchor="middle" fill="#000000" fontSize="14" fontWeight="bold">Internet</text>
            <text x="600" y="240" textAnchor="middle" fill="#6b7280" fontSize="10">web search (DuckDuckGo)</text>
            
            {/* Line from center to Internet */}
            <line
              x1={centerX}
              y1={centerY}
              x2="600"
              y2="230"
              stroke="#9ca3af"
              strokeWidth="1"
              strokeDasharray="5,5"
            />
            
            {/* Label for Internet line */}
            <text
              x="480"
              y="230"
              textAnchor="middle"
              fill="#6b7280"
              fontSize="12"
              fontWeight="bold"
            >
              Research
            </text>
            
            {/* Arrow back from Internet to center */}
            <line
              x1="600"
              y1="230"
              x2={centerX}
              y2={centerY}
              stroke="#9ca3af"
              strokeWidth="1"
              markerEnd="url(#arrowhead)"
            />
            
            {/* Label for arrow */}
            <text
              x="540"
              y="200"
              textAnchor="middle"
              fill="#6b7280"
              fontSize="12"
              fontWeight="bold"
            >
              results verified by the critique model
            </text>
          </g>
          
          {/* Center Teracom website node */}
          <g>
            <rect x="300" y="200" rx="10" ry="10" width="120" height="60" fill="#ffffff" stroke="#9ca3af" strokeWidth="1" />
            <text x="360" y="225" textAnchor="middle" fill="#000000" fontSize="14" fontWeight="bold">Teracom website</text>
            <text x="360" y="240" textAnchor="middle" fill="#6b7280" fontSize="10">Assistant</text>
            <text x="360" y="250" textAnchor="middle" fill="#6b7280" fontSize="10">Scout</text>
          </g>
          
          {/* Provider nodes in ring */}
          {configuredProviders.map((provider, index) => {
            const pos = providerPositions[index];
            const state = providerState(provider);
            
            return (
              <g key={provider.key}>
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r="25"
                  fill={stateColors[state]}
                  stroke="#000000"
                  strokeWidth="1"
                />
                <title>{stateLabel(state, provider)}</title>
                <text
                  x={pos.x}
                  y={pos.y - 10}
                  textAnchor="middle"
                  fill="#000000"
                  fontSize="12"
                  fontWeight="bold"
                >
                  {provider.label}
                </text>
                <text
                  x={pos.x}
                  y={pos.y + 5}
                  textAnchor="middle"
                  fill="#6b7280"
                  fontSize="10"
                >
                  {provider.model}
                </text>
              </g>
            );
          })}
          
          {/* Arrowhead marker definition */}
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#9ca3af" />
            </marker>
          </defs>
        </svg>
      </div>
      
      {/* Legend */}
      <div className="admin-ai-legend">
        <span className="admin-ai-dot" style={{ backgroundColor: '#4ade80' }}></span> Responding
        <span className="admin-ai-dot" style={{ backgroundColor: '#ff4b4b' }}></span> Failing
        <span className="admin-ai-dot" style={{ backgroundColor: '#6b7280' }}></span> Disabled
        <span className="admin-ai-dot" style={{ backgroundColor: '#fbbf24' }}></span> Not used yet
      </div>
      
      {/* Order of preference */}
      <div className="admin-card admin-ai-order">
        <h3>Order of preference (applies to the Assistant and to Scout)</h3>
        <p>One order applies to both; Scout also prefers a self-hosted model first when one is configured.</p>
        
        <div className="admin-ai-order-list">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <h4>Assistant</h4>
            {routing.assistant_order.map((providerKey, index) => {
              const provider = routing.providers[providerKey];
              if (!provider) return null;
              
              return (
                <div key={providerKey} className="admin-ai-order-item">
                  <span>{provider.label}</span>
                  <div>
                    <button 
                      onClick={() => handleMoveInList('assistant', providerKey, -1)}
                      disabled={index === 0}
                      style={{ marginRight: '8px' }}
                    >
                      ↑
                    </button>
                    <button 
                      onClick={() => handleMoveInList('assistant', providerKey, 1)}
                      disabled={index === routing.assistant_order.length - 1}
                    >
                      ↓
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <h4>Scout research</h4>
            {routing.research_order.map((providerKey, index) => {
              const provider = routing.providers[providerKey];
              if (!provider) return null;
              
              return (
                <div key={providerKey} className="admin-ai-order-item">
                  <span>{provider.label}</span>
                  <div>
                    <button 
                      onClick={() => handleMoveInList('research', providerKey, -1)}
                      disabled={index === 0}
                      style={{ marginRight: '8px' }}
                    >
                      ↑
                    </button>
                    <button 
                      onClick={() => handleMoveInList('research', providerKey, 1)}
                      disabled={index === routing.research_order.length - 1}
                    >
                      ↓
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        <p>Scout research will try: {routing.research_order.join(', ')}</p>
      </div>
      
      {/* Work share table */}
      <div className="admin-card">
        <h3>Who did the work in the last 7 days</h3>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Provider</th>
                <th>State</th>
                <th>Assistant ok/failed</th>
                <th>Research ok/failed</th>
                <th>Critique ok/failed</th>
                <th>Average response</th>
                <th>Last problem</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(routing.providers).map(([key, info]) => (
                <tr key={key}>
                  <td>{info.label}</td>
                  <td className={`admin-status is-${providerState(info)}`}>
                    {stateLabel(providerState(info), info)}
                  </td>
                  <td>{info.counts?.assistant?.ok || 0}/{info.counts?.assistant?.failed || 0}</td>
                  <td>{info.counts?.research?.ok || 0}/{info.counts?.research?.failed || 0}</td>
                  <td>{info.counts?.critique?.ok || 0}/{info.counts?.critique?.failed || 0}</td>
                  <td>{info.avg_latency_ms ? `${info.avg_latency_ms} ms` : 'N/A'}</td>
                  <td>
                    {info.last_error_kind ? (
                      <span>
                        {info.last_error_kind.replace('_', ' ')}
                        {info.last_failed_at && ` at ${new Date(info.last_failed_at).toLocaleTimeString()}`}
                      </span>
                    ) : 'None'}
                  </td>
                  <td>
                    <button 
                      onClick={() => handleCheckProvider(key)}
                      className="btn btn-secondary btn-sm"
                    >
                      Check now
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="admin-actions">
        <button onClick={handleRefresh} disabled={isRefreshing} className="btn btn-secondary btn-sm admin-refresh">
          {isRefreshing ? 'Refreshing...' : 'Refresh now'}
        </button>
      </div>
    </div>
  );
}