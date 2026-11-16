import {
  BulletList,
  CodeBlock,
  DocSection,
  DocTable,
  Note,
  P,
  Steps,
} from "../components/Prose";
import { DocPage } from "../components/DocPage";
import { integrationDocs } from "../integrations";

const ENV_TREE = `~/.misty/.env/server/
${integrationDocs
  .map(
    (doc, index) =>
      `${index === integrationDocs.length - 1 ? "└──" : "├──"} ${doc.file}`,
  )
  .join("\n")}`;

const FILE_ROWS = integrationDocs.map((doc) => [
  doc.file,
  doc.summary,
  `[Set up ${doc.file}](/docs/self-hosting/${doc.slug})`,
]);

const SERVICES = [
  [
    "`setup`",
    "Once per start",
    "Generates secrets, checks them against your data, provisions Cloudflare.",
  ],
  ["`postgres`", "Always", "The database (PostgreSQL with pgvector)."],
  ["`migrate`", "Once per start", "Applies database migrations."],
  [
    "`api`",
    "Always",
    "Accounts, spaces, chat, docs, drawings, tasks, the planner and files.",
  ],
  [
    "`cloudflared`",
    "Always",
    "Publishes the API at `https://MISTY_HOSTNAME` through the Tunnel.",
  ],
  [
    "`backups`",
    "Always",
    "Encrypted database backups to R2 every night at 03:00 UTC.",
  ],
  [
    "`alerts`",
    "Always",
    "Records an alert when the API fails its health check, fails 5% of requests, runs low on disk or misses a backup. The console and the owner's app show it. Nothing is emailed.",
  ],
  ["`console`", "Always, on `127.0.0.1:7070` only", "The operator console."],
];

const ROTATIONS = [
  [
    "`MISTY_AUTH_SIGNING_KEY`, `MISTY_OPERATOR_TOKEN`, `JOURNAL_COLLAB_CONTROL_SECRET`, `JOURNAL_COLLAB_PROJECTION_SECRET`",
    "The old value stays valid in its `*_PREVIOUS` slot until you retire it.",
  ],
  [
    "`JOURNAL_COLLAB_TICKET_PRIVATE_KEY`",
    "The old public key stays valid until you retire it.",
  ],
  [
    "`DB_PASSWORD`, `MISTY_METRICS_TOKEN`",
    "Nothing: the next start applies the new value everywhere.",
  ],
];

/** Running your own server: one Compose file, three env files and the setup container. */
export default function SelfHosting() {
  return (
    <DocPage title="Set up a server">
      <P text="This guide sets up your own Misty server. A server is one Compose file and three env files. A setup container does the rest each time it starts." />

      <DocSection id="what-you-need" title="What you need">
        <BulletList
          items={[
            "An always-on Linux or macOS computer, such as a VPS, with Docker Engine and Compose v2. Two CPU cores and 2 GB of memory are enough for a small team. Agents run on each person's computer, not the server.",
            "Git, to get the code.",
            "A domain on Cloudflare.",
            "A Google Cloud account.",
          ]}
        />
      </DocSection>

      <DocSection id="https" title="HTTPS only">
        <P text="The Misty app only connects to servers on an https domain. Plain http, IP addresses, localhost and private addresses won't work." />
      </DocSection>

      <DocSection id="files" title="The files">
        <P text="All your settings live in three files in `~/.misty/.env/server/`, one per service. Each file is plain `NAME=value` lines." />
        <CodeBlock code={ENV_TREE} label="The server folder" />
        <DocTable
          columns={["File", "What it's for", "Page"]}
          rows={FILE_ROWS}
          monoFirstColumn
        />
        <Note>
          The repository has no example env files. Write each file yourself, using the pages
          above.
        </Note>
      </DocSection>

      <DocSection id="email" title="Email (optional)">
        <P text="Without email, Misty gives you links to send to people yourself. With email, the server sends sign-in links, space invitations and email confirmations for you." />
        <Steps
          items={[
            "In Mailjet, verify the address you'll send from, with its SPF and DKIM records.",
            "Create `~/.misty/.env/server/mailjet.env` with `MAILJET_API_KEY`, `MAILJET_SECRET_KEY` and `MAILJET_FROM_EMAIL`. You can also set `MAILJET_FROM_NAME`.",
            "Restart the API with `docker compose up -d api`.",
          ]}
        />
      </DocSection>

      <DocSection id="install" title="Install">
        <Steps
          items={[
            "Clone misty-server and create `~/.misty/.env/server/`, readable only by you.",
            "Write the three env files. Each file's page lists its values.",
            "Start the stack. The first start builds the images and takes a few minutes.",
            "Check the setup container's log. When the tunnel connects, `https://MISTY_HOSTNAME/health` answers.",
            "Open the Misty app, select **Use my own server** and enter your address. Then create the first account, which owns the server. See [Connect to a server](/docs/connect#own-server).",
          ]}
        />
        <CodeBlock
          label="Install and start"
          code={`git clone https://github.com/misty-org/misty-server.git
cd misty-server
mkdir -p -m 700 ~/.misty/.env/server
# write the three files under ~/.misty/.env/server/
docker compose up -d --build
docker compose ps
docker compose logs setup`}
        />
      </DocSection>

      <DocSection id="services" title="What runs">
        <DocTable
          columns={["Service", "Runs", "What it does"]}
          rows={SERVICES}
        />
        <P text="A Cloudflare Worker also runs on your Cloudflare account. The setup container deploys it for you. See [cloudflare.env](/docs/self-hosting/cloudflare#what-setup-makes)." />
      </DocSection>

      <DocSection id="setup-container" title="The setup container">
        <P text="On the first start, the setup container:" />
        <BulletList
          items={[
            "Generates every secret into the stack's `secrets` volume.",
            "Creates the Cloudflare Tunnel, the DNS record and two R2 buckets.",
            "Deploys the Worker.",
          ]}
        />
        <P text="Later starts reuse the same resources and never replace a secret. Your data is only removed if you run `docker compose down --volumes` and delete the R2 buckets." />
      </DocSection>

      <DocSection id="secrets" title="Secrets">
        <P text="The `secrets` volume holds the only copy of your server's secrets. If you lose it but keep the database, setup stops with `secrets lost`. New keys would sign everyone out and make encrypted data unreadable." />
        <P text="Keep an encrypted copy somewhere other than the server, such as a password manager:" />
        <CodeBlock
          label="Copy the secrets"
          code={`docker compose run --rm --no-deps --entrypoint tar setup -C /run/misty/secrets -czf - . > misty-secrets.tgz`}
        />
        <P text="To rotate a secret, rotate it, restart, and retire the old value once old sessions have expired:" />
        <CodeBlock
          label="Rotate a secret"
          code={`docker compose run --rm setup rotate MISTY_AUTH_SIGNING_KEY
docker compose up -d --force-recreate
docker compose run --rm setup retire MISTY_AUTH_SIGNING_KEY`}
        />
        <DocTable columns={["Rotates", "With"]} rows={ROTATIONS} />
        <P text="Secrets that protect stored data can't be rotated. These are the database superuser password, the space link key, the device pairing pepper, the collaboration room salt, the document key and the backup key." />
      </DocSection>

      <DocSection id="accounts" title="Accounts on your server">
        <BulletList
          items={[
            "The first account created on a new server owns it.",
            "After that, people can sign up only with an open space invitation, or when you create their account in the console.",
            "To allow only certain people, set `MISTY_ALLOWED_EMAILS` in misty.env to a comma-separated list. The owner can always sign in.",
            "People sign in with an email and password stored on your server, or with Google through your own `google.env`.",
          ]}
        />
        <P text="To let someone in, or back in after a forgotten password:" />
        <Steps
          items={[
            "Open the operator console and choose their account.",
            "Copy its sign-in link and send it to them. With [email](/docs/self-hosting#email) set up, the server sends it for you.",
          ]}
        />
        <P text="The console runs on the server at `127.0.0.1:7070`. Its sign-in link is in `docker compose logs console`. To open it from another computer, forward the port: `ssh -L 7070:127.0.0.1:7070 you@server`." />
      </DocSection>
    </DocPage>
  );
}
