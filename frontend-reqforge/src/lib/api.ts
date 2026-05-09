const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3008/api';
let authToken: string | null = null;

export function setToken(token: string | null) { authToken = token; if (token) localStorage.setItem('reqforge_token', token); else localStorage.removeItem('reqforge_token'); }
function getToken(): string | null { if (!authToken) authToken = localStorage.getItem('reqforge_token'); return authToken; }

async function fetchAPI(path: string, options?: RequestInit) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const token = getToken(); if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, { headers, ...options });
  if (res.status === 401) { setToken(null); throw new Error('Unauthorized'); }
  if (!res.ok) throw new Error(`API ${res.status}`);
  return res.json();
}

export async function login(identifier: string, password: string) { const d = await fetchAPI('/auth/login', { method: 'POST', body: JSON.stringify({"login_identifier":identifier,"password":password}) }); setToken(d.access_token); return d; }
export async function reqforgeStatus() { return fetchAPI('/v1/reqforge/status'); }
export async function listProjects() { return fetchAPI('/v1/reqforge/projects'); }
export async function createProject(name: string, domain?: string) { return fetchAPI('/v1/reqforge/projects', { method: 'POST', body: JSON.stringify({ name, business_domain: domain }) }); }
export async function listDocuments(projectId?: string) { return fetchAPI(`/v1/reqforge/documents${projectId ? '?project_id=' + projectId : ''}`); }
export async function listRequirements(projectId?: string) { return fetchAPI(`/v1/reqforge/requirements${projectId ? '?project_id=' + projectId : ''}`); }
export async function createRequirement(data: Record<string, unknown>) { return fetchAPI('/v1/reqforge/requirements', { method: 'POST', body: JSON.stringify(data) }); }
export async function listOntologyTypes(scope?: string) { return fetchAPI(`/v1/reqforge/ontology/types${scope ? '?scope=' + scope : ''}`); }
export async function createOntologyType(data: Record<string, unknown>) { return fetchAPI('/v1/reqforge/ontology/types', { method: 'POST', body: JSON.stringify(data) }); }
export async function listArtifacts(projectId?: string) { return fetchAPI(`/v1/reqforge/artifacts${projectId ? '?project_id=' + projectId : ''}`); }
