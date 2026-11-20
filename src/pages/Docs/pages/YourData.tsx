import { SUPPORT_EMAIL } from "@/lib/site";
import { DocPage } from "../components/DocPage";
import { BulletList, DocSection, P, Steps } from "../components/Prose";

/** What Misty keeps where, and how to export or delete it. The Privacy Policy is the full account. */
export default function YourData() {
  return (
    <DocPage title="Your data">
      <P text="This page explains what Misty stores and how to remove it. The [Privacy Policy](/privacy) has the full details." />

      <DocSection id="where" title="What's stored where">
        <BulletList
          items={[
            "**On your computer**: agent chats, prompts, and your engine sign-ins. Sign-ins are sealed with a key in your system keychain.",
            "**On the server**: your account, spaces, group chat, notes and files, and what the space's apps save there. Other Misty users can't read them unless they're in the space.",
            "Server data isn't end-to-end encrypted. On Misty Cloud, we can technically access it. On your own server, whoever runs it can.",
            "Your desktop sends prompts straight to the AI you chose. They don't pass through Misty.",
            "Misty has no ads, no trackers and no analytics.",
          ]}
        />
      </DocSection>

      <DocSection id="export" title="Get a copy of your data">
        <P text={`Email ${SUPPORT_EMAIL} from your account's email address. We'll send you a copy of your account data. Agent chats aren't included, because they never leave your computer.`} />
      </DocSection>

      <DocSection id="delete" title="Delete your account">
        <Steps
          items={[
            "Hand off or delete any spaces you own that have other members.",
            "Open **Account Settings** and go to **Profile**.",
            "Delete your account.",
          ]}
        />
        <BulletList
          items={[
            "You can restore your account for 30 days. After that, it's removed.",
            "Content you added to a space other people still use stays in that space.",
            "Agent chats stay on your computer. Delete them in the app.",
          ]}
        />
      </DocSection>
    </DocPage>
  );
}
