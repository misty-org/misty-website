import { sessionFetch } from "../../lib/sessionFetch";
import { apiBase } from "../../lib/apiBase";

export interface MeResponse {
  id: string;
  name: string;
  email: string;
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

export async function updateProfile(name: string): Promise<void> {
  await apiFetch("/me/profile", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
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

export interface AccountExportManifest {
  account_data: Record<string, unknown>;
  documents: {
    kind: "note" | "drawing";
    id: string;
    space_id: string;
    title: string;
    acl_version: number;
    created_at: string;
    updated_at: string;
    // Signed and short-lived; stripped from the copy written into the archive.
    download_url: string;
    expires_at: string;
  }[];
  assets: {
    kind: "note" | "drawing" | "library" | "message_attachment";
    id: string;
    parent_id: string;
    filename: string;
    mime_type: string;
    byte_size: number;
    sha256: string;
    created_at: string;
    download: {
      url: string;
      expires_at: string;
      filename: string;
      mime_type: string;
      byte_size: number;
      sha256: string;
    };
  }[];
}

export async function requestExportManifest(
  password: string,
): Promise<AccountExportManifest> {
  const res = await apiFetch("/me/export", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
  return res.json();
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
