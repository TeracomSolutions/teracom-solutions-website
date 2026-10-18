/*
 * Session expansions to fetch when the full Stripe session is fetched
 */
export const SESSION_EXPANSIONS = ['line_items.data.price.product', 'shipping_cost.shipping_rate'];

/*
 * Should we forward orders to the order flow?
 */
export function shouldForward(env) { return String((env && env.ORDER_FLOW_FORWARD) || '').trim().toLowerCase() === 'true'; }

/*
 * Build the body for forwarding a Stripe session to the order flow
 */
export function buildForwardBody(session, eventId) {
  if (!session || typeof session !== 'object' || typeof session.id !== 'string') {
    throw new Error('The Stripe session has no id');
  }
  return { session, event_id: eventId || null };
}

/*
 * Describe the result of forwarding to the order flow
 */
export function describeForwardResult(result) {
  if (result && result.recorded === true) {
    return 'Order ' + result.order_id + (result.created ? ' recorded' : ' already recorded');
  } else if (result && result.recorded === false) {
    return 'Order flow not recording: ' + (result.reason || 'switched off');
  } else {
    return 'Unexpected answer from the order flow';
  }
}