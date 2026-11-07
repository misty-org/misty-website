import LegalPage, {
  LegalEmail,
  LegalLink,
  LegalList,
  LegalSubheading,
  type LegalSectionDef,
} from "./LegalPage";
import { cloudTermsSection } from "./cloudTerms";
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
          your behalf.
        </p>
        <p>
          Misty is not directed at children under 13. If we learn that an
          account belongs to a child under 13, we will close it and delete its
          data. If you believe a child under 13 is using Misty, contact{" "}
          <LegalEmail address={supportEmail} />.
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
          Misty works as a browser without an account. Sync, Spaces and the
          tools agents use need an account on a Misty server, such as Misty
          Pro. Give us accurate information and keep it up to date. You are
          responsible for keeping your password, setup keys and devices secure
          and for all activity under your account, including actions taken by
          AI agents you start. Tell us promptly at{" "}
          <LegalEmail address={supportEmail} /> if you think someone else has
          accessed your account.
        </p>
        <p>
          One person per account. Don't share, sell, or transfer your account.
        </p>
      </>
    ),
  },
  cloudTermsSection,
  {
    id: "license",
    title: "The software and your license",
    inShort:
      "The Misty app is open source under the GNU AGPL-3.0. These Terms cover the website and the services we run.",
    body: (
      <>
        <p>
          "Misty" means the Misty desktop application, the website at{" "}
          {legalInfo.siteUrl}, and Misty Pro, the Misty server we run for
          subscribers, with its sync, Spaces, and agent tools. Misty is
          operated by{" "}
          {operatorDescription} ("we", "us", "our").
        </p>
        <p>
          The Misty app, server, and agent runtime are open source under the{" "}
          <LegalLink to="/license">GNU AGPL-3.0</LegalLink>. That license, not
          these Terms, governs how you may use, copy, change, and share the
          source code. Misty includes other open-source components, each
          licensed under its own terms. The source code comes with no warranty
          and the limits of liability in sections 15 and 16 of that license, and
          nothing in these Terms restricts the rights it gives you. Misty may
          update itself automatically to fix bugs, patch security issues, or add
          or change features.
        </p>
        <p>
          These Terms cover this website, the app builds we publish, and Misty
          Pro. If you run your own Misty server, you operate it and are solely
          responsible for it, its security, and the data on it. We don't operate,
          monitor, or support servers we don't run, or copies of Misty that
          others have changed or distributed, and we aren't responsible for them.
        </p>
        <p>
          The Misty name and logo belong to us. The AGPL covers the code, not
          our trademarks. If you share or run a changed version of Misty, give
          it a different name and logo. You may say it's based on Misty. The
          author attribution term in Misty's NOTICE file still applies to every
          copy, changed or not.
        </p>
        <p>
          If you send us feedback or ideas, we may use them without owing you
          anything.
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
          actions in the browser on your behalf. Misty hosts no model. Agents
          run on your desktop, and these features run on models that are your
          own, called from your device: your ChatGPT plan through Sign in with
          ChatGPT, OpenRouter, Ollama, or a provider whose API key you add, as
          described in our{" "}
          <LegalLink to="/privacy#ai">Privacy Policy</LegalLink>. Sign in with
          ChatGPT works the same on your own server and on Misty Pro, and it
          isn't part of what a Misty Pro subscription sells.
        </p>
        <LegalList
          items={[
            "AI output can be inaccurate, incomplete, offensive, or out of date. Don't rely on it for medical, legal, financial, or other professional advice, and review it before you use or publish it.",
            "Agents act on your instructions and signed in as you. You are responsible for the actions an agent takes on your behalf, including filling in forms, sending messages, making purchases, deleting content, or changing settings on other websites. Depending on the mode you choose, an agent may act without asking you first at each step. Don't give agents tasks you wouldn't do yourself.",
            "Websites and documents can contain hidden instructions that mislead an agent. Pauses, confirmations, site blocks, and other safeguards reduce risk, but they can fail and aren't a guarantee.",
            "You must follow the terms and usage policies of the model providers you use, and you may not use AI features to create content that is illegal, infringing, or harmful.",
            "Your model provider bills you directly for the AI you use. We never charge for AI, on any plan, and aren't responsible for those charges.",
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
          providers, such as Composio when an agent acts in an app you
          connected, when you use a feature that needs them. We don't sell Your Content and we don't use it to train AI
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
          Other content, including Spaces, Library files, and Memory, is
          protected in transit but is not end-to-end encrypted, and is stored on
          the server you use. Agent conversations are stored on the computer
          that started them and don't sync, so a lost computer loses them. While
          an agent runs, the server you use receives its prompt, the
          conversation's history, and its tool results, including what it reads
          on a signed-in page, and holds them for about 24 hours. AI requests go
          from your desktop to the model provider you chose, not through us. See
          our{" "}
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
          To get a copy of your account data, email{" "}
          <LegalEmail address={supportEmail} /> from your account email.
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
            "interfere with or overload services we run, or get around their usage limits or security features;",
            "use agents or automation to scrape, attack, or abuse other websites, or to violate other websites' terms.",
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
    id: "changes-to-service",
    title: "Beta features and changes to Misty",
    inShort:
      "Misty is evolving. Features may change, and beta features may be rough.",
    body: (
      <>
        <p>
          We may add, change, or remove features at any time.
        </p>
        <p>
          Features labeled beta, preview, or experimental are offered as-is,
          may be unreliable, and may be changed or removed without notice.
        </p>
        <p>
          If we decide to shut down a service we run, we will give at least 30
          days' notice so you can get a copy of your data.
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
          <LegalLink to="/privacy#retention">Privacy Policy</LegalLink>. When
          a Misty Pro subscription ends, section 3 says what happens to the
          account.
        </p>
        <p>
          We may suspend or close your account, with or without notice, if you
          materially or repeatedly break these Terms, if your use creates legal
          risk or harm for us or others, or if the law requires it. Where it's
          reasonable and lawful, we will tell you why and give you a chance to
          get a copy of your data.
        </p>
        <p>
          Sections that by their nature should survive termination will
          survive, including section 3 for amounts you owe, sections 6 and 8,
          and sections 12 through 20.
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
        own terms and privacy policies. We don't control or review them and
        aren't responsible for their content, security, availability, or what
        they do with your data, including any malware, phishing, or other harm
        they cause. You use them at your own risk.
      </p>
    ),
  },
  {
    id: "disclaimers",
    title: "Your risk, our efforts, and disclaimers",
    inShort:
      "We work to keep Misty safe and reliable, but we can't promise it will be, and you use it at your own risk.",
    body: (
      <>
        <p>
          We make reasonable efforts to reduce the risks of using Misty,
          including by testing our software, fixing problems we find, and
          protecting the systems we run. Those efforts are not a guarantee of
          any result. Software and online services can fail in ways no one
          foresees, and some risks can't be removed.
        </p>
        <p>
          <strong className="font-medium text-foreground">
            You use Misty at your own risk.
          </strong>{" "}
          Those risks include:
        </p>
        <LegalList
          items={[
            "loss, corruption, or deletion of data, including through bugs, updates, sync conflicts, outages, lost passwords, or account closure;",
            "unauthorized access to, or theft or exposure of, your data, accounts, or website sign-ins, including through attacks on or flaws in Misty, our service providers, or your devices;",
            "malware, phishing, or other harmful code or content, including through websites, downloads, extensions, or connected services you use in Misty;",
            "bugs, defects, crashes, incompatibility, or damage to your devices or software;",
            "mistakes by AI features and agents, including actions taken after an agent is misled by content on a page; and",
            "interruption, change, or discontinuation of Misty or of any service it depends on.",
          ]}
        />
        <p>
          You are responsible for deciding whether Misty is right for your
          needs, keeping your own backups, and securing your devices and
          accounts. Unless the law requires otherwise, we have no obligation to
          repair, restore, replace, or compensate you for anything lost or
          harmed in these ways.
        </p>
        <p>
          Misty is provided "as is" and "as available." To the fullest extent
          permitted by law, the Misty parties disclaim all warranties, express
          or implied, including warranties of merchantability, fitness for a
          particular purpose, title, and non-infringement. We do not guarantee
          that Misty will be uninterrupted, secure, error-free, free of viruses
          or other harmful code, or compatible with your devices, that data will
          not be lost, corrupted, or accessed without permission, or that AI
          output will be accurate.
        </p>
        <p>
          The "Misty parties" are Matthew Chen personally, any company formed to
          operate Misty, and their successors, contractors, contributors, and
          service providers. Some places don't allow these disclaimers, so some
          of them may not apply to you.
        </p>
      </>
    ),
  },
  {
    id: "liability",
    title: "Limitation of liability",
    inShort:
      "To the fullest extent the law allows, the Misty parties aren't liable for the losses in section 14, you agree not to bring claims for them, and any remaining liability is limited to US $50.",
    body: (
      <>
        <p>
          <strong className="font-medium text-foreground">
            Please read this section carefully. It limits what you can recover
            from the Misty parties and your right to bring claims against them.
          </strong>
        </p>
        <p>
          To the fullest extent permitted by law, the Misty parties will not be
          liable for, or be required to compensate you for, any indirect,
          incidental, special, consequential, exemplary, or punitive damages, or
          any loss, theft, corruption, or exposure of data, content, accounts,
          or sign-ins, any malware or other harmful code, any software defect,
          any damage to devices, any loss of profits, revenue, business, or
          goodwill, or the cost of substitute services, arising out of or related
          to Misty or these Terms. This applies whatever the cause, including a
          flaw in Misty or a failure of its security, even if we were told such
          losses were possible and even if a remedy fails of its essential
          purpose.
        </p>
        <p>
          To the fullest extent permitted by law, you release the Misty parties
          from, and agree not to bring, any claim for losses this section
          excludes. If you live in California, you waive California Civil Code
          section 1542 to that extent, which says: "A general release does not
          extend to claims that the creditor or releasing party does not know or
          suspect to exist in his or her favor at the time of executing the
          release and that, if known by him or her, would have materially
          affected his or her settlement with the debtor or released party."
        </p>
        <p>
          The Misty parties' total liability for all claims arising out of or
          related to Misty or these Terms is limited to US $50.
        </p>
        <p>
          These limits apply to every theory of liability, including contract,
          tort (including negligence), strict liability, and statute. They are
          an essential part of how Misty is offered, and each one applies
          separately.
        </p>
        <p>
          Nothing in these Terms excludes or limits liability, or waives rights,
          that the law doesn't allow to be excluded, limited, or waived.
          Depending on where you live, that can include liability for fraud,
          willful misconduct, gross negligence, violations of law, or death or
          personal injury, and rights under consumer protection and privacy laws.
          Where the law restricts this section, it applies to the greatest extent
          the law allows.
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
        harmless the Misty parties, including {operatorName}, from any claims,
        damages, losses, and expenses, including reasonable legal fees, arising
        from Your Content, your use of Misty (including actions taken by agents
        you start, extensions you install, and any server or changed version of
        Misty you run), or your breach of these Terms or of anyone's rights. This
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
        <p>
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
        If you don't agree, stop using Misty. Changes to section 17 won't
        apply to disputes that we already know about.
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
          <LegalLink to="/privacy">Privacy Policy</LegalLink>, are the entire
          agreement between you and us about Misty. If any
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
      title="Terms of service"
      intro={
        <p className="text-base leading-7 text-muted-foreground">
          These Terms of Service ("Terms") are a contract between you and{" "}
          {operatorDescription}. By creating an account, subscribing to Misty
          Pro, installing the app, or using Misty, you agree to them. If you
          don't agree, don't use Misty. Sections 14 to 16 place the risk of using
          Misty on you and limit our liability and your right to bring claims.
          Section 17 requires U.S. users to resolve disputes through individual
          arbitration instead of class actions.
        </p>
      }
      highlights={[
        "You own your content. We only use it to run Misty for you, and we never sell it or train AI models on it.",
        "The Misty app is open source under the GNU AGPL-3.0. If you run your own server, you're responsible for it.",
        "Misty Pro is billed monthly, plus tax where it applies. Cancelling takes effect at the end of the month you've paid for, and we never charge for AI.",
        "AI can be wrong, and you're responsible for what you ask agents to do.",
        "Misty isn't a backup service. Keep copies of anything important.",
        "We work to keep Misty safe, but we don't guarantee it. You use it at your own risk, including the risk of data loss, stolen data, malware, and software defects.",
        "To the fullest extent the law allows, we aren't liable for those losses, any remaining liability is limited to US $50, and U.S. disputes go to individual arbitration.",
      ]}
      sections={sections}
    />
  );
}
