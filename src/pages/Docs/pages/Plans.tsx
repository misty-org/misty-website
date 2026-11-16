import { boost, plans, storagePerBoost } from "@/pages/Pricing/plans";
import { DocPage } from "../components/DocPage";
import { BulletList, DocSection, Note, P, Steps } from "../components/Prose";

/** Misty Cloud's plans and Boosts, as tasks: upgrade, boost a space, change or cancel. */
export default function Plans() {
  return (
    <DocPage title="Plans and Boosts">
      <P text="Misty Cloud is free to use. Misty+ gives your account more storage. Boosts raise a space's level for everyone in it." />
      <Note>
        Plans and Boosts only apply on Misty Cloud. A server you run yourself has no plans or
        levels, and every space on it is unlimited.
      </Note>

      <DocSection id="plans" title="Compare plans">
        <BulletList
          items={[
            `**${plans.free.name}** has ${plans.free.storage} of storage. You can make and join as many spaces as you like.`,
            `**${plans.plus.name}** costs $${plans.plus.monthly} a month or $${plans.plus.yearly} a year. It has ${plans.plus.storage} of storage, files up to ${plans.plus.upload}, and ${plans.plus.boosts} Boosts to give.`,
            `A **Boost** costs $${boost.price} a month or $${boost.yearly} a year and raises one space's level.`,
            "Prices are in US dollars, plus tax where it applies. See [Pricing](/pricing) for the full comparison.",
          ]}
        />
      </DocSection>

      <DocSection id="upgrade" title="Get Misty+">
        <Steps
          items={[
            "Go to [Pricing](/pricing) and sign in.",
            "Choose **Monthly** or **Yearly**.",
            "Select **Get Misty+** and pay with Stripe.",
          ]}
        />
        <P text="In the app, you can also open **Plan and billing** from your account menu." />
      </DocSection>

      <DocSection id="boost" title="Boost a space">
        <P text="Each Boost counts toward the space's level. Boosts from everyone in the space add up." />
        <Steps
          items={[
            "In the app, open the space's **⋯** menu, choose **People** and select **Boost**. Or go to **Boosts** in your account settings on this site and select **Boost** next to the space.",
            "Set how many Boosts to give. With Misty+, use your included Boosts first.",
            "Select **Save**, or **Continue to payment** when you're buying Boosts for the first time.",
          ]}
        />
        <BulletList
          items={[
            "A Space reaches Level 1 at 2 Boosts, Level 2 at 7 and Level 3 at 14. See [Space levels](/docs/limits) for what each level allows.",
            `Each Boost past a level adds ${storagePerBoost} of shared storage.`,
            "You can move your included Misty+ Boosts to another space once a week.",
            "Only Boosts from current members count. If you leave a space, your Boosts stop counting there.",
          ]}
        />
      </DocSection>

      <DocSection id="change" title="Change or cancel">
        <Steps
          items={[
            "Open **Subscription** in your account settings on this site.",
            "Select **Switch to yearly** or **Switch to monthly** to change how you're billed. The change takes effect right away, and the difference is charged or credited.",
            "Select **Manage** to update your card or download invoices.",
            "Select **Cancel** to stop Misty+ at the end of the period you've paid for.",
          ]}
        />
        <P text="To change bought Boosts, open **Boosts**, select the space and change the number. Setting it to 0 ends those Boosts at the end of the month." />
      </DocSection>

      <DocSection id="ending" title="When a plan or Boost ends">
        <BulletList
          items={[
            `Your account moves to Free, with ${plans.free.storage} of storage.`,
            "A Space drops to the level its remaining Boosts reach.",
            "Nothing is deleted. If you're over a limit, you can still open, download and delete everything. You can't add more until you're under the limit.",
          ]}
        />
      </DocSection>
    </DocPage>
  );
}
