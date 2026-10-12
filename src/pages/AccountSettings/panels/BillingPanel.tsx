import { Button } from "@/components/ui/button";
import { formatStatus } from "@/lib/format";
import { PRICING_MODEL } from "@/pages/Pricing/data";
import {
  createBillingPortal,
  createSubscriptionCheckout,
  type BillingUsageResponse,
  type MeResponse,
} from "../api";
import { TIER_LABEL } from "../components/accountTone";
import {
  customRowClass,
  ErrorRow,
  LoadingRow,
  Row,
  Section,
} from "../components/SettingsRows";

/**
 * The server returns these period dates as nullable timestamps — a trial with no
 * recorded end, a subscription mid-transition. `new Date(null)` yields an
 * Invalid Date and renders as literal "Invalid Date", so guard first.
 */
function formatDateOrDash(value: string | null | undefined): string {
  if (!value) return "—";
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? "—" : parsed.toLocaleDateString();
}

function PlanRows({
  me,
  usage,
}: {
  me: MeResponse;
  usage: BillingUsageResponse | null;
}) {
  const plan = usage?.plan ?? me.tier;
  const trial = usage?.trial;
  const subscription = usage?.subscription;

  return (
    <>
      <Row label="Plan">{TIER_LABEL[plan] ?? plan}</Row>
      {trial ? (
        <>
          <Row label="Trial status">{formatStatus(trial.status)}</Row>
          <Row label="Trial ends">{formatDateOrDash(trial.ends_at)}</Row>
        </>
      ) : subscription ? (
        <>
          <Row label="Subscription status">
            {subscription.cancel_at_period_end
              ? "Cancellation scheduled"
              : formatStatus(subscription.status)}
          </Row>
          <Row label="Billing interval">
            {subscription.billing_interval === "year" ? "Yearly" : "Monthly"}
          </Row>
          <Row
            label={
              subscription.cancel_at_period_end ? "Access until" : "Renews"
            }
          >
            {formatDateOrDash(subscription.current_period_end)}
          </Row>
        </>
      ) : (
        <Row label="Status">{formatStatus(me.status)}</Row>
      )}
    </>
  );
}

function UpgradeOffer({
  disabled,
  onBillingAction,
}: {
  disabled: boolean;
  onBillingAction: (action: () => Promise<{ url: string }>) => void;
}) {
  return (
    <div className={`${customRowClass} grid gap-3`}>
      <p className="m-0 text-sm font-medium text-foreground">
        Pro adds {PRICING_MODEL.pro.agentUsage.toLowerCase()} and{" "}
        {PRICING_MODEL.pro.storage} of storage. Max, Ultra and Ultra+ go further.
      </p>
      <p className="m-0 text-sm leading-6 text-muted-foreground">
        Basic keeps every feature for free. There are no automatic overages or
        surprise charges.
      </p>
      <p className="m-0 text-xs leading-5 text-muted-foreground">
        Pro is {PRICING_MODEL.pro.monthlyPrice}/month or{" "}
        {PRICING_MODEL.pro.yearlyPrice}/year plus applicable tax and renews
        automatically until you cancel. Cancel anytime here in Billing.
        Non-refundable except as described in our{" "}
        <a
          href="/refunds"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-4"
        >
          Refund Policy
        </a>
        .
      </p>
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          disabled={disabled}
          onClick={() =>
            onBillingAction(() => createSubscriptionCheckout("pro", "month"))
          }
        >
          Subscribe monthly · {PRICING_MODEL.pro.monthlyPrice}/mo
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          onClick={() =>
            onBillingAction(() => createSubscriptionCheckout("pro", "year"))
          }
        >
          Subscribe yearly · {PRICING_MODEL.pro.yearlyPrice}/yr
        </Button>
        <Button asChild variant="outline">
          <a href="/pricing">Compare all plans</a>
        </Button>
      </div>
    </div>
  );
}

export function BillingPanel({
  me,
  usage,
  loading,
  loadError,
  billingWorking,
  billingError,
  onBillingAction,
}: {
  me: MeResponse | null;
  usage: BillingUsageResponse | null;
  loading: boolean;
  loadError: string;
  billingWorking: boolean;
  billingError: string;
  onBillingAction: (action: () => Promise<{ url: string }>) => void;
}) {
  const plan = usage?.plan ?? me?.tier;
  const trial = usage?.trial;
  const subscription = usage?.subscription;
  const canManageBilling =
    Boolean(me?.billing?.customer_portal_available) &&
    (me?.billing?.kind === "subscription" || me?.billing?.kind === "trial");

  return (
    <div>
      <Section
        title="Plan details"
        description="Your current Misty plan and renewal status."
      >
        {loading && !me ? <LoadingRow label="Loading plan details" /> : null}

        {loadError && !me ? (
          <ErrorRow title="Plan details are unavailable" message={loadError} />
        ) : null}

        {me ? <PlanRows me={me} usage={usage} /> : null}
      </Section>

      <Section
        title="Subscription"
        description="Change your plan or manage payment details."
      >
        {canManageBilling ? (
          <>
            <Row label="Current plan">
              {trial
                ? "Pro trial"
                : `${TIER_LABEL[plan ?? "pro"]} · ${subscription?.billing_interval === "year" || me?.billing?.interval === "year" ? "yearly" : "monthly"}`}
            </Row>
            <div className={customRowClass}>
              <Button
                type="button"
                disabled={billingWorking}
                onClick={() => onBillingAction(createBillingPortal)}
              >
                Manage billing
              </Button>
            </div>
          </>
        ) : (
          <UpgradeOffer
            disabled={billingWorking}
            onBillingAction={onBillingAction}
          />
        )}

        {billingError ? (
          <ErrorRow
            title="Billing is temporarily unavailable"
            message={billingError}
          />
        ) : null}
      </Section>
    </div>
  );
}
