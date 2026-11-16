import LegalPage, {
  LegalEmail,
  LegalLink,
  LegalList,
  LegalSubheading,
  LegalTable,
  type LegalSectionDef,
} from "./LegalPage";
import { legalInfo } from "./legalInfo";

const { supportEmail, operatorDescription } = legalInfo;

const sections: LegalSectionDef[] = [
  {
    id: "what-we-dont-do",
    title: "What we don't do",
    inShort:
      "No ads, no selling data, no trackers, and no analytics.",
    body: (
      <LegalList
        items={[
          "We don't sell your personal information or share it for advertising.",
          "We don't show ads, and we don't use advertising, social-media, or cross-site tracking pixels on our website or in the app.",
          "Our website has no analytics or tracking scripts.",
          "The Misty app sends no usage analytics or crash reports. Your account settings have switches for them, which are off unless you turn them on, and nothing is collected either way.",
          "We don't train AI models on your content.",
          "Your agents' chats, prompts, and model calls never reach our servers. Section 2 explains what a space shows its other members about your agents, and what agents add to a space.",
        ]}
      />
    ),
  },
  {
    id: "collect",
    title: "Information we collect",
    inShort:
      "Your account details, what you put in your spaces, what a space shows of your agents, and basic technical data needed to run the service.",
    body: (
      <>
        <LegalSubheading>Information you give us</LegalSubheading>
        <LegalList
          items={[
            <>
              <strong className="font-medium text-foreground">Account details:</strong>{" "}
              your name, email address, password (stored only as a secure
              hash), and profile picture if you add one. If you sign in with
              Google, we receive your name, email address, and profile picture
              from Google.
            </>,
            <>
              <strong className="font-medium text-foreground">Your spaces:</strong>{" "}
              the notes, docs, drawings, files, messages, tasks, calendar
              events, and other material you or your agents add to a space.
              When an agent posts in a space's chat, the message is stored as
              yours. A Lab notebook stays on your computer unless you share it
              to a space, where it becomes one of that space's docs. While
              you're in a space, its members can see that you're there and when
              you're typing. We don't store that.
            </>,
            <>
              <strong className="font-medium text-foreground">Your agents in a space:</strong>{" "}
              when you add an agent to a space, the space keeps the agent's
              name under yours. While the agent works, your computer tells the
              space's other members what it's doing: its name, a fixed code
              for its state (working, needs you, or resting), a fixed code for
              the kind of work (such as browser, shell, or files), and the
              paths of up to five files it's changing in the space's linked
              folder. Misty's code sets the codes and file paths, never a
              model, and the server drops anything that isn't in that form. The server passes the
              file paths on without storing them. Each time an agent's state or
              kind of work changes, it adds a line with the agent's name and
              the two codes to the space's activity log. A file an agent saves
              to a space is stored like any other file, marked with the agent
              that saved it.
            </>,
            <>
              <strong className="font-medium text-foreground">Voice transcripts:</strong>{" "}
              when you start Listen, or transcribe a file in a space, your
              computer turns the audio into text with the transcription
              provider you chose, and the transcript is saved to your account.
              Only you can see it. If you make a note from it, the note goes in
              your own space. Dictation doesn't save anything to our servers.
            </>,
            <>
              <strong className="font-medium text-foreground">Agent chats:</strong>{" "}
              each chat, with its prompts, replies, and steps, is stored on the
              computer it ran on, along with anything your AI tool keeps there.
              It doesn't sync and we don't keep a copy, so a lost computer
              loses its chats. Our servers never receive an agent's prompts,
              model calls, or tool results, and see what it writes only when it
              adds something to a space.
            </>,
            <>
              <strong className="font-medium text-foreground">Billing details:</strong>{" "}
              if you subscribe to Misty+ or Boosts, Stripe collects your payment
              card and billing address, and uses the address to work out sales
              tax or VAT. We receive your email address and Stripe's records of
              your subscription, such as its status, billing date, and any
              refunds or disputes, never the full card number.
            </>,
            <>
              <strong className="font-medium text-foreground">Support messages:</strong>{" "}
              anything you send us by email.
            </>,
          ]}
        />
        <LegalSubheading>Information created when you use Misty</LegalSubheading>
        <LegalList
          items={[
            <>
              <strong className="font-medium text-foreground">Usage:</strong>{" "}
              the storage you use, and how many shared spaces you have and how
              many people are in them, which we need to apply your plan's
              limits. Web search runs on your computer with your own search
              key, so search terms never reach us.
            </>,
            <>
              <strong className="font-medium text-foreground">Technical data:</strong>{" "}
              IP address, device and app version, and request logs that our
              servers and network provider record when Misty connects to them.
              We use these to keep Misty working and secure.
            </>,
          ]}
        />
        <p>
          We don't intentionally collect sensitive information such as health,
          religious, or financial account data. Don't put it in Misty unless you
          need to. If you do, it's treated as Your Content.
        </p>
      </>
    ),
  },
  {
    id: "security",
    title: "Encryption and security",
    inShort:
      "Spaces, files, and voice transcripts are stored on the server you use and aren't end-to-end encrypted, so on Misty Cloud we can technically access them. Agent chats, prompts, and your keys stay on your computer.",
    body: (
      <>
        <LegalTable
          columns={["Data", "How it's protected", "Can Misty read it?"]}
          rows={[
            [
              "Spaces: notes, docs, drawings, files, messages, tasks, and calendar events",
              "Encrypted in transit (TLS); stored on the server you use",
              "Yes. Needed for search, previews, sharing, and export",
            ],
            [
              "Voice transcripts saved to your account",
              "Encrypted in transit (TLS); stored on the server you use. Other Misty users can't read them",
              "Yes. Needed to show them to you and make notes from them",
            ],
            [
              "What a space shows of your agents: names, state and work codes, file paths, and its activity log",
              "Encrypted in transit (TLS). File paths are passed on and not stored. The names and codes in the log are stored with the space",
              "Yes. Needed to show the space's members what agents are doing",
            ],
            [
              "Agent chats: prompts, replies, steps, and tool results",
              "Stored on the computer the chat ran on, and never synced",
              "No. They never reach our servers",
            ],
            [
              "AI requests, voice audio, and web searches",
              "Sent from your computer straight to the provider you chose, encrypted in transit (TLS)",
              "No. They don't pass through Misty, but the provider handling them can read them",
            ],
            [
              "Your model, search, and transcription keys, and sign-ins for apps you connect",
              "Kept on your computer, sealed with a key held in your system keychain",
              "No. They're never sent to our servers",
            ],
            [
              "Database backups",
              "Encrypted before storage",
              "Only to restore service",
            ],
          ]}
        />
        <p>
          Because space content, voice transcripts, and what a space shows of
          your agents are not end-to-end encrypted, we (and anyone who gained
          unauthorized access to our systems) could technically access what
          Misty Cloud holds. Anyone with access to your computer could read the
          agent chats stored on it. We only access what we hold when needed to
          run the service, fix a problem you report, prevent abuse, or comply
          with the law.
        </p>
        <p>
          We use reasonable technical and organizational measures to protect
          your information, including encryption, access controls, and
          separated backups. No system is perfectly secure, and we can't
          guarantee your information will never be accessed, lost, or changed
          without permission. If a breach affects your personal information, we
          will notify you and the authorities as the law requires. Sections 14
          and 15 of our <LegalLink to="/terms#disclaimers">Terms of Service</LegalLink>{" "}
          explain how the risk of these events is allocated.
        </p>
      </>
    ),
  },
  {
    id: "use",
    title: "How we use information",
    inShort: "To run Misty, keep things secure, and talk to you.",
    body: (
      <LegalList
        items={[
          "to provide Misty: spaces, sharing, search, voice transcripts, and showing the people in a space what its agents are doing;",
          "to create and manage your account;",
          "to send service emails, such as sign-in and security notices and important changes;",
          "to send product update emails, only if you choose to receive them;",
          "to prevent fraud, abuse, and security incidents, and to enforce our Terms;",
          "to fix bugs and improve Misty, using the technical data and support messages described above;",
          "to comply with legal obligations.",
        ]}
      />
    ),
  },
  {
    id: "ai",
    title: "AI features",
    inShort:
      "Agents and AI run on your computer, which sends what each request needs straight to the provider you chose, on your own account or key.",
    body: (
      <>
        <p>
          Misty hosts no model, and it doesn't supply model access, on any
          plan. The AI is your own: an AI tool such as Claude Code, Codex, or
          OpenCode signed in with your own account, a provider whose API key
          you add, such as Anthropic, OpenAI, Google, or OpenRouter, or a model
          that runs on your computer, such as Ollama. Agents and AI features
          run on your computer, which sends the content needed for each request
          straight to that provider. Depending on what you ask, this can
          include your prompt, the chat so far, files on your computer or in a
          space, web pages and screenshots from Misty's browser for agents,
          screenshots of your screen if you let an agent use your computer,
          and voice audio. The same goes for the other services you add keys
          for, such as web search, transcription, and speech.
        </p>
        <p>
          Your keys stay on your computer, sealed with a key held in your
          system keychain. An AI tool you sign in to keeps its own sign-in on
          your computer. No Misty server, Misty Cloud included, receives them or
          calls a model. The provider processes your content under the terms
          you accepted with it, and it bills you directly. Check its policy on
          training and data retention. We don't train AI models on your
          content.
        </p>
        <p>
          Agents can use apps you connect. You connect an app through its own
          sign-in, on its maker's page, and its tokens stay in your computer's
          keychain. They don't pass through our servers.
        </p>
        <p>
          Only the content needed for the feature you use is sent. If you don't
          want content processed by AI providers, don't use AI features on it,
          and don't add it to spaces where other members use AI.
        </p>
      </>
    ),
  },
  {
    id: "sharing",
    title: "Who we share information with",
    inShort:
      "Only the service providers we need to run Misty, the people you share spaces with, and the authorities when legally required.",
    body: (
      <>
        <p>
          We use the following service providers. They may only process your
          information on our behalf to provide their service.
        </p>
        <LegalTable
          columns={["Provider", "Purpose", "Data involved"]}
          rows={[
            [
              "Cloudflare",
              "Website hosting, network security, file storage (R2)",
              "Technical data, stored files, encrypted backups",
            ],
            [
              "OVHcloud",
              "Hosts the Misty Cloud server and its database",
              "Account data and content",
            ],
            ["Mailjet", "Sending account email, such as setup keys, sign-in links, and space invitations", "Name, email address, email content"],
            [
              "Stripe",
              "Payments and tax for Misty+ and Boosts",
              "Email address, billing details, payment card",
            ],
            ["Google", "Sign in with Google, if you use it", "Name, email, profile picture"],
          ]}
        />
        <p>
          The services you choose yourself, such as your AI provider or an app
          you connect, aren't our service providers. Your computer
          talks to them directly on your own account, under their terms, as
          section 5 explains.
        </p>
        <p>We also share information:</p>
        <LegalList
          items={[
            "with the members of any space you share content with, including what that space shows of your agents;",
            "when required by law, such as a valid subpoena or court order, or when needed to protect someone's safety or our rights. Where allowed, we will tell you first;",
            "with a successor if Misty is transferred to a company we form or to a buyer. The successor must honor this policy, and we will notify you.",
          ]}
        />
      </>
    ),
  },
  {
    id: "cookies",
    title: "Cookies and local storage",
    inShort:
      "We only use what's needed to sign you in and remember your settings, so there's no cookie banner.",
    body: (
      <>
        <p>
          Our website and web app use only the cookies and browser storage
          strictly needed for them to work. We don't use advertising, analytics,
          or social-media cookies.
        </p>
        <LegalTable
          columns={["Name", "Type", "Purpose", "How long"]}
          rows={[
            [
              "Session cookies",
              "Cookie (first-party)",
              "Keep you signed in and protect your session",
              "Until you sign out or the session expires",
            ],
            [
              "misty-scroll-positions",
              "Session storage",
              "Restore your scroll position when you go back",
              "Until you close the tab",
            ],
            [
              "misty.google-sign-in",
              "Session storage",
              "Finish a Google sign-in started in this tab",
              "Until the sign-in finishes or you close the tab",
            ],
          ]}
        />
        <p>
          Because these are strictly necessary, privacy laws such as the EU
          ePrivacy Directive and UK PECR don't require a consent banner for
          them. If we ever add non-essential cookies, we will ask for your
          consent first and update this section.
        </p>
      </>
    ),
  },
  {
    id: "retention",
    title: "How long we keep information",
    inShort:
      "While your account is open. After you delete it, there's 30 days to change your mind, then it's removed.",
    body: (
      <>
        <LegalList
          items={[
            "Account details and content: while your account is open.",
            "Spaces and files you delete: kept for 30 days, then removed.",
            "Agent chats on your computer: until you delete them there. Deleting your Misty account doesn't remove them, because we can't reach them.",
            "Your agents in a space: an agent's listing stays until you or the space's owner take it out. Its lines in the activity log stay with the space.",
            "Voice transcripts: until you ask us to delete them or you delete your account.",
            "After you delete your account: you can restore it for 30 days. After that, we delete your personal information or permanently anonymize it so it can't be linked to you.",
            "After Misty+ or a Boost ends, whether cancelled or unpaid: the account and its spaces keep their data on the Free plan. To delete your account and its data, use your account settings or write to us.",
            "Backups: deleted data can remain in encrypted backups for up to 30 more days until they're overwritten.",
            "Content in shared spaces: content you added to a space other people still use stays with that space, attributed to a deleted user.",
            "Emails we send: our record of each one, with its address, is removed 30 days after it's sent.",
            "Server logs: kept for a limited period for security and troubleshooting.",
            "Billing records: kept as long as tax and accounting law requires, which can be up to 7 years.",
            "Support emails: kept as long as needed to help you and for our records.",
          ]}
        />
      </>
    ),
  },
  {
    id: "rights",
    title: "Your choices and rights",
    inShort:
      "You can see, correct, and delete your data, ask us for a copy, and turn off product update emails.",
    body: (
      <>
        <LegalList
          items={[
            `Get a copy: email ${supportEmail} from your account email and we'll send you a copy of your account data. Agent chats aren't included because they stay on your computer.`,
            "Correct: update your name, email, and profile picture in Account Settings.",
            "Your agents: take an agent out of a space at any time, and it stops showing there. Lines it already added to the activity log stay with the space.",
            "Delete: delete your account in Account Settings → Profile. You will first need to hand off or delete spaces you own that have other members. Delete an agent chat in Misty on the computer that keeps it. To delete a voice transcript, email us.",
            "Opt out: turn off product update emails in Account Settings, or use the unsubscribe link in any email.",
          ]}
        />
        <p>
          Depending on where you live, you may also have the right to access,
          correct, delete, or receive a portable copy of your personal
          information, to restrict or object to how we process it, and to
          withdraw consent at any time. Email{" "}
          <LegalEmail address={supportEmail} /> from your account email to make
          a request. We will respond within 30 days, or sooner if your local law
          requires. We may need to verify your identity first. We won't treat
          you differently for exercising your rights.
        </p>
        <p>
          If you're in the EEA, UK, or Switzerland, you can also complain to
          your local data protection authority.
        </p>
      </>
    ),
  },
  {
    id: "legal-bases",
    title: "Legal bases (EEA and UK)",
    body: (
      <>
        <p>
          If you are in the EEA or UK, we process your personal information on
          these bases:
        </p>
        <LegalList
          items={[
            "Contract: to provide Misty under our Terms.",
            "Legitimate interests: to keep Misty secure, prevent abuse, and send essential service messages, balanced against your rights.",
            "Consent: for product update emails. You can withdraw consent at any time.",
            "Legal obligation: to respond to lawful requests.",
          ]}
        />
      </>
    ),
  },
  {
    id: "us-rights",
    title: "U.S. state privacy rights",
    body: (
      <>
        <p>
          Residents of California and other U.S. states with privacy laws have
          the rights described in section 9. In the past 12 months we have
          collected these categories of personal information, for the purposes
          in section 4: identifiers (name, email, IP address); internet
          activity limited to your use of Misty; commercial information, if you
          subscribe to Misty+ or Boosts (your plan and payment history); audio
          information, limited to the voice transcripts you save; and content
          you choose to store.
        </p>
        <p>
          We do not sell personal information or share it for cross-context
          behavioral advertising, and we have not done so in the past 12 months.
          We don't use sensitive personal information to infer characteristics
          about you. Since we don't sell or share data, there's nothing to opt
          out of, but we still honor Global Privacy Control signals. You can use
          an authorized agent to make a request on your behalf.
        </p>
      </>
    ),
  },
  {
    id: "transfers",
    title: "International transfers",
    body: (
      <p>
        Misty is operated from the United States, and our service providers may
        process information in the United States and other countries. When we
        transfer personal information from the EEA, UK, or Switzerland, we rely
        on our providers' Standard Contractual Clauses or other lawful transfer
        mechanisms.
      </p>
    ),
  },
  {
    id: "children",
    title: "Children",
    body: (
      <p>
        Misty is not directed at children under 13, or under 16 in the EEA and
        UK, and we don't knowingly collect their personal information. If we
        learn we have, we will delete the account and its data. If you believe a
        child is using Misty, contact <LegalEmail address={supportEmail} />.
      </p>
    ),
  },
  {
    id: "changes",
    title: "Changes to this policy",
    body: (
      <p>
        We may update this policy. We will change the "Last updated" date above,
        and if a change is material we will notify you by email or in Misty
        before it takes effect. We won't use information we already collected in
        a materially different way without your consent.
      </p>
    ),
  },
  {
    id: "contact",
    title: "Contact",
    body: (
      <p>
        Misty is operated by {operatorDescription}, who is responsible for your
        personal information (the "controller" under GDPR). Questions or
        requests: <LegalEmail address={supportEmail} />. See also our{" "}
        <LegalLink to="/terms">Terms of Service</LegalLink>.
      </p>
    ),
  },
];

export default function Privacy() {
  return (
    <LegalPage
      title="Privacy policy"
      intro={
        <p className="text-base leading-7 text-muted-foreground">
          This policy explains what information Misty collects, why, who we
          share it with, and the choices you have. It applies to the Misty app,
          this website, and Misty Cloud. A self-hosted Misty server is run by
          its operator, not Misty, and that operator handles the data on it.
        </p>
      }
      highlights={[
        "We don't sell your data, show ads, or use advertising trackers.",
        "Neither our website nor the app has analytics or crash reporting.",
        "Agent chats, prompts, and model calls stay on your computer and go only to the AI provider you chose. Our servers see only what your agents add to a space and what a space shows its members: each agent's name, what kind of work it's doing, and the files it's changing.",
        "Spaces, files, and voice transcripts are stored on the server you use. They aren't end-to-end encrypted.",
        "Misty hosts no model. Misty never charges for AI or sees your model keys.",
        "If you subscribe to Misty+ or Boosts, Stripe handles your card. We never see the full number.",
        "You can delete your account anytime in Account Settings, or email us for a copy of your data.",
      ]}
      sections={sections}
    />
  );
}
