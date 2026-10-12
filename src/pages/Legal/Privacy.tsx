import LegalPage, {
  LegalEmail,
  LegalLink,
  LegalList,
  LegalSubheading,
  LegalTable,
  type LegalSectionDef,
} from "./LegalPage";
import { legalInfo } from "./legalInfo";

const { privacyEmail, operatorDescription } = legalInfo;

const sections: LegalSectionDef[] = [
  {
    id: "what-we-dont-do",
    title: "What we don't do",
    inShort:
      "No ads, no selling data, no advertising trackers, and no analytics unless you turn them on.",
    body: (
      <LegalList
        items={[
          "We don't sell your personal information or share it for advertising.",
          "We don't show ads, and we don't use advertising, social-media, or cross-site tracking pixels on our website or in the app.",
          "Our website has no analytics or tracking scripts.",
          "Usage analytics and crash reports in the app are off by default. They are only sent if you turn them on (see section 7).",
          "We don't train AI models on your content.",
          "We can't read your synced browser data. It's end-to-end encrypted with a password only you know.",
        ]}
      />
    ),
  },
  {
    id: "collect",
    title: "Information we collect",
    inShort:
      "Your account details, the content you put in Misty, billing status, and basic technical data needed to run the service.",
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
              <strong className="font-medium text-foreground">Your content:</strong>{" "}
              notes, drawings, files, Library items, messages, and other
              material you create in or upload to Spaces, plus AI conversations,
              agent tasks, and their results.
            </>,
            <>
              <strong className="font-medium text-foreground">Synced browser data:</strong>{" "}
              if you turn on sync, your tabs, history, bookmarks, website
              sign-ins, and extension data. This is encrypted on your device
              before it reaches us, so we can only store it, not read it.
            </>,
            <>
              <strong className="font-medium text-foreground">Voice and screenshots:</strong>{" "}
              when you use voice features, the audio you record; when an agent
              works in the browser for you, screenshots and page content it
              needs for that task.
            </>,
            <>
              <strong className="font-medium text-foreground">Connected accounts:</strong>{" "}
              if you connect a third-party service, such as a Google account or
              another app, the access tokens and account details needed to use
              that connection.
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
              <strong className="font-medium text-foreground">Billing information:</strong>{" "}
              your plan, subscription status, and billing history. Payments are
              handled by Stripe, so we never receive or store your full card
              number.
            </>,
            <>
              <strong className="font-medium text-foreground">Usage and limits:</strong>{" "}
              storage used, number of Spaces, and AI usage, which we need to
              apply your plan's limits.
            </>,
            <>
              <strong className="font-medium text-foreground">Technical data:</strong>{" "}
              IP address, device and app version, and request logs that our
              servers and network provider record when Misty connects to them.
              We use these to keep Misty working and secure.
            </>,
            <>
              <strong className="font-medium text-foreground">Optional analytics and crash reports:</strong>{" "}
              only if you turn them on (see section 7).
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
      "Browser sync is end-to-end encrypted. Spaces, files, and AI requests are not, so we can technically access them.",
    body: (
      <>
        <LegalTable
          columns={["Data", "How it's protected", "Can Misty read it?"]}
          rows={[
            [
              "Synced tabs, history, bookmarks, website sign-ins",
              "End-to-end encrypted (AES-256-GCM) with a key derived from your sync password on your device",
              "No",
            ],
            [
              "Spaces, notes, drawings, Library files, messages",
              "Encrypted in transit (TLS); stored on our servers",
              "Yes. Needed for search, AI, sharing, and export",
            ],
            [
              "AI requests, voice audio, agent screenshots",
              "Encrypted in transit (TLS); sent to our AI providers",
              "Yes, and so can the AI provider handling the request",
            ],
            [
              "Connected-account tokens",
              "Encrypted on our servers",
              "Only to make the connection work",
            ],
            [
              "Database backups",
              "Encrypted before storage",
              "Only to restore service",
            ],
          ]}
        />
        <p>
          Because Space content is not end-to-end encrypted, we (and anyone who
          gained unauthorized access to our systems) could technically access
          it. We only access it when needed to run the service, fix a problem
          you report, prevent abuse, or comply with the law.
        </p>
        <p>
          We use reasonable technical and organizational measures to protect
          your information, including encryption, access controls, and
          separated backups. No system is perfectly secure, and we can't
          guarantee your information will never be accessed, lost, or changed
          without permission. If a breach affects your personal information, we
          will notify you and the authorities as the law requires.
        </p>
      </>
    ),
  },
  {
    id: "use",
    title: "How we use information",
    inShort: "To run Misty, bill you, keep things secure, and talk to you.",
    body: (
      <LegalList
        items={[
          "to provide Misty: syncing, Spaces, sharing, search, and AI features;",
          "to create and manage your account, apply plan limits, and process payments;",
          "to send service emails, such as sign-in and security notices, receipts, trial and renewal reminders, and important changes;",
          "to send product update emails, only if you choose to receive them;",
          "to prevent fraud, abuse, and security incidents, and to enforce our Terms;",
          "to fix bugs and improve Misty, using only analytics and crash reports you opted into;",
          "to comply with legal obligations, such as tax and accounting rules.",
        ]}
      />
    ),
  },
  {
    id: "ai",
    title: "AI features",
    inShort:
      "When you use AI, the content needed for that request is sent to an AI provider to generate a response.",
    body: (
      <>
        <p>
          Misty doesn't run its own AI models. When you use an AI feature, the
          content needed for that request is sent from our servers to an AI
          provider, which generates a response. Depending on the feature, this
          can include your prompt, relevant Space or Library content, page
          content and screenshots for agent tasks, voice audio, and media for
          transcription or search indexing.
        </p>
        <p>
          We currently use OpenAI directly, and the Vercel AI Gateway to reach
          models from Google (Gemini), Anthropic, and xAI. These providers
          process the content under their API terms for business customers.
          Those terms say they don't train their models on API data by default.
          We don't train AI models on your content.
        </p>
        <p>
          Only the content needed for the feature you use is sent. If you don't
          want content processed by AI providers, don't use AI features on it,
          and don't add it to Spaces where other members use AI.
        </p>
      </>
    ),
  },
  {
    id: "sharing",
    title: "Who we share information with",
    inShort:
      "Only the service providers we need to run Misty, the people you share Spaces with, and the authorities when legally required.",
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
              "Our server hosting provider",
              "Runs our application servers and database",
              "Account data and content",
            ],
            [
              "OpenAI, Vercel AI Gateway, Google, Anthropic, xAI",
              "AI features",
              "Content needed for each AI request",
            ],
            ["Stripe", "Payments and subscriptions", "Name, email, billing details"],
            ["Mailjet", "Sending email", "Name, email address, email content"],
            [
              "PostHog",
              "Usage analytics and crash reports, only if you opt in",
              "Feature usage events and redacted error reports",
            ],
            ["Google", "Sign in with Google (optional)", "Name, email, profile picture"],
            [
              "Composio",
              "Connecting third-party apps (optional)",
              "Tokens and data for apps you connect",
            ],
          ]}
        />
        <p>We also share information:</p>
        <LegalList
          items={[
            "with the members of any Space you share content with;",
            "when required by law, such as a valid subpoena or court order, or when needed to protect someone's safety or our rights. Where allowed, we will tell you first;",
            "with a successor if Misty is transferred to a company we form or to a buyer. The successor must honor this policy, and we will notify you.",
          ]}
        />
      </>
    ),
  },
  {
    id: "analytics",
    title: "Optional analytics and crash reports",
    inShort:
      "Off by default. If you turn them on, we learn which features are used and what crashed, never your files or browsing.",
    body: (
      <>
        <p>
          In Account Settings → Privacy, you can choose to share anonymous usage
          analytics and crash reports. Both are off unless you turn them on, and
          you can turn them off at any time.
        </p>
        <LegalList
          items={[
            "Usage analytics records which Misty features are used, such as opening the AI companion. It is linked to your account so we can count usage accurately. It does not include page views, browsing history, file names, file contents, or session recordings.",
            "Crash reports include an error message and stack trace with file paths, URLs, email addresses, and tokens removed. They are linked to a random ID for that app session, not to your account.",
            "Both are processed by PostHog in the United States.",
          ]}
        />
      </>
    ),
  },
  {
    id: "face-grouping",
    title: "Face grouping (optional)",
    inShort:
      "If you turn on People, Misty groups photos by face. It's off unless you opt in, and the data is deleted when you turn it off.",
    body: (
      <>
        <p>
          The People feature can group photos and videos in your Library by the
          faces in them. To do this, Misty creates numerical face templates, a
          kind of biometric data. This feature only runs if you turn it on and
          agree to this processing.
        </p>
        <LegalList
          items={[
            "Face templates are used only to group your media in Misty. We never sell them or use them to identify people outside your Library.",
            "They are processed on our servers and not shared with anyone except our hosting providers.",
            "If you turn People off, delete the media, or delete your account, the related face templates are deleted within 30 days. In any case, we delete them within 3 years of your last use of Misty.",
            "Only turn People on for photos of people who have agreed to it, where the law requires their consent.",
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
              "misty-ui-theme",
              "Local storage",
              "Remember light or dark theme",
              "Until you clear it",
            ],
            [
              "misty-scroll-positions",
              "Session storage",
              "Restore your scroll position when you go back",
              "Until you close the tab",
            ],
            [
              "Stripe cookies",
              "Cookie (third-party)",
              "Fraud prevention, set only on Stripe's checkout and billing pages",
              "Set by Stripe",
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
            "After you delete your account: you can restore it for 30 days. After that, we delete your personal information or permanently anonymize it so it can't be linked to you.",
            "Backups: deleted data can remain in encrypted backups for up to 30 more days until they're overwritten.",
            "Content in shared Spaces: content you added to a Space other people still use stays with that Space, attributed to a deleted user.",
            "Billing records: kept as long as tax and accounting laws require, usually up to 7 years. Stripe keeps its own records under its policy.",
            "Server logs: kept for a limited period for security and troubleshooting.",
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
      "You can see, export, correct, and delete your data, and turn off optional data sharing.",
    body: (
      <>
        <LegalList
          items={[
            "Export: download a copy of your account data in Account Settings → Account. Synced browser data isn't included because we can't decrypt it.",
            "Correct: update your name, email, and profile picture in Account Settings.",
            "Delete: delete your account in Account Settings → Account. You will first need to hand off or delete Spaces you own that have other members.",
            "Opt out: turn off analytics, crash reports, and product update emails in Account Settings, or use the unsubscribe link in any email.",
          ]}
        />
        <p>
          Depending on where you live, you may also have the right to access,
          correct, delete, or receive a portable copy of your personal
          information, to restrict or object to how we process it, and to
          withdraw consent at any time. Email{" "}
          <LegalEmail address={privacyEmail} /> from your account email to make
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
            "Contract: to provide Misty and bill you under our Terms.",
            "Legitimate interests: to keep Misty secure, prevent abuse, and send essential service messages, balanced against your rights.",
            "Consent: for optional analytics, crash reports, product update emails, and face grouping. You can withdraw consent at any time.",
            "Legal obligation: to keep billing records and respond to lawful requests.",
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
          the rights described in section 11. In the past 12 months we have
          collected these categories of personal information, for the purposes
          in section 4: identifiers (name, email, IP address); commercial
          information (plan and billing history); internet activity limited to
          your use of Misty and, with your consent, feature-usage analytics; and
          content you choose to store. If you turn on People, we also collect
          biometric information (face templates).
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
        child is using Misty, contact <LegalEmail address={privacyEmail} />.
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
        requests: <LegalEmail address={privacyEmail} />. See also our{" "}
        <LegalLink to="/terms">Terms of Service</LegalLink>.
      </p>
    ),
  },
];

export default function Privacy() {
  return (
    <LegalPage
      title="Privacy Policy"
      summary="How Misty handles your account details, files, and Space content."
      intro={
        <p className="text-base leading-7 text-muted-foreground">
          This policy explains what information Misty collects, why, who we
          share it with, and the choices you have. It applies to the Misty app,
          website, and hosted services.
        </p>
      }
      highlights={[
        "We don't sell your data, show ads, or use advertising trackers.",
        "Our website has no analytics. In-app analytics and crash reports are off unless you turn them on.",
        "Browser sync is end-to-end encrypted. Spaces, files, and AI requests are not.",
        "AI requests go to AI providers such as OpenAI and Google to generate responses.",
        "You can export or delete your data anytime in Account Settings.",
      ]}
      sections={sections}
    />
  );
}
