import { apiBase } from "@/lib/apiBase";
import { sessionFetch } from "@/lib/sessionFetch";

/** Billing can't see this site's session, so the page carries the server's proof to it. */
export async function fetchAccountProof(): Promise<string> {
  const response = await sessionFetch(`${apiBase}/me/account-proof`, {
    method: "POST",
    credentials: "include",
  });
  if (!response.ok) throw new Error("proof refused");
  return ((await response.json()) as { proof: string }).proof;
}

/** Leaves for a page billing answers with a redirect, such as Stripe Checkout. */
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
