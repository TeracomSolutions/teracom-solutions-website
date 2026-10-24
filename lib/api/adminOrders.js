// Server-only API for admin orders
// This file must only be used on the server.
if (typeof window !== 'undefined') {
  throw new Error('lib/api/adminOrders.js must only be used on the server.');
}

import { backendFetch } from './client.js';

export async function fetchOrders(token, { status, mode, q, stage, atStage, stuck, skip, limit } = {}) {
  const searchParams = {};
  if (status) searchParams.status = status;
  if (mode) searchParams.mode = mode;
  if (q) searchParams.q = q;
  if (stage) searchParams.stage = stage;
  if (atStage) searchParams.at_stage = atStage;
  if (stuck) searchParams.stuck = 'true';
  if (skip !== undefined) searchParams.skip = skip;
  if (limit !== undefined) searchParams.limit = limit;

  return backendFetch('/staff/orders', { token, searchParams });
}

export async function fetchOrderBanner(token) {
  return backendFetch('/staff/orders/banner', { token });
}

export async function fetchOrderAlerts(token) {
  return backendFetch('/staff/orders/alerts', { token });
}

export async function fetchOrdersDashboard(token, { mode } = {}) {
  const searchParams = {};
  if (mode) searchParams.mode = mode;
  return backendFetch('/staff/orders/dashboard', { token, searchParams });
}

export async function fetchOrder(token, orderId) {
  return backendFetch(`/staff/orders/${encodeURIComponent(orderId)}`, { token });
}

export async function prepareOrderStep(token, orderId, stepName) {
  return backendFetch(`/staff/orders/${encodeURIComponent(orderId)}/steps/${encodeURIComponent(stepName)}/prepare`, {
    token,
    method: 'POST'
  });
}

export async function approveOrderStep(token, orderId, stepName) {
  return backendFetch(`/staff/orders/${encodeURIComponent(orderId)}/steps/${encodeURIComponent(stepName)}/approve`, {
    token,
    method: 'POST'
  });
}