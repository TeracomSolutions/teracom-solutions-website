'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { canSimulate, recordsSummary, cleanupConfirmText, cleanupResultText } from '@/lib/testToolsView';

export default function AdminTestTools({ scenarioInfo, recordsInfo }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [selectedScenario, setSelectedScenario] = useState('');
  const [local, setLocal] = useState(false);

  async function handleSimulate() {
    if (busy) return;

    setBusy(true);
    setMessage('');
    setError('');

    try {
      const response = await fetch('/api/admin/test-tools/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario: selectedScenario }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || data.detail || 'That did not work');

      setMessage(
        <>
          Test order created. <Link href={`/admin/orders/${data.order_id}`} className="admin-link">Open the order</Link>
        </>
      );
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleCleanup() {
    if (busy || scenarioInfo?.mode !== 'test') return;

    setBusy(true);
    setMessage('');
    setError('');

    const confirmText = cleanupConfirmText(recordsInfo.records, recordsInfo.simulated_orders, local);
    if (!window.confirm(confirmText)) {
      setBusy(false);
      return;
    }

    try {
      const response = await fetch('/api/admin/test-tools/cleanup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ local }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || data.detail || 'That did not work');

      setMessage(cleanupResultText(data));
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      {/* Simulate an order section */}
      <div className="admin-card">
        <h2 className="admin-heading">Simulate an order</h2>
        <p>Mode: <span className="admin-muted">{scenarioInfo?.mode}</span></p>

        {!canSimulate(scenarioInfo) ? (
          <p className="admin-muted">Simulated orders are only available in preview and test mode, with the order flow switched on.</p>
        ) : (
          <>
            <select
              value={selectedScenario}
              onChange={(e) => setSelectedScenario(e.target.value)}
              disabled={busy}
              className="form-control"
            >
              <option value="">Select a scenario</option>
              {scenarioInfo?.scenarios?.map((scenario) => (
                <option key={scenario.key} value={scenario.key}>
                  {scenario.label}
                </option>
              ))}
            </select>

            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSimulate}
              disabled={busy || !selectedScenario}
              style={{ marginTop: '1rem' }}
            >
              Make a test order
            </button>
          </>
        )}
      </div>

      {/* Clean up test records section */}
      <div className="admin-card">
        <h2 className="admin-heading">Clean up test records</h2>
        <p>{recordsSummary(recordsInfo.records)} ({recordsInfo.simulated_orders} simulated order{recordsInfo.simulated_orders !== 1 ? 's' : ''})</p>

        {scenarioInfo?.mode !== 'test' && (
          <p className="admin-muted">Clean-up only runs in test mode.</p>
        )}

        <div style={{ marginTop: '1rem' }}>
          <label>
            <input
              type="checkbox"
              checked={local}
              onChange={(e) => setLocal(e.target.checked)}
              disabled={busy || scenarioInfo?.mode !== 'test'}
            />
            Also remove the simulated test orders from this site
          </label>
        </div>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleCleanup}
          disabled={busy || scenarioInfo?.mode !== 'test'}
          style={{ marginTop: '1rem' }}
        >
          Clean up
        </button>
      </div>

      {/* Message and error sections */}
      {message && (
        <div className="admin-card">
          <p className="admin-muted">{message}</p>
        </div>
      )}

      {error && (
        <div className="admin-card">
          <p className="form-error" role="alert">{error}</p>
        </div>
      )}
    </>
  );
}