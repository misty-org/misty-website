import {
  BulletList,
  CodeBlock,
  DocSection,
  Note,
  P,
  Paragraphs,
} from "../components/Prose";
import { DocPage } from "../components/DocPage";

/** Keeping a server current, backing it up, and what the AGPL asks of a changed one. */
export default function Maintenance() {
  return (
    <DocPage title="Updates and backups">
      <DocSection id="updating" title="Updating">
        <Paragraphs
          items={[
            "Pull the new version and start the stack again. The images rebuild from your checkout, migrations run on every start, and the setup container finds everything it made before.",
          ]}
        />
        <CodeBlock
          label="Update"
          code={`cd misty
git pull
cd server
docker compose up -d --build`}
        />
        <P text="Update the desktop app on each computer too. A much older app may not be able to talk to a newer server." />
      </DocSection>

      <DocSection id="backups" title="Backups">
        <Paragraphs
          items={[
            "The `backups` service dumps the database every night at 03:00 UTC, encrypts the dump to the server's backup key with [age](https://age-encryption.org), and uploads it to the `misty-<host>-backups` bucket in R2. That bucket has a 30-day lock, so no credential on the server can delete or overwrite a backup in that time, and backups expire a day after their lock ends.",
            "Library files live in the Library bucket on your Cloudflare account. Synced browser data is encrypted on each device, so a backup only ever holds it encrypted.",
          ]}
        />
        <CodeBlock
          label="Back up now, list backups, copy the backup key"
          code={`docker compose exec backups misty-setup backup --now
docker compose exec backups misty-setup backups
docker compose run --rm --no-deps backups backup-key`}
        />
        <P text="Keep a copy of the backup key off the server, together with the copy of the secrets volume ([Secrets](/docs/self-hosting#secrets)). Without the key, no backup can be read." />
      </DocSection>

      <DocSection id="restore" title="Restoring">
        <P text="Restore onto a running stack, from the newest backup or a name from the list:" />
        <CodeBlock
          label="Restore"
          code={`docker compose stop api
docker compose exec backups misty-setup restore latest
docker compose up -d`}
        />
        <Note>
          Practise a restore on a spare server. A backup that has never been
          restored isn't a backup yet.
        </Note>
      </DocSection>

      <DocSection id="removing" title="Stopping and removing">
        <BulletList
          items={[
            "`docker compose down` stops the server and keeps all its data and secrets.",
            "`docker compose down --volumes` deletes the volumes, and with them the database and the secrets. It's the only command that destroys data.",
            "The tunnel, buckets and Workers stay in your Cloudflare account until you delete them there. Deleting the R2 buckets removes the files and backups.",
          ]}
        />
      </DocSection>

      <DocSection id="changing" title="Changing the server">
        <Paragraphs
          items={[
            "Misty is licensed under the [GNU AGPL-3.0-or-later](/license), and the AGPL covers servers. If you change Misty's server or its Workers and let other people use your server, you must offer those people the source code of your changed version under the same license, for example with a link on your sign-in page or in your server's description.",
            "Running Misty unchanged, or changing it only for yourself, needs nothing extra.",
            "A changed version you share or let others use must have its own name and logo, and it may say it's based on Misty. Misty's `NOTICE` adds one term under the AGPL's section 7(b): every copy, changed or not, keeps the author attribution in its About screen ([License](/license)).",
            "Every service on these pages is a required part of the server. Removing one, such as running without Cloudflare, means changing the code, and that version is yours to maintain.",
          ]}
        />
      </DocSection>
    </DocPage>
  );
}
