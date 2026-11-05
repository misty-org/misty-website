import { sessionFetch } from "../../lib/sessionFetch";
import { apiBase } from "../../lib/apiBase";
import { fetchAccountProof } from "../../lib/accountProof";
import { ACCOUNT_SUBSCRIPTION_URL } from "../../lib/site";

export interface MeResponse {
  id: string;
  username: string;
  email: string;
  /** How the account signs in; a Google account has no Misty password. */
  provider: "misty" | "google";
  created_at: string;
  /** Bumped by the server on every avatar upload; used to bust the image cache. */
  avatar_version?: number;
}

async function apiFetch(path: string, init?: RequestInit) {
  const res = await sessionFetch(`${apiBase}${path}`, {
    credentials: "include",
    ...init,
  });
  if (!res.ok) {
    const text = await res.text();
    throw Object.assign(new Error(text.trim() || "Request failed"), {
      status: res.status,
    });
  }
  return res;
}

export async function fetchMe(): Promise<MeResponse> {
  const res = await apiFetch("/me");
  return res.json();
}

/** Saves the username and answers it as the server stored it. */
export async function updateUsername(username: string): Promise<string> {
  const res = await apiFetch("/me/username", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username }),
  });
  return ((await res.json()) as { username: string }).username;
}

/** The code of the person's invite link, made the first time they ask. */
export async function fetchInviteCode(): Promise<string> {
  const res = await apiFetch("/me/invite-code");
  return ((await res.json()) as { code: string }).code;
}

export interface SubscriptionState {
  subscribed: boolean;
  status?: string;
  current_period_end?: string;
  cancel_at_period_end: boolean;
}

/** A form-encoded post needs no preflight, and billing answers this site's origin. */
async function postSubscription(path = "", given?: string): Promise<SubscriptionState> {
  const proof = given ?? (await fetchAccountProof());
  const res = await fetch(`${ACCOUNT_SUBSCRIPTION_URL}${path}`, {
    method: "POST",
    body: new URLSearchParams({ proof }),
  });
  if (!res.ok) throw new Error("Subscription request failed");
  return res.json();
}

export function fetchSubscription(): Promise<SubscriptionState> {
  return postSubscription();
}

/** The subscription behind a suspended sign-in, which has a proof but no session. */
export function fetchSubscriptionWithProof(proof: string): Promise<SubscriptionState> {
  return postSubscription("", proof);
}

/** Cancelling ends the plan with the month already paid for; resuming undoes that. */
export function changeSubscription(change: "cancel" | "resume"): Promise<SubscriptionState> {
  return postSubscription(`/${change}`);
}

export async function logoutRequest(): Promise<void> {
  await sessionFetch(`${apiBase}/logout`, {
    method: "POST",
    credentials: "include",
  });
}

export interface AccountSettingsResponse {
  email_updates_enabled: boolean;
  analytics_enabled: boolean;
  error_reporting_enabled: boolean;
}

export async function fetchAccountSettings(): Promise<AccountSettingsResponse> {
  const res = await apiFetch("/me/settings");
  return res.json();
}

/**
 * The server decodes this body into plain booleans with no pointers, so an
 * omitted key is written as `false`. Every call must therefore send all three,
 * never a partial patch.
 */
export async function updateAccountSettings(
  settings: AccountSettingsResponse,
): Promise<void> {
  await apiFetch("/me/settings", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email_updates_enabled: settings.email_updates_enabled,
      analytics_enabled: settings.analytics_enabled,
      error_reporting_enabled: settings.error_reporting_enabled,
    }),
  });
}

/** The avatar endpoint takes a raw PNG body — not multipart. */
export async function uploadAvatar(png: Blob): Promise<void> {
  await apiFetch("/me/avatar", {
    method: "PUT",
    headers: { "Content-Type": "image/png" },
    body: png,
  });
}

export function avatarUrl(version: number | undefined): string {
  return `${apiBase}/me/avatar?v=${version ?? 0}`;
}

export interface AccountDeletionResponse {
  status?: string;
  scheduled_purge_at?: string;
  status_token?: string;
  /** Present on a 409: Spaces the account owns must be handed over first. */
  spaces?: { id: string; name: string }[];
}

export class AccountDeletionBlockedError extends Error {
  constructor(readonly spaces: { id: string; name: string }[]) {
    super(
      "Hand over or delete the Spaces you own before deleting the account.",
    );
    this.name = "AccountDeletionBlockedError";
  }
}

export async function beginAccountDeletion(
  password: string,
  confirmation: string,
): Promise<AccountDeletionResponse> {
  // Not apiFetch: a 409 carries a JSON blocker list that must survive, and
  // apiFetch collapses every non-2xx into a text Error.
  const res = await sessionFetch(`${apiBase}/me/deletion`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password, confirmation }),
  });

  if (res.status === 409) {
    const blocked = (await res.json().catch(() => ({}))) as {
      spaces?: { id: string; name: string }[];
    };
    throw new AccountDeletionBlockedError(blocked.spaces ?? []);
  }
  if (!res.ok) {
    const text = await res.text();
    throw Object.assign(new Error(text.trim() || "Request failed"), {
      status: res.status,
    });
  }
  return res.json();
}
