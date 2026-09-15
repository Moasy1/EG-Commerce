import { getSupabaseServerClient } from '../_lib/supabaseServer.js';
import { readJsonBody, requireMethod, sendError, sendJson } from '../_lib/http.js';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export default async function handler(request, response) {
  if (!requireMethod(request, response, ['PATCH', 'POST'])) return;

  try {
    const { orderId, databaseId, status } = await readJsonBody(request);
    if (!orderId && !databaseId) {
      sendError(response, 400, 'orderId or databaseId is required');
      return;
    }
    if (!status) {
      sendError(response, 400, 'status is required');
      return;
    }

    const supabase = getSupabaseServerClient();
    let persistence = { persisted: false, reason: 'Supabase server env is not configured' };

    if (supabase && UUID_RE.test(databaseId || orderId)) {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', databaseId || orderId);

      persistence = error
        ? { persisted: false, error: error.message }
        : { persisted: true };
    }

    sendJson(response, 200, {
      ok: true,
      orderId,
      databaseId,
      status,
      persistence
    });
  } catch (error) {
    sendError(response, 500, error.message || 'Failed to update order status');
  }
}
