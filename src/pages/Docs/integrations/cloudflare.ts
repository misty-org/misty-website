import type { IntegrationDoc } from "./types";

export const cloudflareEnv: IntegrationDoc = {
  slug: "cloudflare",
  file: "cloudflare.env",
  service: "Cloudflare",
  summary:
    "Publishes the server over HTTPS, stores files and backups in R2 and runs Misty's Worker.",
  purpose: [
    "Every Misty server runs on your own Cloudflare account. A Cloudflare Tunnel publishes the API at `https://MISTY_HOSTNAME` with no open ports. R2 holds Library files and the nightly backups. A Worker saves notes and drawings as people edit them together.",
    "You give the setup container one API token. It finds the zone that holds `MISTY_HOSTNAME` among the zones the token can see, and the account from the zone. On every start it creates whatever is missing and finds what it made before by name, so it never makes a second copy. You never run Wrangler or the `misty` CLI.",
  ],
  account: [
    "A Cloudflare account with your domain added as a zone, and a workers.dev subdomain turned on (Workers & Pages → Settings). Setup stops and says so if the subdomain is off. R2 must be turned on for the account, which asks for a payment method even within the free allowance.",
  ],
  youSet: [
    {
      name: "CLOUDFLARE_API_TOKEN",
      about:
        "An account API token with the permissions below. Only the setup container keeps it.",
      howTo: "My Profile → API Tokens, or Manage Account → API Tokens.",
    },
    {
      name: "CLOUDFLARE_ZONE_ID",
      about:
        "The zone `MISTY_HOSTNAME` belongs to, when you'd rather name it than let setup find it. Older servers set it; setup checks it holds the hostname.",
      howTo: "Your domain's Overview page, in the API section on the right.",
      optional: true,
    },
    {
      name: "CLOUDFLARE_ACCOUNT_ID",
      about:
        "The account the zone must belong to. Set it only when the token can see the same domain in more than one account.",
      howTo: "The same API section, below the zone ID.",
      optional: true,
    },
  ],
  sections: [
    {
      id: "token-permissions",
      title: "API token permissions",
      paragraphs: [
        "Create an account API token with exactly these permissions, limited to your account and to the one zone your server uses.",
      ],
      table: {
        columns: ["Scope", "Permission", "Why"],
        rows: [
          [
            "Account",
            "Cloudflare Tunnel: Edit",
            "Creates the tunnel and sets its route.",
          ],
          [
            "Account",
            "Workers Scripts: Edit",
            "Uploads the Worker and its secrets.",
          ],
          [
            "Account",
            "Workers R2 Storage: Edit",
            "Creates the two buckets and sets their CORS, lock and expiry rules.",
          ],
          [
            "Account",
            "Account API Tokens: Edit",
            "Creates the two bucket-scoped R2 tokens.",
          ],
          [
            "Zone (your zone)",
            "Zone: Read",
            "Finds the zone that holds your hostname, and its account.",
          ],
          [
            "Zone (your zone)",
            "DNS: Edit",
            "Points your hostname at the tunnel.",
          ],
        ],
      },
    },
    {
      id: "what-setup-makes",
      title: "What the setup container makes",
      paragraphs: [
        "Names come from `MISTY_HOSTNAME`, with dots as dashes; a hostname longer than 40 characters is shortened. A DNS record for your hostname that points anywhere else is yours, and setup stops without changing it. If Cloudflare can't be reached on a start whose settings already worked, setup logs a warning and the stack starts on what it recorded.",
      ],
      table: {
        columns: ["Part", "Name", "What it does"],
        rows: [
          [
            "Tunnel",
            "`misty-<host>`",
            "Publishes the API with no open ports; `cloudflared` in the stack connects it.",
          ],
          ["DNS record", "`MISTY_HOSTNAME`", "A proxied CNAME to the tunnel."],
          [
            "Library bucket",
            "`misty-<host>-library`",
            "Uploads, attachments, avatars, and images in notes and drawings.",
          ],
          [
            "Backup bucket",
            "`misty-<host>-backups`",
            "Encrypted nightly database dumps, under a 30-day lock.",
          ],
          [
            "Two R2 tokens",
            "`misty-<host> library`, `misty-<host> backups`",
            "One bucket each; the API holds only the Library one.",
          ],
          [
            "Collaboration Worker",
            "`misty-<host>-collab`",
            "Saves and co-edits notes and drawings.",
          ],
        ],
      },
    },
  ],
  steps: [
    "Sign in at [dash.cloudflare.com](https://dash.cloudflare.com), add your domain and change its nameservers to the ones Cloudflare shows. Wait until the domain says Active.",
    "Open Workers & Pages → Settings and turn on a workers.dev subdomain.",
    "Open R2 Object Storage and turn it on.",
    "Create an account API token with the permissions above, limited to your account and zone. Copy it; Cloudflare shows it once.",
    "Write the token into `~/.misty/.env/server/cloudflare.env`.",
  ],
  example: `CLOUDFLARE_API_TOKEN=<your API token>`,
};
