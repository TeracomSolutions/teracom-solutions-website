// Server-only. Customer feedback from the order-complete page (api/customer_feedback.py on the backend):
// the Google review link to offer, and the customer's answers, sent with the website's service token so the
// backend accepts them only from here, after this site has checked the checkout was paid.
if (typeof window !== 'undefined') {
  throw new Error('lib/api/feedback.js must only be used on the server.');
}

import { backendFetch } from './client.js';

export async function fetchReviewLink() {
  try {
    const data = await backendFetch('/feedback/review-link');
    return typeof data?.url === 'string' ? data.url : '';
  } catch {
    return '';
  }
}

export async function submitFeedback(payload, clientIp) {
  const headers = { 'X-Internal-Service-Token': process.env.WEBSITE_FRONTEND_SERVICE_TOKEN || '' };
  if (clientIp) headers['X-Client-IP'] = clientIp;
  return backendFetch('/feedback/answer', { method: 'POST', body: payload, headers });
}
