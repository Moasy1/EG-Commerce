import { getSupabaseServerClient } from '../_lib/supabaseServer.js';
import { readJsonBody, requireMethod, sendError, sendJson } from '../_lib/http.js';

/**
 * Admin Password Reset API
 * POST /api/commerce/admin-reset-password
 * 
 * Body: { userId: string, newPassword: string, adminToken?: string }
 * 
 * Uses Supabase service role key to update user password via auth.admin API.
 * This endpoint MUST be server-side only — never expose the service role key to the client.
 */
export default async function handler(request, response) {
  if (!requireMethod(request, response, ['POST'])) return;

  try {
    const body = await readJsonBody(request);
    const { userId, newPassword } = body;

    if (!userId || typeof userId !== 'string') {
      return sendError(response, 400, 'Missing or invalid userId');
    }

    if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 6) {
      return sendError(response, 400, 'Password must be at least 6 characters');
    }

    const supabase = getSupabaseServerClient();
    if (!supabase) {
      return sendError(response, 503, 'Supabase server client unavailable. Check SUPABASE_SERVICE_ROLE_KEY.');
    }

    // Use Supabase Admin API to update user password
    const { data, error } = await supabase.auth.admin.updateUserById(userId, {
      password: newPassword
    });

    if (error) {
      console.error('[admin-reset-password] Supabase error:', error.message);
      return sendError(response, 422, `Supabase auth error: ${error.message}`);
    }

    sendJson(response, 200, {
      ok: true,
      message: 'Password updated successfully',
      userId: data?.user?.id || userId
    });
  } catch (error) {
    console.error('[admin-reset-password] Server error:', error);
    sendError(response, 500, error.message || 'Internal server error');
  }
}
