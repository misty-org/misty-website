import { PRICING_MODEL } from "@/pages/Pricing/data";
import LegalPage, {
  LegalEmail,
  LegalLink,
  LegalList,
  type LegalSectionDef,
} from "./LegalPage";
import { legalInfo } from "./legalInfo";

const { supportEmail } = legalInfo;

const sections: LegalSectionDef[] = [
  {
    id: "cancel",
    title: "How to cancel",
    inShort: "Account Settings → Billing → Manage billing. It takes a minute.",
    body: (
      <>
        <p>
          Sign in, open Account Settings → Billing, and choose Manage billing.
          Then cancel in the Stripe billing portal. You can also
          email <LegalEmail address={supportEmail} /> from your account email
          and we will cancel for you.
        </p>
        <p>
          When you cancel, renewal stops, and you keep your paid features until
          the end of the period you've already paid for. After that, your
          account moves to the free Basic plan. Your content stays, subject to
          the Basic plan's limits (see{" "}
          <LegalLink to="/terms#limits">Terms, section 11</LegalLink>).
        </p>
      </>
    ),
  },
  {
    id: "trials",
    title: "Free trials",
    inShort: "Paid plans have no trial, because Basic is free forever.",
    body: (
      <p>
        Paid plans do not include a free trial. Basic is free with every
        feature, so you can use Misty for as long as you like before choosing{" "}
        {PRICING_MODEL.pro.name} or a larger plan. Subscriptions started during
        an earlier trial offer keep the terms they were sold with.
      </p>
    ),
  },
  {
    id: "refund-policy",
    title: "Refunds",
    inShort:
      "Payments are generally non-refundable, but we'll make it right if Misty clearly didn't work for you.",
    body: (
      <>
        <p>
          Subscription payments are non-refundable. We don't give refunds or
          credits for partial billing periods, unused time, unused AI usage or
          storage, or for forgetting to cancel, except in these cases:
        </p>
        <LegalList
          items={[
            <>
              <strong className="font-medium text-foreground">
                Misty didn't work.
              </strong>{" "}
              A core part of your paid plan clearly didn't work for you, you
              told us about it, and we couldn't fix it within a reasonable time.
            </>,
            <>
              <strong className="font-medium text-foreground">
                Billing mistakes.
              </strong>{" "}
              You were charged twice, charged the wrong amount, or charged after
              you canceled.
            </>,
            <>
              <strong className="font-medium text-foreground">
                Required by law.
              </strong>{" "}
              Including the 14-day right of withdrawal described below.
            </>,
            <>
              <strong className="font-medium text-foreground">
                Other compelling reasons,
              </strong>{" "}
              at our discretion. A refund in one case doesn't mean we'll give
              one in another.
            </>,
          ]}
        />
        <p>
          To ask for a refund, email <LegalEmail address={supportEmail} /> from
          your account email within 30 days of the charge. Tell us what happened
          and which charge it was. Approved refunds go back to the original
          payment method, usually within 5 to 10 business days. A refunded
          subscription is canceled.
        </p>
      </>
    ),
  },
  {
    id: "withdrawal",
    title: "EU, EEA, UK, and Swiss customers",
    inShort:
      "You can withdraw within 14 days of your first purchase for a refund.",
    body: (
      <>
        <p>
          If you are a consumer in the EU, EEA, UK, or Switzerland, you have the
          right to withdraw from your subscription within 14 days of your first
          paid purchase, without giving a reason. To do this, email{" "}
          <LegalEmail address={supportEmail} /> with a clear statement that you
          are withdrawing, for example: "I am withdrawing from my Misty
          subscription purchased on [date]."
        </p>
        <p>
          We will refund the payment within 14 days of receiving your request,
          using the original payment method, and cancel the subscription.
          Because you start using Misty right away, the law allows us to keep an
          amount for the days you used before withdrawing. To keep things
          simple, we give a full refund instead.
        </p>
        <p>
          This right applies to your first purchase of a subscription. It
          doesn't apply to later renewals.
        </p>
      </>
    ),
  },
  {
    id: "failed-payments",
    title: "Failed payments",
    inShort:
      "We'll retry and email you. If payment can't be collected, your account moves to Basic.",
    body: (
      <p>
        If a renewal payment fails, Stripe retries it over the following days,
        and we email you so you can update your card in Account Settings →
        Billing. If we still can't collect payment, the subscription is canceled
        and your account moves to the free Basic plan. No content is deleted
        when this happens.
      </p>
    ),
  },
  {
    id: "chargebacks",
    title: "Chargebacks",
    body: (
      <p>
        Please contact us before disputing a charge with your bank. We usually
        reply within a few business days and are happy to fix genuine problems.
        If you dispute a valid charge, we may suspend the account while the
        dispute is open.
      </p>
    ),
  },
  {
    id: "contact",
    title: "Contact",
    body: (
      <p>
        Billing questions: <LegalEmail address={supportEmail} />. This policy
        is part of our <LegalLink to="/terms">Terms of Service</LegalLink>.
      </p>
    ),
  },
];

export default function Refunds() {
  return (
    <LegalPage
      title="Refund & Cancellation Policy"
      summary="How to cancel a Misty subscription and when we give refunds."
      highlights={[
        "Cancel anytime in Account Settings → Billing. You keep paid features until the period ends.",
        "Cancel before a free trial ends and you won't be charged.",
        "Payments are non-refundable, except when Misty clearly didn't work, we made a billing mistake, or the law requires a refund.",
        "EU, EEA, UK, and Swiss customers can withdraw within 14 days of their first purchase.",
      ]}
      sections={sections}
    />
  );
}
