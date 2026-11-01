import { cloudflareEnv } from "./cloudflare";
import { composioEnv } from "./composio";
import { googleEnv } from "./google";
import { mistyEnv } from "./misty";
import { searchEnv } from "./search";
import type { IntegrationDoc } from "./types";

/** The five files under `server/.env/`, in the order the docs list them. */
export const integrationDocs: IntegrationDoc[] = [
  mistyEnv,
  cloudflareEnv,
  composioEnv,
  googleEnv,
  searchEnv,
];

export type { EnvVariable, IntegrationDoc } from "./types";
