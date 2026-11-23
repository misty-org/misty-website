import { apiBase } from "@/lib/api_base";
import { sessionFetch } from "@/lib/session_fetch";

export async function fetchAccountProof(): Promise<string> {
  const response = await sessionFetch(`${apiBase}/me/account-proof`, {
    method: "POST",
    credentials: "include",
  });
  if (!response.ok) throw new Error("proof refused");
  return ((await response.json()) as { proof: string }).proof;
}

export function postProofForm(action: string, proof: string, fields: Record<string, string> = {}) {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = action;
  for (const [name, value] of Object.entries({ ...fields, proof })) {
    const field = document.createElement("input");
    field.type = "hidden";
    field.name = name;
    field.value = value;
    form.append(field);
  }
  document.body.append(form);
  form.submit();
}
