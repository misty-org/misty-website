import { cloudflareEnv } from "./cloudflare";
import { googleEnv } from "./google";
import { mistyEnv } from "./misty";
import type { IntegrationDoc } from "./types";

/** The three files under `~/.misty/.env/server/`, in the order the docs list them. */
export const integrationDocs: IntegrationDoc[] = [
  mistyEnv,
  cloudflareEnv,
  googleEnv,
];

export type { EnvVariable, IntegrationDoc } from "./types";
