/**
 * BhuNirnay — Backend API client
 * All officer auth calls go through here.
 */

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';
const AI_BASE = (import.meta.env.VITE_AI_API_URL || 'http://localhost:8000/api/v1').replace(/\/$/, '');

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }

  return data;
}

// ── Auth endpoints ────────────────────────────────────────────────────────────

/** Step 1 → 2: send OTP to a gov email */
export function sendOtp(email) {
  return request('/api/auth/send-otp', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

/** Step 2 → 3: verify OTP, returns { token } (15-min registration JWT) */
export function verifyOtp(email, otp) {
  return request('/api/auth/verify-otp', {
    method: 'POST',
    body: JSON.stringify({ email, otp }),
  });
}

/** Step 3 → 4: submit profile, requires registration JWT */
export function registerOfficer(profileData, token) {
  return request('/api/auth/register-officer', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(profileData),
  });
}

/** Poll officer status (after registration) */
export function getMe(token) {
  return request('/api/auth/me', {
    headers: { Authorization: `Bearer ${token}` },
  });
}

/** Demo-only: instantly approve the pending officer and get dashboard token */
export function demoApprove(token) {
  return request('/api/auth/demo-approve', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
}

/** Evidence-grounded RAG research query. This is intentionally a separate service
 * from the OTP/auth backend so Gemini and Supabase service secrets stay isolated. */
export async function queryResearchAssistant(question, userRole = 'researcher') {
  const res = await fetch(`${AI_BASE}/ai/query`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, userRole }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.detail || `AI research request failed (${res.status})`);
  return data;
}
