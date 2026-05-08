const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3008/api';

let authToken: string | null = null;

function setToken(token: string | null) {
  authToken = token;
  if (token) localStorage.setItem('reqforge_token', token);
  else localStorage.removeItem('reqforge_token');
}

async function fetchAPI(path: string, options?: RequestInit) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (authToken) headers['Authorization'] = `Bearer ${authToken}`;
  const res = await fetch(`${API_BASE}${path}`, { headers, ...options });
  if (res.status === 401) { setToken(null); throw new Error('Unauthorized'); }
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

// ─── Clawith Auth ───
export async function login(email: string, password: string) {
  const data = await fetchAPI('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
  setToken(data.access_token);
  return data;
}

export async function register(email: string, password: string, name: string) {
  const data = await fetchAPI('/auth/register', { method: 'POST', body: JSON.stringify({ email, password, name }) });
  setToken(data.access_token);
  return data;
}

// ─── Clawith Agent ───
export async function listAgents() {
  return fetchAPI('/agents');
}

export async function chatWithAgent(agentId: string, message: string) {
  return fetchAPI(`/agents/${agentId}/chat`, { method: 'POST', body: JSON.stringify({ message }) });
}

// ─── ReqForge API (to be built) ───
export async function reqforgeStatus() {
  return fetchAPI('/v1/reqforge/status');
}

export { setToken, API_BASE };
