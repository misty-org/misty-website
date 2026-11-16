import {
  BulletList,
  CodeBlock,
  DocSection,
  Note,
  P,
} from "../components/Prose";
import { DocPage } from "../components/DocPage";

/** Keeping a server current, backing it up, and what the AGPL asks of a changed one. */
export default function Maintenance() {
  return (
    <DocPage title="Updates and backups">
      <P text="This page covers keeping your server up to date, backing it up and restoring it." />

      <DocSection id="updating" title="Update your server">
        <P text="Pull the new version and start the stack again. Database migrations run automatically." />
        <CodeBlock
          label="Update"
          code={`cd misty-server
git pull
docker compose up -d --build`}
        />
        <P text="Update the Misty app on each computer too. A much older app may not work with a newer server." />
      </DocSection>

      <DocSection id="backups" title="Back up your server">
        <P text="The server backs up its database every night at 03:00 UTC. You don't need to set anything up." />
        <BulletList
          items={[
            "Each backup is encrypted with the server's backup key, using [age](https://age-encryption.org).",
            "Backups go to the `misty-<host>-backups` bucket in R2. Nothing on the server can delete them for 30 days.",
            "Files in spaces live in a separate R2 bucket. They aren't part of the database backup.",
          ]}
        />
        <CodeBlock
          label="Back up now, list backups, copy the backup key"
          code={`docker compose exec backups misty-setup backup --now
docker compose exec backups misty-setup backups
docker compose run --rm --no-deps backups backup-key`}
        />
        <Note>
          Keep a copy of the backup key somewhere other than the server, with your copy of the
          secrets. Without the key, no backup can be read.
        </Note>
      </DocSection>

      <DocSection id="restore" title="Restore a backup">
        <P text="Restore the newest backup, or use a name from the list instead of `latest`:" />
        <CodeBlock
          label="Restore"
          code={`docker compose stop api
docker compose exec backups misty-setup restore latest
docker compose up -d`}
        />
        <P text="Practise a restore on a spare server, so you know it works before you need it." />
      </DocSection>

      <DocSection id="removing" title="Stop or remove your server">
        <BulletList
          items={[
            "`docker compose down` stops the server. All data and secrets are kept.",
            "`docker compose down --volumes` deletes the database and the secrets. This can't be undone.",
            "The tunnel, R2 buckets and Worker stay in your Cloudflare account until you delete them there.",
          ]}
        />
      </DocSection>

      <DocSection id="changing" title="Change the server's code">
        <P text="Misty is licensed under the [GNU AGPL-3.0-or-later](/license). Running Misty unchanged, or changing it only for yourself, needs nothing extra." />
        <P text="If you change the server or its Worker and let other people use it:" />
        <BulletList
          items={[
            "Offer those people the source code of your version, under the same license. A link on your sign-in page works.",
            "Give your version its own name and logo. You can say it's based on Misty.",
            "Keep the author attribution in the About screen. See [License](/license).",
          ]}
        />
        <P text="Every service on these pages is required. Removing one, such as Cloudflare, means changing the code, and that version is yours to maintain." />
      </DocSection>
    </DocPage>
  );
}
