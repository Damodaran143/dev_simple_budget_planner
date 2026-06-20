const PREFIX = 'sbp.'

export function loadValue(key, fallback) {
  try {
    const raw = window.localStorage.getItem(PREFIX + key)
    if (!raw) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

export function saveValue(key, value) {
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value))
  } catch {
    // localStorage unavailable (e.g. private browsing) — fail silently,
    // the app still works for the current session.
  }
}

export function clearAll() {
  try {
    Object.keys(window.localStorage)
      .filter((k) => k.startsWith(PREFIX))
      .forEach((k) => window.localStorage.removeItem(k))
  } catch {
    // ignore
  }
}
