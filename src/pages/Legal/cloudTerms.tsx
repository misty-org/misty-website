import {
  LegalLink,
  LegalList,
  LegalSubheading,
  type LegalSectionDef,
} from "./LegalPage";

/**
 * The Misty Cloud subscription section of the Terms (section 3), for Misty+ and Boosts. Kept apart so
 * the Terms file stays readable.
 */
export const cloudTermsSection: LegalSectionDef = {
  id: "cloud",
  title: "Misty+ and Boosts",
  inShort:
    "Misty+ and Boosts are subscriptions on Misty Cloud, the Misty server we run: Misty+ adds storage to your account, and a Boost raises a Space's level. We never charge for AI, and you can cancel at any time, effective at the end of the month you've paid for.",
  body: (
    <>
      <p>
        Misty Cloud is a Misty server that we run. Anyone can use it on the
        Free plan. Misty+ is a paid plan with more storage and Boosts to give; a Boost is a
        subscription that raises one Space's level for everyone in it.
        You don't need a paid plan to use Misty: the app, Misty Cloud on Free,
        and running your own Misty server are free.
      </p>
      <LegalSubheading>Payment and your account</LegalSubheading>
      <p>
        Misty+ is billed monthly or yearly, and Boosts monthly, in advance, in US dollars, through our
        payment processor, Stripe. Sales tax, VAT or GST is added where it
        applies, worked out by Stripe from your billing address. Your billing date is the day of the month you
        subscribed. When you subscribe, you authorize us to charge your payment
        method on each billing date until you cancel.
      </p>
      <p>
        Your payment adds your plan to the Misty account you were signed in
        with. If you ask for a sign-in link, we email it to that account&apos;s
        address. Keep sign-in links private: until one is used or expires,
        anyone who has it can use it to get into your account. You manage your subscription, payment method and invoices
        in your account settings.
      </p>
      <LegalSubheading>What your plan includes</LegalSubheading>
      <LegalList
        items={[
          <>
            Your plan includes the storage and other limits shown on our{" "}
            <LegalLink to="/pricing">pricing page</LegalLink> when you
            subscribe.
          </>,
          "When you reach a limit, Misty Cloud refuses what would go over it, such as a new upload or joining another Space, until you make room. You can always open, download and delete what you have, and the rest of Misty keeps working.",
          "You can switch Misty+ between monthly and yearly, and change how many Boosts you buy, in your account settings. A change takes effect right away: a larger one charges the difference for the rest of the billing period, and a smaller one credits it toward your next bills.",
          "A Space's level comes from the Boosts its current members give it. When Boosts end, the Space drops a level and keeps everything; what's over a limit stays, and nothing new can be added until it's under.",
          "We never charge for AI. Misty hosts no model and doesn't supply model access: AI runs on the models and AI tools you choose, from your own computer, and you pay your provider directly.",
        ]}
      />
      <LegalSubheading>Cancelling and refunds</LegalSubheading>
      <p>
        You can cancel at any time in your account settings. Cancelling takes
        effect at the end of the billing month you've paid for, and you keep
        full access until then. Except where the law requires otherwise and the
        credit for switching to a smaller plan, payments aren't refundable and
        we don't give partial refunds or credit for partial months.
      </p>
      <p>
        If you're a consumer in the EU, EEA or UK, you can withdraw from a new
        subscription within 14 days for a refund. If you start using your plan in that
        time, you ask us to begin right away, and we may keep a share of the
        payment for the days you used.
      </p>
      <LegalSubheading>Availability</LegalSubheading>
      <p>
        We work to keep Misty Cloud running and to protect your data, but we make
        no commitment about uptime, backups, or recovery. Except where the law
        requires otherwise, outages, data loss, and security incidents don&apos;t
        entitle you to a refund, credit, or other compensation. Sections 14 and
        15 apply to Misty Cloud.
      </p>
      <LegalSubheading>Failed payments and price changes</LegalSubheading>
      <p>
        If a payment fails, we email you and try again for 14 days, and you keep
        your plan meanwhile. If it's still unpaid after that, your account moves
        to the Free plan until you pay the amount due. If it stays unpaid, your
        subscription ends, as described below.
      </p>
      <p>
        We may change the price or what a plan includes. We'll tell you at least
        30 days before a change applies to you, and it starts with your next
        billing month after that. If you don't agree, cancel before then.
      </p>
      <p>
        When your subscription ends, whether you cancelled or it went unpaid,
        your account moves to the Free plan and keeps its data. If you use more
        than Free allows, you can still open, download and delete what you
        have, but you can't add more until you're within its limits. Subscribing
        again restores your plan. To delete your account and its data, see our{" "}
        <LegalLink to="/privacy#retention">Privacy Policy</LegalLink>.
      </p>
    </>
  ),
};
