const JSON_HEADERS = {
  'Content-Type': 'application/json'
};

async function parseJsonResponse(response) {
  const payload = await response.json().catch(() => null);

  if (!response.ok || payload?.ok === false) {
    const message = payload?.error?.message || `Commerce API request failed (${response.status})`;
    throw new Error(message);
  }

  return payload;
}

export const CommerceApi = {
  async createOrder(payload) {
    const response = await fetch('/api/commerce/orders', {
      method: 'POST',
      headers: JSON_HEADERS,
      body: JSON.stringify(payload)
    });

    return parseJsonResponse(response);
  },

  async updateOrderStatus(orderId, status, databaseId = null) {
    const response = await fetch('/api/commerce/order-status', {
      method: 'PATCH',
      headers: JSON_HEADERS,
      body: JSON.stringify({ orderId, databaseId, status })
    });

    return parseJsonResponse(response);
  }
};
