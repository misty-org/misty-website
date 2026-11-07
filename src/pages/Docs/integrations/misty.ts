import type { IntegrationDoc } from "./types";

export const mistyEnv: IntegrationDoc = {
  slug: "misty",
  file: "misty.env",
  service: "The server",
  summary:
    "The server's own settings: its hostname, its name and the websites allowed to call it.",
  purpose: [
    "`misty.env` holds the few settings that belong to the server itself. The server's address comes from `MISTY_HOSTNAME`: the API answers at `https://MISTY_HOSTNAME/v1`, and the setup container points the Cloudflare Tunnel and DNS at that hostname.",
    "Secrets never go in this file. The setup container generates every one of them, such as database passwords and signing keys, into the stack's `secrets` volume on first boot ([Secrets](/docs/self-hosting#secrets)).",
  ],
  account: [
    "None. The hostname must be on a domain in your Cloudflare account ([cloudflare.env](/docs/self-hosting/cloudflare)).",
  ],
  youSet: [
    {
      name: "MISTY_HOSTNAME",
      about:
        "The server's public hostname, such as `misty.example.com`. The API is `https://MISTY_HOSTNAME/v1`, and sign-in links name it in their link to `mistysys.com/setup`.",
      howTo:
        "Pick a hostname on your Cloudflare domain. Write it without `https://` or a path.",
    },
    {
      name: "MISTY_INSTANCE_NAME",
      about: "The name devices show for this server. It defaults to `Misty`.",
      howTo: "Any short name, such as `Home`.",
      optional: true,
    },
    {
      name: "MISTY_ALLOWED_ORIGINS",
      about:
        "The `https://` origins of websites you run against this API, separated by commas.",
      howTo:
        "Only needed if you run a website against this server. The app is always allowed.",
      optional: true,
    },
  ],
  steps: [
    "Choose the hostname for your server on a domain in your Cloudflare account, such as `misty.example.com`.",
    "Write it into `~/.misty/.env/server/misty.env` as `MISTY_HOSTNAME`.",
    "Add a name for the server if you want one.",
  ],
  example: `MISTY_HOSTNAME=misty.example.com
MISTY_INSTANCE_NAME=Home`,
};
