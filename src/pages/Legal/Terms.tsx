import LegalPage, {
  LegalEmail,
  LegalLink,
  LegalList,
  LegalSubheading,
  type LegalSectionDef,
} from "./LegalPage";
import { legalInfo } from "./legalInfo";

const { supportEmail, operatorName, operatorDescription, governingState } =
  legalInfo;

const sections: LegalSectionDef[] = [
  {
    id: "eligibility",
    title: "Who can use Misty",
    inShort: `You must be at least ${legalInfo.minimumAge} (${legalInfo.minimumAgeEeaUk} in the EEA or UK), and anyone under 18 needs a parent or guardian's permission.`,
    body: (
      <>
        <p>
          You must be at least {legalInfo.minimumAge} years old to use Misty, or
          at least {legalInfo.minimumAgeEeaUk} if you live in the European
          Economic Area or the United Kingdom. If you are under 18, or under the
          age of majority where you live, you may only use Misty with the
          permission of a parent or legal guardian, who agrees to these Terms on
          your behalf. Paid plans must be purchased by an adult.
        </p>
        <p>
          Misty is not directed at children under 13. If we learn that an
          account belongs to a child under 13, we will close it and delete its
          data. If you believe a child under 13 is using Misty, contact{" "}
          <LegalEmail address={legalInfo.privacyEmail} />.
        </p>
        <p>
          You may not use Misty if you are barred from doing so under the laws
          that apply to you, including U.S. sanctions and export laws.
        </p>
      </>
    ),
  },
  {
    id: "account",
    title: "Your account",
    inShort:
      "Keep your login safe. You're responsible for what happens under your account.",
    body: (
      <>
        <p>
          Most of Misty requires an account. Give us accurate information and
          keep it up to date. You are responsible for keeping your password and
          devices secure and for all activity under your account, including
          actions taken by AI agents you start. Tell us promptly at{" "}
          <LegalEmail address={supportEmail} /> if you think someone else has
          accessed your account.
        </p>
        <p>
          One person per account. Don't share, sell, or transfer your account.
        </p>
      </>
    ),
  },
  {
    id: "license",
    title: "The software and your license",
    inShort:
      "We give you a personal, revocable license to use the Misty app. We keep ownership of Misty itself.",
    body: (
      <>
        <p>
          "Misty" means the Misty desktop application, the website at{" "}
          {legalInfo.siteUrl}, the web app, and the hosted services behind
          them, including sync, Spaces, and AI features. Misty is operated by{" "}
          {operatorDescription} ("we", "us", "our").
        </p>
        <p>
          While you follow these Terms, we grant you a personal, worldwide,
          non-exclusive, non-transferable, revocable license to install and use
          the Misty app on devices you own or control and to use the hosted
          services, under the plan you have. Misty may update itself
          automatically to fix bugs, patch security issues, or add or change
          features.
        </p>
        <p>
          Misty includes open-source components that are licensed under their
          own terms. Where an open-source license grants you broader rights
          than these Terms, that license controls for that component.
        </p>
        <p>
          The Misty name, logo, software, website, and design belong to us or
          our licensors. Except for the license above, these Terms don't give
          you any rights in Misty. If you send us feedback or ideas, we may use
          them without owing you anything.
        </p>
      </>
    ),
  },
  {
    id: "ai",
    title: "AI features and agents",
    inShort:
      "AI can be wrong, and agents act on your instructions. Check their work. You are responsible for what you ask them to do.",
    body: (
      <>
        <p>
          Misty includes AI features, such as chat, voice, search over your
          Spaces and Library, and agents that can browse, read pages, and take
          actions in the browser on your behalf. These features are powered by
          third-party AI providers listed in our{" "}
          <LegalLink to="/privacy#ai">Privacy Policy</LegalLink>.
        </p>
        <LegalList
          items={[
            "AI output can be inaccurate, incomplete, offensive, or out of date. Don't rely on it for medical, legal, financial, or other professional advice, and review it before you use or publish it.",
            "Agents act on your instructions. You are responsible for the actions an agent takes on your behalf, including filling in forms, sending messages, making purchases, or changing settings on other websites. Review what an agent is about to do before you approve it, and don't give agents tasks you wouldn't do yourself.",
            "You must follow the usage policies of our AI providers, and you may not use AI features to create content that is illegal, infringing, or harmful.",
            "AI usage on each plan is limited and resets weekly. Limits may change as model costs change.",
          ]}
        />
        <p>
          We are not responsible for what websites or third parties do in
          response to an agent's actions, or for losses caused by AI output or
          agent actions you started.
        </p>
      </>
    ),
  },
  {
    id: "content",
    title: "Your content",
    inShort:
      "You own what you put in Misty. You let us store and process it only to run Misty for you.",
    body: (
      <>
        <p>
          You keep ownership of the notes, drawings, files, messages, and other
          material you create in or upload to Misty ("Your Content"). You give
          us a limited, worldwide, royalty-free license to host, store, copy,
          process, transmit, and display Your Content only as needed to
          operate, secure, and provide Misty to you and to the people you share
          it with. This includes sending relevant parts of it to our service
          providers, such as AI providers, when you use a feature that needs
          them. We don't sell Your Content and we don't use it to train AI
          models.
        </p>
        <p>
          You are responsible for Your Content. You confirm you have the rights
          needed to upload and share it, and that it doesn't break the law or
          these Terms. We don't review Your Content in advance, but we may
          remove it or restrict access if we receive a valid legal complaint or
          believe it violates these Terms.
        </p>
      </>
    ),
  },
  {
    id: "spaces",
    title: "Spaces and sharing",
    inShort:
      "What you add to a shared Space is visible to its members and stays with that Space.",
    body: (
      <>
        <p>
          Spaces let you collaborate with people you invite. Anything you add to
          a Space can be seen, copied, and used, including by AI agents, by
          every member of that Space. Content you add to a shared Space stays
          with that Space if you leave it or delete your account, much like
          messages in a group chat. Only invite people you trust.
        </p>
        <p>
          The owner of a Space controls its membership. We are not responsible
          for what other members do with content you share with them, and
          disputes between members are between those members.
        </p>
      </>
    ),
  },
  {
    id: "sync",
    title: "Sync, encryption, and backups",
    inShort:
      "Browser sync is end-to-end encrypted, so if you lose your sync password, we can't recover that data. Keep your own backups.",
    body: (
      <>
        <p>
          Browser sync (your tabs, history, bookmarks, and website sign-ins) is
          end-to-end encrypted with a sync password that only you know. We
          never have that password and cannot reset it. If you lose it, your
          synced browser data cannot be recovered by anyone, including us.
        </p>
        <p>
          Other content, including Spaces, Library files, and AI requests, is
          protected in transit but is not end-to-end encrypted. See our{" "}
          <LegalLink to="/privacy#security">Privacy Policy</LegalLink> for
          details.
        </p>
        <p>
          <strong className="font-medium text-foreground">
            Misty is not a backup service.
          </strong>{" "}
          Data can be lost through bugs, outages, sync conflicts, lost
          passwords, account deletion, or circumstances outside our control. You
          are responsible for keeping your own copies of anything important.
          You can export your account data at any time from Account Settings.
        </p>
      </>
    ),
  },
  {
    id: "acceptable-use",
    title: "Acceptable use",
    inShort: "Don't break the law, abuse Misty, or harm other people.",
    body: (
      <>
        <p>You agree not to use Misty to:</p>
        <LegalList
          items={[
            "break any law, or infringe anyone's intellectual property, privacy, or other rights;",
            "upload or share malware, child sexual abuse material, non-consensual intimate imagery, or content that harasses, threatens, or exploits others;",
            "send spam, run scams, or impersonate anyone;",
            "access accounts, systems, or data you aren't authorized to access, or probe, scan, or test the security of Misty without our written permission;",
            "interfere with or overload Misty, or get around plan limits, usage limits, or security features;",
            "use agents or automation to scrape, attack, or abuse other websites, or to violate other websites' terms;",
            "copy, resell, reverse engineer, or build a competing product from Misty, except where the law expressly allows it.",
          ]}
        />
        <p>
          Found a security issue? Report it to{" "}
          <LegalEmail address={supportEmail} />. We appreciate responsible
          disclosure.
        </p>
      </>
    ),
  },
  {
    id: "billing",
    title: "Plans, free trials, and automatic renewal",
    inShort:
      "Paid plans renew automatically until you cancel. Trials turn into paid plans unless you cancel before they end.",
    body: (
      <>
        <p>
          Misty has a free Basic plan and paid plans, currently Pro and Max,
          described on our <LegalLink to="/pricing">pricing page</LegalLink>.
          Paid plans are billed in advance, monthly or yearly, through our
          payment processor, Stripe. We never see or store your full card
          number. Prices don't include taxes, which are added where required.
        </p>
        <LegalSubheading>Automatic renewal</LegalSubheading>
        <p>
          <strong className="font-medium text-foreground">
            Your subscription renews automatically at the end of each billing
            period, monthly or yearly, at the then-current price, and we will
            charge your payment method on file until you cancel.
          </strong>{" "}
          By starting a paid plan or trial, you authorize these recurring
          charges. You can cancel at any time in Account Settings → Billing.
        </p>
        <LegalSubheading>Free trials</LegalSubheading>
        <p>
          We may offer a one-time free trial of a paid plan. A trial requires a
          payment method.{" "}
          <strong className="font-medium text-foreground">
            Unless you cancel before the trial ends, your trial will convert
            into a paid subscription and you will be charged the plan price on
            the trial's end date, and on each renewal after that.
          </strong>{" "}
          We will email you before your trial ends. Trials are limited to one
          per person.
        </p>
        <LegalSubheading>Price changes</LegalSubheading>
        <p>
          We may change prices. We will tell you by email at least 30 days
          before a new price applies to your subscription, and the change will
          take effect at your next renewal. If you don't want to pay the new
          price, cancel before it takes effect.
        </p>
        <LegalSubheading>Failed payments</LegalSubheading>
        <p>
          If a payment fails, we and Stripe will retry it and email you. If we
          can't collect payment, your account may move to the free Basic plan
          and its limits will apply, as described in section 11.
        </p>
      </>
    ),
  },
  {
    id: "refunds",
    title: "Cancellation and refunds",
    inShort:
      "Cancel anytime. Payments are generally non-refundable, with a few exceptions.",
    body: (
      <>
        <p>
          You can cancel at any time in Account Settings → Billing. Cancellation
          stops future renewals. You keep paid features until the end of the
          period you already paid for, and then your account moves to the free
          Basic plan.
        </p>
        <p>
          Payments are non-refundable, and we don't give refunds or credits for
          partial periods or unused features, except where required by law or
          described in our{" "}
          <LegalLink to="/refunds">Refund &amp; Cancellation Policy</LegalLink>,
          for example when Misty clearly didn't work and we couldn't fix it.
          Consumers in the EU, EEA, UK, and Switzerland have a 14-day right of
          withdrawal, explained in that policy.
        </p>
        <p>
          Please contact us before disputing a charge with your bank. We will
          try to make it right. Opening a chargeback for a valid charge may lead
          us to suspend the account.
        </p>
      </>
    ),
  },
  {
    id: "limits",
    title: "Plan limits and downgrades",
    inShort:
      "If you go over your plan's limits after downgrading, your extra content becomes read-only, and we may delete it after 90 days' notice.",
    body: (
      <>
        <p>
          Each plan has limits on Spaces, storage, and AI usage. If you
          downgrade, cancel, or your payment fails and your account ends up
          over the limits of your new plan, you won't be able to add more until
          you free up room or upgrade. Content over the limit may become
          read-only.
        </p>
        <p>
          If your account stays over its storage limit for more than 90 days,
          we may delete content over the limit, but only after emailing you at
          least 30 days in advance so you can export it. We will never delete
          content just because you moved to a lower plan without giving you
          that notice.
        </p>
      </>
    ),
  },
  {
    id: "changes-to-service",
    title: "Beta features and changes to Misty",
    inShort:
      "Misty is evolving. Features may change, and beta features may be rough.",
    body: (
      <>
        <p>
          We may add, change, or remove features, and change plan limits, at any
          time. If a change significantly reduces what a paid plan includes, we
          will give you reasonable notice, and you may cancel. Where the law
          requires it, we will also refund the unused part of your prepaid
          period.
        </p>
        <p>
          Features labeled beta, preview, or experimental are offered as-is,
          may be unreliable, and may be changed or removed without notice.
        </p>
        <p>
          If we decide to shut Misty down, we will give at least 30 days'
          notice so you can export your data, and we will refund the unused
          part of any prepaid subscription.
        </p>
      </>
    ),
  },
  {
    id: "termination",
    title: "Suspension and termination",
    inShort:
      "You can leave anytime. We can suspend or close accounts that break these Terms.",
    body: (
      <>
        <p>
          You can stop using Misty and delete your account at any time in
          Account Settings. Deleted accounts can be restored for 30 days, after
          which the data is removed as described in our{" "}
          <LegalLink to="/privacy#retention">Privacy Policy</LegalLink>.
        </p>
        <p>
          We may suspend or close your account, with or without notice, if you
          materially or repeatedly break these Terms, if your use creates legal
          risk or harm for us or others, if you don't pay, or if the law
          requires it. Where it's reasonable and lawful, we will tell you why
          and give you a chance to export your data. If we close your account
          without cause, we will refund the unused part of any prepaid
          subscription.
        </p>
        <p>
          Sections that by their nature should survive termination will
          survive, including sections 5, 7, and 14 through 22.
        </p>
      </>
    ),
  },
  {
    id: "dmca",
    title: "Copyright complaints",
    inShort:
      "If you think something in Misty infringes your copyright, tell us and we'll act on valid notices.",
    body: (
      <>
        <p>
          We respond to notices of alleged copyright infringement under the
          U.S. Digital Millennium Copyright Act. To file a notice, email{" "}
          <LegalEmail address={supportEmail} /> with the subject "DMCA
          notice" and include:
        </p>
        <LegalList
          items={[
            "your physical or electronic signature;",
            "identification of the copyrighted work you claim is infringed;",
            "identification of the material you claim is infringing and enough information for us to locate it;",
            "your name, address, telephone number, and email address;",
            "a statement that you have a good-faith belief the use is not authorized by the copyright owner, its agent, or the law; and",
            "a statement, under penalty of perjury, that the information in your notice is accurate and that you are the copyright owner or authorized to act on the owner's behalf.",
          ]}
        />
        <p>
          If your content was removed and you believe that was a mistake, you
          may send a counter-notice. We close the accounts of repeat infringers
          in appropriate circumstances.
        </p>
      </>
    ),
  },
  {
    id: "third-party",
    title: "Third-party websites and services",
    inShort:
      "Misty is a browser. The websites you visit and services you connect are not ours.",
    body: (
      <p>
        Misty lets you browse the web, install extensions, and connect
        third-party services, such as Google accounts and other apps you link.
        Those websites, extensions, and services are run by others under their
        own terms and privacy policies. We don't control them and aren't
        responsible for their content, security, availability, or what they do
        with your data. You use them at your own risk.
      </p>
    ),
  },
  {
    id: "disclaimers",
    title: "Disclaimers",
    inShort: "Misty is provided as-is, without guarantees.",
    body: (
      <>
        <p className="uppercase tracking-[0.01em]">
          Misty is provided "as is" and "as available." To the fullest extent
          permitted by law, we disclaim all warranties, express or implied,
          including warranties of merchantability, fitness for a particular
          purpose, title, and non-infringement. We do not guarantee that Misty
          will be uninterrupted, secure, error-free, or compatible with your
          devices, that data will not be lost or corrupted, or that AI output
          will be accurate.
        </p>
        <p>
          You use Misty at your own risk and are responsible for any damage to
          your devices, software, or data that results from installing or using
          it. Some places don't allow these disclaimers, so some of them may not
          apply to you.
        </p>
      </>
    ),
  },
  {
    id: "liability",
    title: "Limitation of liability",
    inShort:
      "If something goes wrong, our liability is limited to what you paid us in the last 12 months, or $50, whichever is more.",
    body: (
      <>
        <p className="uppercase tracking-[0.01em]">
          To the fullest extent permitted by law, we and our service providers
          will not be liable for any indirect, incidental, special,
          consequential, exemplary, or punitive damages, or for any loss of
          data, content, profits, revenue, business, or goodwill, or for damage
          to devices or the cost of substitute services, arising out of or
          related to Misty or these Terms, even if we were told such damages
          were possible.
        </p>
        <p className="uppercase tracking-[0.01em]">
          Our total liability for all claims arising out of or related to Misty
          or these Terms is limited to the greater of (a) the amount you paid us
          for Misty in the 12 months before the event giving rise to the claim,
          or (b) US $50.
        </p>
        <p>
          These limits apply to every theory of liability, including contract,
          tort (including negligence), and statute. Nothing in these Terms
          limits liability that cannot be limited by law, such as liability for
          fraud, or, for consumers in the EU, EEA, UK, and Switzerland, for
          death or personal injury caused by negligence, or for gross negligence
          or willful misconduct.
        </p>
      </>
    ),
  },
  {
    id: "indemnity",
    title: "Indemnity",
    inShort:
      "If your content or misuse of Misty gets us sued, you cover the cost.",
    body: (
      <p>
        To the extent permitted by law, you will defend, indemnify, and hold
        harmless {operatorName} and our service providers from any claims,
        damages, losses, and expenses, including reasonable legal fees, arising
        from Your Content, your use of Misty (including actions taken by agents
        you start), or your breach of these Terms or of anyone's rights. This
        section does not apply to consumers in the EU, EEA, UK, or Switzerland
        except where local law allows it.
      </p>
    ),
  },
  {
    id: "disputes",
    title: "Dispute resolution and arbitration",
    inShort:
      "Talk to us first. If that fails, U.S. users resolve disputes in individual arbitration or small-claims court, not in class actions. You can opt out within 30 days.",
    body: (
      <>
        <p>
          <strong className="font-medium text-foreground">
            Please read this section carefully. It affects your legal rights.
          </strong>{" "}
          It applies if you live in the United States or anywhere else not
          listed at the end of this section.
        </p>
        <LegalSubheading>Talk to us first</LegalSubheading>
        <p>
          Before starting any formal proceeding, email{" "}
          <LegalEmail address={supportEmail} /> with your name, account email,
          a description of the dispute, and what you want. We will try to
          resolve it informally within 60 days, and so will you.
        </p>
        <LegalSubheading>Binding individual arbitration</LegalSubheading>
        <p>
          If we can't resolve the dispute informally, you and we agree that any
          dispute arising out of or relating to Misty or these Terms will be
          resolved by binding individual arbitration administered by the
          American Arbitration Association under its Consumer Arbitration Rules,
          rather than in court. The arbitration may be held by video or
          telephone, or in the county where you live. The Federal Arbitration
          Act governs this section. If 25 or more similar demands are filed by
          or with the help of the same law firm or group, they will be
          administered under the AAA's Mass Arbitration Supplementary Rules.
        </p>
        <p>
          Either of us may instead bring an individual claim in small-claims
          court if it qualifies, and either of us may ask a court to stop
          infringement or misuse of intellectual property.
        </p>
        <LegalSubheading>No class actions or jury trials</LegalSubheading>
        <p className="uppercase tracking-[0.01em]">
          You and we each waive the right to a jury trial and to bring or take
          part in any class, collective, consolidated, or representative action.
          Claims may only be brought individually.
        </p>
        <p>
          If this class-action waiver is found unenforceable for a claim, this
          arbitration section will not apply to that claim, and the claim will
          be decided in court.
        </p>
        <LegalSubheading>Opting out</LegalSubheading>
        <p>
          You can opt out of this arbitration agreement by emailing{" "}
          <LegalEmail address={supportEmail} /> with the subject "Arbitration
          opt-out" from your account email within 30 days of first accepting
          these Terms. Opting out does not affect any other part of these Terms.
        </p>
        <LegalSubheading>EU, EEA, UK, and Swiss consumers</LegalSubheading>
        <p>
          If you are a consumer living in the EU, EEA, UK, or Switzerland, this
          section does not apply to you. You may bring claims in the courts of
          the country where you live, and you may also use the European
          Commission's online dispute resolution resources.
        </p>
      </>
    ),
  },
  {
    id: "governing-law",
    title: "Governing law",
    inShort: `These Terms are governed by the laws of ${governingState}, but local consumer protections still apply to you.`,
    body: (
      <p>
        These Terms are governed by the laws of the State of {governingState}{" "}
        and applicable U.S. federal law, without regard to conflict-of-law
        rules. For any claim not subject to arbitration, you and we agree to the
        exclusive jurisdiction of the state and federal courts located in{" "}
        {governingState}, except that consumers in the EU, EEA, UK, and
        Switzerland may sue in their home courts. Nothing in these Terms takes
        away protections you have under the mandatory consumer laws of the
        country where you live.
      </p>
    ),
  },
  {
    id: "changes",
    title: "Changes to these Terms",
    inShort:
      "We'll tell you about important changes before they take effect.",
    body: (
      <p>
        We may update these Terms. We will change the "Last updated" date
        above, and if a change is material we will notify you by email or in
        Misty at least 14 days before it takes effect, unless the change is
        required sooner by law or to address security or abuse. If you keep
        using Misty after a change takes effect, you accept the updated Terms.
        If you don't agree, stop using Misty and cancel your subscription.
        Changes to section 19 won't apply to disputes that we already know
        about.
      </p>
    ),
  },
  {
    id: "general",
    title: "General",
    body: (
      <>
        <p>
          These Terms, together with our{" "}
          <LegalLink to="/privacy">Privacy Policy</LegalLink> and{" "}
          <LegalLink to="/refunds">Refund &amp; Cancellation Policy</LegalLink>
          , are the entire agreement between you and us about Misty. If any
          part of these Terms is found unenforceable, the rest stays in effect.
          Our not enforcing a provision is not a waiver of it.
        </p>
        <p>
          You may not transfer these Terms without our consent. We may transfer
          them, for example to a company we form to operate Misty or to a buyer
          of Misty, and we will tell you if that happens. We aren't liable for
          delays or failures caused by events beyond our reasonable control,
          such as outages of our service providers, natural disasters, or
          attacks.
        </p>
      </>
    ),
  },
  {
    id: "contact",
    title: "Contact",
    body: (
      <p>
        Misty is operated by {operatorDescription}. Questions about these Terms?
        Email <LegalEmail address={supportEmail} />.
      </p>
    ),
  },
];

export default function Terms() {
  return (
    <LegalPage
      title="Terms of Service"
      summary="The agreement covering your use of Misty and its hosted services."
      intro={
        <p className="text-base leading-7 text-muted-foreground">
          These Terms of Service ("Terms") are a contract between you and{" "}
          {operatorDescription}. By creating an account, installing the app, or
          using Misty, you agree to them. If you don't agree, don't use Misty.
          Section 19 requires U.S. users to resolve disputes through individual
          arbitration instead of class actions.
        </p>
      }
      highlights={[
        "You own your content. We only use it to run Misty for you, and we never sell it or train AI models on it.",
        "Paid plans renew automatically until you cancel. You can cancel anytime in Account Settings.",
        "Payments are generally non-refundable. See the Refund & Cancellation Policy for the exceptions.",
        "AI can be wrong, and you're responsible for what you ask agents to do.",
        "Misty isn't a backup service. Keep copies of anything important.",
        "Our liability is limited, and U.S. disputes go to individual arbitration.",
      ]}
      sections={sections}
    />
  );
}
