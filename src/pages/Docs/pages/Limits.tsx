import { levelRows, plans, spaceLevels, storagePerBoost } from "@/pages/Pricing/plans";
import { DocPage } from "../components/DocPage";
import { BulletList, DocSection, DocTable, Note, P } from "../components/Prose";

/** What each space level allows on Misty Cloud, read from the same data as the pricing page. */
export default function Limits() {
  return (
    <DocPage title="Space levels">
      <P text="On Misty Cloud, each space has a level. Boosts from its members raise the level." />
      <Note>Levels only apply on Misty Cloud. On your own server, every space is unlimited.</Note>

      <DocSection id="levels" title="What each level allows">
        <DocTable
          columns={["", ...spaceLevels.map((level) => level.name)]}
          rows={[
            ["Boosts needed", ...spaceLevels.map((level) => String(level.boosts))],
            ...levelRows.map((row) => [row.label, ...spaceLevels.map((level) => level[row.key])]),
          ]}
        />
        <BulletList
          items={[
            `Each Boost past a level adds ${storagePerBoost} of shared storage.`,
            "Below Level 1, files count against the storage of whoever added them.",
            "From Level 1, the space has its own storage. Its files no longer count against anyone's account.",
          ]}
        />
      </DocSection>

      <DocSection id="accounts" title="Account limits">
        <BulletList
          items={[
            `**${plans.free.name}**: ${plans.free.storage} of storage.`,
            `**${plans.plus.name}**: ${plans.plus.storage} of storage, and files up to ${plans.plus.upload} in any space.`,
            "Every plan can make and join as many spaces as you like.",
          ]}
        />
      </DocSection>

      <DocSection id="over" title="Going over a limit">
        <P text="Nothing is deleted when a space or account is over a limit. Everything stays open, and you can download or delete it. You can't add more until you're under the limit again." />
      </DocSection>
    </DocPage>
  );
}
