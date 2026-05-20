// Tiny helper that mirrors the localStorage pattern used by ContentContext.
// Keeps a JSON value in localStorage under a key, with safe parse + default.
// Intentionally framework-agnostic so it can back any small store.

export const readPersisted = (key, fallback) => {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
};

export const writePersisted = (key, value) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore quota / serialization errors silently for now
  }
};

export const clearPersisted = (key) => {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(key);
};
