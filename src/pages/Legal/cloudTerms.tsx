import {
  LegalLink,
  LegalList,
  LegalSubheading,
  type LegalSectionDef,
} from "./LegalPage";

/**
 * The Pro subscription section of the Terms (section 3). Kept apart so
 * the Terms file stays readable.
 */
export const cloudTermsSection: LegalSectionDef = {
  id: "cloud",
  title: "Pro subscriptions",
  inShort:
    "Pro is a monthly subscription to a Misty server we run. We never charge for AI, and you can cancel at any time, effective at the end of the month you've paid for.",
  body: (
    <>
      <p>
        Pro is a Misty server that we run for paying customers. You
        don't need it to use Misty: the app, and running your own Misty server,
        are free.
      </p>
      <LegalSubheading>Payment and your account</LegalSubheading>
      <p>
        Pro is billed monthly in advance, in US dollars, through our
        payment processor, Stripe. Sales tax, VAT or GST is added where it
        applies, worked out by Stripe from your billing address. Your billing date is the day of the month you
        subscribed. When you subscribe, you authorize us to charge your payment
        method on each billing date until you cancel.
      </p>
      <p>
        Your payment adds Pro to the Misty account you were signed in
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
          "When you reach a limit, Pro refuses what would go over it, such as a new upload, until you make room. You can always open, download and delete what you have, and the rest of Misty keeps working.",
          "We never charge for AI. Misty hosts no model and doesn't supply model access: AI runs on the models and AI tools you choose, from your own computer, and you pay your provider directly.",
        ]}
      />
      <LegalSubheading>Cancelling and refunds</LegalSubheading>
      <p>
        You can cancel at any time in your account settings. Cancelling takes
        effect at the end of the billing month you've paid for, and you keep
        full access until then. Except where the law requires otherwise,
        payments aren't refundable and we don't give partial refunds or credit
        for partial months.
      </p>
      <p>
        If you're a consumer in the EU, EEA or UK, you can withdraw from a new
        subscription within 14 days for a refund. If you start using Pro in that
        time, you ask us to begin right away, and we may keep a share of the
        payment for the days you used.
      </p>
      <LegalSubheading>Availability</LegalSubheading>
      <p>
        We work to keep Pro running and to protect your data, but we make
        no commitment about uptime, backups, or recovery. Except where the law
        requires otherwise, outages, data loss, and security incidents don&apos;t
        entitle you to a refund, credit, or other compensation. Sections 14 and
        15 apply to Pro.
      </p>
      <LegalSubheading>Failed payments and price changes</LegalSubheading>
      <p>
        If a payment fails, we email you and try again for 14 days. If it's
        still unpaid after that, we suspend your account, which keeps your data
        but stops you signing in and using your Spaces on Pro. Paying the amount due lifts the
        suspension. If it stays unpaid, your subscription ends, as described
        below.
      </p>
      <p>
        We may change the price or what a plan includes. We'll tell you at least
        30 days before a change applies to you, and it starts with your next
        billing month after that. If you don't agree, cancel before then.
      </p>
      <p>
        When your subscription ends, whether you cancelled or it went unpaid,
        your account becomes read-only for 30 days so you can export your data
        from the Misty app.
        We email you when it ends and again before the deletion date. If you
        pay again before then, your account is restored. After 30 days we
        delete your account and its data as described in our{" "}
        <LegalLink to="/privacy#retention">Privacy Policy</LegalLink>.
      </p>
    </>
  ),
};
