import { buildMerchantOrders, persistOrdersBestEffort } from '../_lib/orderEngine.js';
import { readJsonBody, requireMethod, sendError, sendJson } from '../_lib/http.js';

export default async function handler(request, response) {
  if (!requireMethod(request, response, ['GET', 'POST'])) return;

  try {
    if (request.method === 'GET') {
      sendJson(response, 200, {
        ok: true,
        orders: [],
        source: 'api',
        note: 'Order reads are still client-fallback first until authenticated merchant/user isolation is wired.'
      });
      return;
    }

    const payload = await readJsonBody(request);
    const orders = buildMerchantOrders(payload);
    const persistence = await persistOrdersBestEffort(orders);

    sendJson(response, 201, {
      ok: true,
      orders,
      persistence
    });
  } catch (error) {
    sendError(response, error.statusCode || 500, error.message || 'Failed to create order');
  }
}
