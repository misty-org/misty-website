import { sessionFetch } from "../../lib/session_fetch";
import { apiBase } from "../../lib/api_base";
import { fetchAccountProof } from "../../lib/account_proof";
import { ACCOUNT_BOOSTS_URL, ACCOUNT_SUBSCRIPTION_URL } from "../../lib/site";

export interface MeResponse {
  id: string;
  username: string;
  email: string;
  provider: "misty" | "google";
  created_at: string;
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

export async function updateUsername(username: string): Promise<string> {
  const res = await apiFetch("/me/username", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username }),
  });
  return ((await res.json()) as { username: string }).username;
}

export async function fetchInviteCode(): Promise<string> {
  const res = await apiFetch("/me/invite-code");
  return ((await res.json()) as { code: string }).code;
}

export interface AssignedBoosts {
  space_id: string;
  boosts: number;
}

export interface BoughtBoosts {
  space_id: string;
  quantity: number;
  interval?: "month" | "year";
  status: string;
  current_period_end?: string;
  cancel_at_period_end: boolean;
}

export interface BoostsState {
  included: number;
  assigned: AssignedBoosts[];
  next_move_at?: string;
  bought: BoughtBoosts[];
}

export interface SubscriptionState {
  subscribed: boolean;
  plan?: "free" | "plus";
  interval?: "month" | "year";
  status?: string;
  current_period_end?: string;
  cancel_at_period_end: boolean;
  boosts?: BoostsState;
}

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

export function fetchSubscriptionWithProof(proof: string): Promise<SubscriptionState> {
  return postBilling(ACCOUNT_SUBSCRIPTION_URL, {}, proof);
}

export function changeSubscription(change: "cancel" | "resume"): Promise<SubscriptionState> {
  return postBilling(`${ACCOUNT_SUBSCRIPTION_URL}/${change}`);
}

export function changePlan(plan: "plus" | "plus_yearly"): Promise<SubscriptionState> {
  return postBilling(`${ACCOUNT_SUBSCRIPTION_URL}/plan`, { plan });
}

export function assignBoosts(spaceId: string, boosts: number): Promise<SubscriptionState> {
  return postBilling(`${ACCOUNT_BOOSTS_URL}/assign`, { space_id: spaceId, boosts: String(boosts) });
}

export function setBoughtBoosts(spaceId: string, quantity: number): Promise<SubscriptionState> {
  return postBilling(`${ACCOUNT_BOOSTS_URL}/quantity`, { space_id: spaceId, quantity: String(quantity) });
}

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
