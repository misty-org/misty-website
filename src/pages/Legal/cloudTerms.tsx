import {
  LegalLink,
  LegalList,
  LegalSubheading,
  type LegalSectionDef,
} from "./LegalPage";

/**
 * The Misty Cloud subscription section of the Terms (section 3). Kept apart so
 * the Terms file stays readable.
 */
export const cloudTermsSection: LegalSectionDef = {
  id: "cloud",
  title: "Misty Cloud subscriptions",
  inShort:
    "Misty Cloud is a monthly subscription to a Misty server we run. We never charge for AI, and you can cancel at any time, effective at the end of the month you've paid for.",
  body: (
    <>
      <p>
        Misty Cloud is a Misty server that we run for paying customers. You
        don't need it to use Misty: the app, and running your own Misty server,
        are free.
      </p>
      <LegalSubheading>Payment and your account</LegalSubheading>
      <p>
        Misty Cloud is billed monthly in advance, in US dollars, through our
        payment processor, Stripe. Sales tax, VAT or GST is added where it
        applies, worked out by Stripe from your billing address. Storage add-ons
        are billed the same way. Your billing date is the day of the month you
        subscribed. When you subscribe, you authorize us to charge your payment
        method on each billing date until you cancel.
      </p>
      <p>
        Your payment creates your Misty Cloud account, and we email a setup link
        with a setup key to the address you paid with. Keep setup keys private:
        until it's used or expires, anyone who has one can use it to get into
        your account. You manage your subscription, payment method and invoices
        in Stripe's customer portal.
      </p>
      <LegalSubheading>What your plan includes</LegalSubheading>
      <LegalList
        items={[
          <>
            Your plan includes the storage, number of devices and app actions
            shown on our{" "}
            <LegalLink to="/pricing">pricing page</LegalLink> when you
            subscribe.
          </>,
          "App actions reset each month on your billing date and don't carry over.",
          "When you reach a limit, the features that need it stop until your next billing date or until you add capacity. You can always open, download and delete what you have, and the rest of Misty keeps working.",
          "We never charge for AI. Misty hosts no model and doesn't supply model access: AI runs on the models you choose, including Sign in with ChatGPT, called from your own device, and you pay your model provider directly.",
        ]}
      />
      <LegalSubheading>Cancelling and refunds</LegalSubheading>
      <p>
        You can cancel at any time in Stripe's customer portal. Cancelling takes
        effect at the end of the billing month you've paid for, and you keep
        full access until then. Except where the law requires otherwise,
        payments aren't refundable and we don't give partial refunds or credit
        for partial months.
      </p>
      <p>
        If you're a consumer in the EU, EEA or UK, you can withdraw from a new
        subscription within 14 days for a refund. If you start using Misty Cloud in that
        time, you ask us to begin right away, and we may keep a share of the
        payment for the days you used.
      </p>
      <LegalSubheading>Failed payments and price changes</LegalSubheading>
      <p>
        If a payment fails, we email you and try again for 14 days. If it's
        still unpaid after that, we suspend your account, which keeps your data but
        stops sync and the tools agents use. Paying the amount due lifts the
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
        your account becomes read-only for 30 days so you can export your data.
        We email you when it ends and again before the deletion date. If you
        pay again before then, your account is restored. After 30 days we
        delete your account and its data as described in our{" "}
        <LegalLink to="/privacy#retention">Privacy Policy</LegalLink>.
      </p>
    </>
  ),
};
