import { sessionFetch } from "../../lib/sessionFetch";
import { apiBase } from "../../lib/apiBase";
import { fetchAccountProof } from "../../lib/accountProof";
import { ACCOUNT_BOOSTS_URL, ACCOUNT_SUBSCRIPTION_URL } from "../../lib/site";

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

/** A Space given some of Misty+'s included Boosts. */
export interface AssignedBoosts {
  space_id: string;
  boosts: number;
}

/** Boosts bought for one space: a subscription whose quantity is how many. */
export interface BoughtBoosts {
  space_id: string;
  quantity: number;
  /** How often it's billed. Older answers have none, and were monthly. */
  interval?: "month" | "year";
  status: string;
  current_period_end?: string;
  cancel_at_period_end: boolean;
}

export interface BoostsState {
  /** Boosts Misty+ includes; 0 without it. */
  included: number;
  assigned: AssignedBoosts[];
  /** When included Boosts may next be taken from a space, if they were moved this week. */
  next_move_at?: string;
  bought: BoughtBoosts[];
}

export interface SubscriptionState {
  /** Whether the account has Misty+. */
  subscribed: boolean;
  plan?: "free" | "plus";
  interval?: "month" | "year";
  status?: string;
  current_period_end?: string;
  cancel_at_period_end: boolean;
  boosts?: BoostsState;
}

/** Why billing refused a change, in the codes its routes answer. */
export type BillingRefusalCode =
  | "payment_needed"
  | "payment_past_due"
  | "not_subscribed"
  | "plus_required"
  | "too_many_boosts"
  | "move_wait"
  | "not_a_member"
  | "other";

export class PlanChangeRefused extends Error {
  constructor(readonly code: BillingRefusalCode) {
    super(code);
  }
}

const knownRefusals = new Set<string>([
  "payment_needed",
  "payment_past_due",
  "not_subscribed",
  "plus_required",
  "too_many_boosts",
  "move_wait",
  "not_a_member",
]);

/** A form-encoded post needs no preflight, and billing answers this site's origin. */
async function postBilling(
  url: string,
  fields: Record<string, string> = {},
  given?: string,
): Promise<SubscriptionState> {
  const proof = given ?? (await fetchAccountProof());
  const res = await fetch(url, {
    method: "POST",
    body: new URLSearchParams({ ...fields, proof }),
  });
  if (res.ok) return res.json();
  const code = await res
    .json()
    .then((body: { code?: string }) => body.code ?? "other")
    .catch(() => "other");
  throw new PlanChangeRefused(knownRefusals.has(code) ? (code as BillingRefusalCode) : "other");
}

export function fetchSubscription(): Promise<SubscriptionState> {
  return postBilling(ACCOUNT_SUBSCRIPTION_URL);
}

/** The subscription behind a suspended sign-in, which has a proof but no session. */
export function fetchSubscriptionWithProof(proof: string): Promise<SubscriptionState> {
  return postBilling(ACCOUNT_SUBSCRIPTION_URL, {}, proof);
}

/** Cancelling ends Misty+ with the period already paid for; resuming undoes that. */
export function changeSubscription(change: "cancel" | "resume"): Promise<SubscriptionState> {
  return postBilling(`${ACCOUNT_SUBSCRIPTION_URL}/${change}`);
}

/** Moves Misty+ to monthly or yearly now; Stripe prorates the rest of the period. */
export function changePlan(plan: "plus" | "plus_yearly"): Promise<SubscriptionState> {
  return postBilling(`${ACCOUNT_SUBSCRIPTION_URL}/plan`, { plan });
}

/** Gives a space that many of Misty+'s included Boosts; 0 takes them back. */
export function assignBoosts(spaceId: string, boosts: number): Promise<SubscriptionState> {
  return postBilling(`${ACCOUNT_BOOSTS_URL}/assign`, { space_id: spaceId, boosts: String(boosts) });
}

/** Changes how many Boosts are bought for a space now; 0 ends them with the month. */
export function setBoughtBoosts(spaceId: string, quantity: number): Promise<SubscriptionState> {
  return postBilling(`${ACCOUNT_BOOSTS_URL}/quantity`, { space_id: spaceId, quantity: String(quantity) });
}

/** A Space the signed-in person is in. */
export interface SpaceSummary {
  id: string;
  name: string;
  is_default: boolean;
}

export async function fetchSpaces(): Promise<SpaceSummary[]> {
  const res = await apiFetch("/spaces");
  const body = (await res.json()) as { spaces?: SpaceSummary[] } | SpaceSummary[];
  return Array.isArray(body) ? body : (body.spaces ?? []);
}

/** A Space's level on Misty Cloud: its Boosts, the next level's, and who boosts it. */
export interface SpaceBoostsState {
  space_id: string;
  enabled: boolean;
  level?: {
    level: number;
    boosts: number;
    next_level_boosts: number;
    thresholds: number[];
  };
  boosters: { user_id: string; username: string; boosts: number }[];
}

export async function fetchSpaceBoosts(spaceId: string): Promise<SpaceBoostsState> {
  const res = await apiFetch(`/spaces/${encodeURIComponent(spaceId)}/boosts`);
  return res.json();
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
  /** Present on a 409: spaces the account owns must be handed over first. */
  spaces?: { id: string; name: string }[];
}

export class AccountDeletionBlockedError extends Error {
  constructor(readonly spaces: { id: string; name: string }[]) {
    super(
      "Hand over or delete the spaces you own before deleting the account.",
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
