export function sendJson(response, statusCode, payload) {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
  response.status(statusCode).setHeader('Content-Type', 'application/json');
  response.end(JSON.stringify(payload));
}

export function sendError(response, statusCode, message, details = null) {
  sendJson(response, statusCode, {
    ok: false,
    error: {
      message,
      details
    }
  });
}

export function requireMethod(request, response, methods) {
  if (request.method === 'OPTIONS') {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
    response.status(204).end();
    return false;
  }

  if (methods.includes(request.method)) return true;

  response.setHeader('Allow', methods.join(', '));
  sendError(response, 405, `Method ${request.method} is not allowed`);
  return false;
}

export async function readJsonBody(request) {
  if (request.body && typeof request.body === 'object') {
    return request.body;
  }

  const chunks = [];
  for await (const chunk of request) {
    chunks.push(chunk);
  }

  const rawBody = Buffer.concat(chunks).toString('utf8');
  if (!rawBody) return {};

  return JSON.parse(rawBody);
}
