import { sessionFetch } from "../../lib/sessionFetch";
import { apiBase } from "../../lib/apiBase";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

/** A refused request, with the server's code and, for a suspended sign-in, a proof of the account. */
export class AuthRequestError extends Error {
  readonly code?: string;
  readonly proof?: string;

  constructor(message: string, code?: string, proof?: string) {
    super(message);
    this.code = code;
    this.proof = proof;
  }
}

interface LoginResponse {
  user_id: string;
  username: string;
  email: string;
}

async function request<T>(path: string, body: unknown): Promise<T> {
  const response = await sessionFetch(`${apiBase}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    credentials: "include",
  });

  const contentType = response.headers.get("Content-Type") ?? "";
  const isJSON = contentType.includes("application/json");
  const payload = isJSON ? await response.json() : await response.text();

  if (!response.ok) {
    const message =
      typeof payload === "string"
        ? payload.trim()
        : typeof payload?.message === "string"
          ? payload.message
          : "Something went wrong";
    throw new AuthRequestError(
      message || "Something went wrong",
      typeof payload === "string" ? undefined : payload?.code,
      typeof payload === "string" ? undefined : payload?.proof,
    );
  }

  return payload as T;
}

export async function signInRequest(
  email: string,
  password: string,
): Promise<AuthUser> {
  const data = await request<LoginResponse>("/login", { email, password });
  return {
    id: data.user_id,
    name: data.username,
    email: data.email,
  };
}

// Kept for this tab only: the token and the code from Google's return together make the session.
const googleFlowKey = "misty.google-sign-in";

export async function beginGoogleSignIn(returnTo: string | null): Promise<void> {
  const flow = await request<{ url: string; flow_token: string }>("/auth/google", {
    website: true,
  });
  sessionStorage.setItem(
    googleFlowKey,
    JSON.stringify({ token: flow.flow_token, returnTo }),
  );
  window.location.assign(flow.url);
}

/** Finishes the sign-in this tab began, and says where the person was headed. */
export async function completeGoogleSignIn(code: string): Promise<string | null> {
  const saved = sessionStorage.getItem(googleFlowKey);
  sessionStorage.removeItem(googleFlowKey);
  const flow = saved ? (JSON.parse(saved) as { token: string; returnTo: string | null }) : null;
  if (!flow) throw new Error("This Google sign-in has expired. Try again.");
  await request("/auth/google/complete", { flow_token: flow.token, completion_code: code });
  return flow.returnTo;
}

const googleSignInErrors: Record<string, string> = {
  password_account: "This email already exists as a Misty account. Please sign in with your email and password instead.",
  provider_conflict: "This email already exists as a Misty account under a different Google account. Please sign in with that Google account instead.",
  registration_closed: "This server isn't taking new accounts.",
  email_not_allowed: "This email isn't on this server's list. Ask whoever runs it to add you.",
  access_denied: "Google sign-in was cancelled.",
};

/** What the server's code in the fragment means: never its own text, which anyone could link. */
export function googleSignInErrorMessage(code: string): string {
  return googleSignInErrors[code] ?? "Could not sign in with Google.";
}

/** Says whether the account is waiting for its email to be confirmed, with no session yet. */
export async function registerRequest(
  username: string,
  email: string,
  password: string,
): Promise<{ confirmEmail: boolean }> {
  const answer = await request<{ status?: string }>("/register", {
    username,
    email,
    password,
  });
  return { confirmEmail: answer.status === "confirm_email" };
}

/** Makes the account a confirmation link stands for, and signs in to it. */
export async function confirmEmailSignIn(token: string): Promise<void> {
  await request("/auth/confirm-email/sign-in", { token });
}

/** Signs in to the account a hand-off code from the app stands for. */
export async function redeemWebHandoff(code: string): Promise<void> {
  await request("/auth/web-handoff", { code });
}


