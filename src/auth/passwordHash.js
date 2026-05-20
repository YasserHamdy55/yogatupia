// Frontend-only password hashing helper.
// NOTE: SHA-256 + per-user salt is NOT a substitute for server-side bcrypt/argon2.
// This is mock-grade hashing suitable for a localStorage-only prototype.
// Replace with a real backend before production.

const enc = new TextEncoder();

const toHex = (buf) =>
  Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

export const generateSalt = () => {
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    const arr = new Uint8Array(16);
    crypto.getRandomValues(arr);
    return toHex(arr.buffer);
  }
  // Fallback (should not happen in modern browsers)
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
};

export const hashPassword = async (password, salt) => {
  if (
    typeof crypto === "undefined" ||
    !crypto.subtle ||
    !crypto.subtle.digest
  ) {
    // Insecure fallback — only for environments without SubtleCrypto
    return `plain:${salt}:${password}`;
  }
  const data = enc.encode(`${salt}::${password}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return toHex(digest);
};

export const verifyPassword = async (password, salt, expectedHash) => {
  if (!password || !salt || !expectedHash) return false;
  const computed = await hashPassword(password, salt);
  return computed === expectedHash;
};
