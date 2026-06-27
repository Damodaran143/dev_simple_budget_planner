// Talks to the Django REST backend. Handles JWT access/refresh tokens and
// retries a request exactly once after a silent token refresh on a 401.

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

const TOKEN_KEY = 'sbp.tokens'

export function getTokens() {
  try {
    const raw = window.localStorage.getItem(TOKEN_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function setTokens(tokens) {
  try {
    if (tokens) {
      window.localStorage.setItem(TOKEN_KEY, JSON.stringify(tokens))
    } else {
      window.localStorage.removeItem(TOKEN_KEY)
    }
  } catch {
    // localStorage unavailable - tokens just won't persist across reloads
  }
}

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

// Pulls the first useful message out of a DRF error payload, whatever shape
// it happens to be ({detail}, {field: [...]}, [...] etc).
function extractErrorMessage(data, fallback) {
  if (!data) return fallback
  if (typeof data === 'string') return data
  if (data.detail) return data.detail
  for (const key of Object.keys(data)) {
    const value = data[key]
    if (Array.isArray(value) && value.length > 0) return value[0]
    if (typeof value === 'string') return value
  }
  return fallback
}

async function refreshAccessToken() {
  const tokens = getTokens()
  if (!tokens?.refresh) return null

  try {
    const res = await fetch(`${API_BASE_URL}/auth/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: tokens.refresh }),
    })
    if (!res.ok) {
      setTokens(null)
      return null
    }
    const data = await res.json()
    const next = { access: data.access, refresh: data.refresh || tokens.refresh }
    setTokens(next)
    return next.access
  } catch {
    return null
  }
}

// Core request helper. `auth: false` skips attaching a token (register/login).
async function request(path, { method = 'GET', body, auth = true, retry = true } = {}) {
  const headers = { 'Content-Type': 'application/json' }

  if (auth) {
    const tokens = getTokens()
    if (tokens?.access) headers.Authorization = `Bearer ${tokens.access}`
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (res.status === 401 && auth && retry) {
    const newAccess = await refreshAccessToken()
    if (newAccess) {
      return request(path, { method, body, auth, retry: false })
    }
  }

  if (res.status === 204) return null

  let data = null
  try {
    data = await res.json()
  } catch {
    data = null
  }

  if (!res.ok) {
    throw new ApiError(extractErrorMessage(data, 'Something went wrong.'), res.status, data)
  }

  return data
}

export const api = {
  get: (path) => request(path, { method: 'GET' }),
  post: (path, body, opts = {}) => request(path, { method: 'POST', body, ...opts }),
  patch: (path, body) => request(path, { method: 'PATCH', body }),
  delete: (path) => request(path, { method: 'DELETE' }),
}
