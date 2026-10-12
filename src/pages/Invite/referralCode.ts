import { apiBase } from "@/lib/apiBase";
import { sessionFetch } from "@/lib/sessionFetch";

const storageKey = "misty.referral";

/** Keeps the invite code from an /r/CODE link until the visitor has an account. */
export function rememberReferral(code: string): void {
  const clean = code.trim().toLowerCase();
  if (!/^[a-z0-9]{8}$/.test(clean)) return;
  try {
    localStorage.setItem(storageKey, clean);
  } catch {
    // Private windows may refuse storage; the link still works for this visit.
  }
}

function storedReferral(): string | null {
  try {
    return localStorage.getItem(storageKey);
  } catch {
    return null;
  }
}

function forgetReferral(): void {
  try {
    localStorage.removeItem(storageKey);
  } catch {
    // Nothing to clear.
  }
}

/**
 * Claims a remembered invite for the signed-in account. The server decides
 * whether it applies (new accounts only, once); either answer is final.
 */
export async function claimRememberedReferral(): Promise<void> {
  const code = storedReferral();
  if (!code) return;
  const res = await sessionFetch(`${apiBase}/me/referral/claim`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code }),
  });
  if (res.ok || res.status === 404 || res.status === 409) forgetReferral();
}
