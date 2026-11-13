import {
  BulletList,
  CodeBlock,
  DocSection,
  DocTable,
  Note,
  P,
  Paragraphs,
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
    "Accounts, Spaces, chat, docs, drawings, tasks, the planner and files.",
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
    <DocPage title="Run a server">
      <P text="A Misty server is one Compose file and three env files. A setup container does the rest on every start." />

      <DocSection id="what-you-need" title="What you need">
        <BulletList
          items={[
            "A VPS or other always-on Linux or macOS computer with Docker Engine and Compose v2. Two CPU cores and 2 GB of memory are enough for a small server, since agents run on each person's desktop.",
            "Git, to get the code. Everything else builds inside the containers.",
            "A domain on Cloudflare and a Google Cloud account. Both are required parts of every server; turning one off means changing the code.",
            "The Misty app only connects to a server on an https domain, so plain http, IP addresses, localhost and domains that point to a private address won't work.",
          ]}
        />
      </DocSection>

      <DocSection id="files" title="The files">
        <P text="Everything you configure lives in three files directly under `~/.misty/.env/server/`, one per service. Each is plain `NAME=value` lines. There are no other settings to make, and no model keys: the server refuses to start if it finds one." />
        <CodeBlock code={ENV_TREE} label="The server folder" />
        <DocTable
          columns={["File", "What it's for", "Page"]}
          rows={FILE_ROWS}
          monoFirstColumn
        />
        <Note>
          No env file is ever committed to the repository, not even an example.
          The pages above list every value, so you write each file yourself.
        </Note>
      </DocSection>

      <DocSection id="email" title="Email (optional)">
        <P text="Email is the one optional part of a server. Without it, Misty gives you links to pass on. To have the server send sign-in links, Space invitations, closing notices and email confirmations, which new password accounts then need, create `~/.misty/.env/server/mailjet.env` with `MAILJET_API_KEY`, `MAILJET_SECRET_KEY` and `MAILJET_FROM_EMAIL`, an address you've verified in Mailjet with its SPF and DKIM records, and optionally `MAILJET_FROM_NAME`. Then restart the API with `docker compose up -d api`." />
      </DocSection>

      <DocSection id="install" title="Install">
        <Steps
          items={[
            "Clone misty-server on the host and create `~/.misty/.env/server/`, readable only by you.",
            "Write the three files, following each file's page.",
            "Start the stack from the `server` folder. The first start builds the images, so it takes a few minutes.",
            "Watch the setup container's log. Once the tunnel connects, the API answers at `https://MISTY_HOSTNAME/health`, and on the host at `http://127.0.0.1:8081/health`.",
            "Open the Misty app, choose Self-hosted and enter `https://MISTY_HOSTNAME`, then create the first account ([Connect the app](/docs/connect)).",
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
        <P text="The Worker runs on your Cloudflare account ([cloudflare.env](/docs/self-hosting/cloudflare#what-setup-makes)). The setup container deploys it whenever it changes; you never run Wrangler or the `misty` CLI, which is only for working on Misty itself." />
      </DocSection>

      <DocSection id="setup-container" title="The setup container">
        <Paragraphs
          items={[
            "On the first start, the setup container generates every secret into the stack's `secrets` volume: database passwords, signing keys, device and collaboration keys, the operator token and the backup key. It creates the Cloudflare Tunnel, the DNS record, the two R2 buckets and their credentials, and deploys the Worker.",
            "Every later start finds the same resources by name and never replaces a secret. Rotating a secret never touches data. Data is removed only with the whole stack: `docker compose down --volumes`, plus the R2 buckets.",
          ]}
        />
      </DocSection>

      <DocSection id="secrets" title="Secrets">
        <P text="The `secrets` volume is the only copy of the server's secrets, and they never appear in the env files. Losing them while keeping the database is the one state the stack refuses: setup stops with `secrets lost` instead of making new keys that would sign everyone out and leave encrypted data unreadable. Keep a copy off the server, stored encrypted, such as in a password manager or with `age`:" />
        <CodeBlock
          label="Copy the secrets"
          code={`docker compose run --rm --no-deps --entrypoint tar setup -C /run/misty/secrets -czf - . > misty-secrets.tgz`}
        />
        <P text="To rotate a secret, keep its previous value valid, restart, and retire the old value later, once old sessions have expired:" />
        <CodeBlock
          label="Rotate a secret"
          code={`docker compose run --rm setup rotate MISTY_AUTH_SIGNING_KEY
docker compose up -d --force-recreate
docker compose run --rm setup retire MISTY_AUTH_SIGNING_KEY`}
        />
        <DocTable columns={["Rotates", "With"]} rows={ROTATIONS} />
        <P text="Secrets that protect stored data never rotate: the database superuser password, the Space link key, the device pairing pepper, the collaboration room salt, the document key and the backup key." />
      </DocSection>

      <DocSection id="accounts" title="Accounts on your server">
        <Paragraphs
          items={[
            "On a fresh server, the first account registers itself from the app's sign-in screen and owns the server. After that, a person can sign up only while a Space invitation to their email is open, or when you make their account in the console or the operator account API. To limit the server to a list of people, set `MISTY_ALLOWED_EMAILS` in misty.env (comma-separated); then only those emails can sign up or sign in, and the owner can always sign in.",
            "To bring someone in, or to let someone who forgot their password back in, open the console, choose the account and copy its sign-in link, then send it to them. With email set up ([Email](/docs/self-hosting#email)), the server emails it for you.",
            "People sign in with Misty, an email and password kept on your server, or with Google through your own `google.env` client. There is no central Misty account.",
            "The operator console listens on `127.0.0.1:7070` on the server only, and its sign-in link is in `docker compose logs console`. From another computer, forward the port over SSH: `ssh -L 7070:127.0.0.1:7070 you@server`.",
          ]}
        />
      </DocSection>
    </DocPage>
  );
}
