import { backendFetch } from './client.js';

export async function fetchPurchaseOrders(token, orderId) {
  return await backendFetch(`/staff/orders/${encodeURIComponent(orderId)}/purchase-orders`, {
    token,
    method: 'GET',
  });
}

export async function planPurchaseOrders(token, orderId) {
  return await backendFetch(`/staff/orders/${encodeURIComponent(orderId)}/purchase-orders/plan`, {
    token,
    method: 'POST',
  });
}

export async function createPurchaseOrder(token, poId) {
  return await backendFetch(`/staff/purchase-orders/${encodeURIComponent(poId)}/create`, {
    token,
    method: 'POST',
  });
}

export async function sendPurchaseOrder(token, poId) {
  return await backendFetch(`/staff/purchase-orders/${encodeURIComponent(poId)}/send`, {
    token,
    method: 'POST',
  });
}
