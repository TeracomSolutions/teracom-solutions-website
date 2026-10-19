/*
 * Order flow banner component
 */
export default function AdminOrderBanner({ banner, counts }) {
  if (!banner) return null;

  const { mode, flow_enabled, text } = banner;
  const { awaiting_approval = 0, failed = 0, in_progress = 0, attention = 0, complete = 0 } = counts || {};

  return (
    <div className={`admin-card ${mode === 'live' ? 'admin-banner-warn' : mode === 'test' ? 'admin-banner-test' : ''}`}>
      <p><strong>{text}</strong></p>
      <p>Order flow is {flow_enabled ? 'on' : 'off'}</p>
      <p>
        Waiting for your approval: {awaiting_approval},
        Failed steps: {failed},
        In progress: {in_progress},
        Need attention: {attention},
        Complete: {complete}
      </p>
    </div>
  );
}