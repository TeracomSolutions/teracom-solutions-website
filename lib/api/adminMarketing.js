// Server-only API for marketing campaigns (api/staff_marketing.py).
if (typeof window !== 'undefined') {
  throw new Error('lib/api/adminMarketing.js must only be used on the server.');
}
import { backendFetch } from './client.js';

export async function fetchMarketing(token) {
  return backendFetch('/staff/marketing', { token });
}

export async function createCampaign(token, body) {
  return backendFetch('/staff/marketing/campaigns', { method: 'POST', token, body });
}

export async function updateCampaign(token, id, body) {
  return backendFetch('/staff/marketing/campaigns/' + encodeURIComponent(id), { method: 'PUT', token, body });
}

export async function deleteCampaign(token, id) {
  return backendFetch('/staff/marketing/campaigns/' + encodeURIComponent(id), { method: 'DELETE', token });
}

export async function saveMarketingSettings(token, body) {
  return backendFetch('/staff/marketing/settings', { method: 'PUT', token, body });
}

export async function prepareWeekly(token) {
  return backendFetch('/staff/marketing/weekly/prepare', { method: 'POST', token });
}

// Customer feedback after checkout (api/customer_feedback.py).
export async function fetchFeedback(token) {
  return backendFetch('/staff/feedback', { token });
}

export async function saveFeedbackSettings(token, body) {
  return backendFetch('/staff/feedback/settings', { method: 'PUT', token, body });
}
