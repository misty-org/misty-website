import { sessionFetch } from "../../lib/sessionFetch";
import { apiBase } from "../../lib/apiBase";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

interface LoginResponse {
  user_id: string;
  name: string;
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
    throw new Error(message || "Something went wrong");
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
    name: data.name,
    email: data.email,
  };
}

export function registerRequest(name: string, email: string, password: string) {
  return request("/register", { name, email, password });
}


