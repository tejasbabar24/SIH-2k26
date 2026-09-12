// Vercel replaces VITE_* values at build time. Local development keeps this fallback.
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1').replace(/\/$/, '');

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  if (!response.ok) throw new Error(`API request failed (${response.status})`);
  return response.json();
}

export async function queryResearchAssistant(question, userRole = 'researcher') {
  return request('/ai/query', {
    method: 'POST',
    body: JSON.stringify({ question, userRole }),
  });
}

export async function runPolicySimulation(payload) {
  return request('/policy-simulations', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export { API_BASE_URL };
