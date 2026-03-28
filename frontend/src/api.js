const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

async function request(path, { token, method = 'GET', body } = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!res.ok) {
    const payload = await res.json().catch(() => ({ detail: 'Unknown error' }))
    throw new Error(payload.detail || 'Request failed')
  }

  return res.json()
}

export const api = {
  login: (email, password) => request('/auth/login', { method: 'POST', body: { email, password } }),
  me: (token) => request('/users/me', { token }),
  users: (token) => request('/users', { token }),
  updateRole: (token, id, role) => request(`/users/${id}/role`, { token, method: 'PATCH', body: { role } }),
  activityLogs: (token) => request('/activity-logs?limit=100', { token }),
  settings: (token) => request('/settings/system', { token }),
  updateSettings: (token, payload) => request('/settings/system', { token, method: 'PUT', body: payload }),
  registerUser: (token, payload) =>
    request('/auth/register', {
      token,
      method: 'POST',
      body: payload,
    }),
}
