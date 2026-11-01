import { cloudflareEnv } from "./cloudflare";
import { composioEnv } from "./composio";
import { googleEnv } from "./google";
import { mistyEnv } from "./misty";
import type { IntegrationDoc } from "./types";

/** The four files under `server/.env/`, in the order the docs list them. */
export const integrationDocs: IntegrationDoc[] = [
  mistyEnv,
  cloudflareEnv,
  composioEnv,
  googleEnv,
];

export type { EnvVariable, IntegrationDoc } from "./types";
