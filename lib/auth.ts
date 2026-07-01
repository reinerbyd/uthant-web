/**
 * Minimal admin auth. Edge-safe (uses Web Crypto + env only), so it works in
 * both middleware and route handlers. Set ADMIN_PASSWORD and ADMIN_SESSION_SECRET
 * in .env.local for production; defaults are provided for local use.
 */
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "uthant-admin";
const SECRET = process.env.ADMIN_SESSION_SECRET || "uthant-dev-secret-change-me";
export const COOKIE = "ut_admin";

/** Deterministic session token derived from password + secret. */
export async function makeToken(): Promise<string> {
  const data = new TextEncoder().encode(`${ADMIN_PASSWORD}:${SECRET}`);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function isValidToken(token?: string): Promise<boolean> {
  if (!token) return false;
  return token === (await makeToken());
}
