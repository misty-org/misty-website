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

const ENV_TREE = `server/
├── compose.yml
└── .env/
${integrationDocs
  .map(
    (doc, index) =>
      `    ${index === integrationDocs.length - 1 ? "└──" : "├──"} ${doc.file}`,
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
    "Accounts, encrypted sync, Spaces, files and the tools agents call.",
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
  ["`console`", "Always, on `127.0.0.1:7070` only", "The operator console."],
];

const ROTATIONS = [
  [
    "`MISTY_AUTH_SIGNING_KEY`, `MISTY_AGENT_RUNTIME_CONTROL_SECRET`, `MISTY_OPERATOR_TOKEN`, `JOURNAL_COLLAB_CONTROL_SECRET`, `JOURNAL_COLLAB_PROJECTION_SECRET`",
    "The old value stays valid in its `*_PREVIOUS` slot until you retire it.",
  ],
  [
    "`MISTY_DEVICE_TICKET_PRIVATE_KEY`, `JOURNAL_COLLAB_TICKET_PRIVATE_KEY`",
    "The old public key stays valid until you retire it.",
  ],
  [
    "`DB_PASSWORD`, `MISTY_METRICS_TOKEN`, `MISTY_WEB_FETCH_SECRET`",
    "Nothing: the next start applies the new value everywhere.",
  ],
];

/** Running your own server: one Compose file, four env files and the setup container. */
export default function SelfHosting() {
  return (
    <DocPage
      title="Run a server"
      description="A Misty server is one Compose file and four env files. A setup container does the rest on every start."
    >
      <DocSection id="what-you-need" title="What you need">
        <BulletList
          items={[
            "A Linux or macOS host with Docker Engine and Compose v2. Two CPU cores and 2 GB of memory are enough for a small server, since agents run on each person's desktop.",
            "Git, to get the code. Everything else builds inside the containers.",
            "A domain on Cloudflare, and accounts with Composio and Google Cloud. Each one is a required part of every server; turning one off means changing the code.",
          ]}
        />
      </DocSection>

      <DocSection id="files" title="The files">
        <P text="Everything you configure lives in four files directly under `server/.env/`, one per service. Each is plain `NAME=value` lines. There are no other settings to make, and no model keys: the server refuses to start if it finds one." />
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

      <DocSection id="install" title="Install">
        <Steps
          items={[
            "Clone Misty on the host and create `server/.env/`.",
            "Write the four files, following each file's page.",
            "Start the stack from the `server` folder. The first start builds the images, so it takes a few minutes.",
            "Watch the setup container's log. Once the tunnel connects, the API answers at `https://MISTY_HOSTNAME/health`, and on the host at `http://127.0.0.1:8081/health`.",
            "Open the Misty app, choose My own server and enter `https://MISTY_HOSTNAME`, then create the first account ([Connect the app](/docs/connect)).",
          ]}
        />
        <CodeBlock
          label="Install and start"
          code={`git clone https://github.com/misty-org/misty.git
cd misty/server
mkdir -m 700 .env
# write the four files under .env/
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
        <P text="The two Workers run on your Cloudflare account ([cloudflare.env](/docs/self-hosting/cloudflare#what-setup-makes)). The setup container deploys them whenever they change; you never run Wrangler or the `misty` CLI, which is only for working on Misty itself." />
      </DocSection>

      <DocSection id="setup-container" title="The setup container">
        <Paragraphs
          items={[
            "On the first start, the setup container generates every secret into the stack's `secrets` volume: database passwords, signing keys, device and collaboration keys, the operator token and the backup key. It creates the Cloudflare Tunnel, the DNS record, the two R2 buckets and their credentials, and deploys both Workers.",
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
            "On a fresh server, the first account registers itself from the app's sign-in screen and owns the server. After that, a person can sign up only while a Space invitation to their email is open, or when you make their account in the console, or the operator account API makes it, and hand them a sign-in link. There is no setting for this, and existing accounts always sign in.",
            "A server sends no email. To bring someone in, or to let someone who forgot their password back in, open the console, choose the account and copy its sign-in link, then send it however you like. The link goes to `https://mistysys.com/setup#server=MISTY_HOSTNAME&key=…`, a static page that reads both in the browser and opens Misty with them filled in ([Connect the app](/docs/connect#own-server)). The key never reaches mistysys.com, and the server itself serves only API routes.",
            "People sign in with Misty, an email and password kept on your server, or with Google through your own `google.env` client. There is no central Misty account.",
            "The operator console listens on `127.0.0.1:7070` on the server only, and its sign-in link is in `docker compose logs console`. From another computer, forward the port over SSH: `ssh -L 7070:127.0.0.1:7070 you@server`.",
          ]}
        />
      </DocSection>
    </DocPage>
  );
}
