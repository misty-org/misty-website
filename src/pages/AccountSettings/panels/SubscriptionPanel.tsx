import { useCallback, useEffect, useState } from "react";

import { DesktopSettingsRow } from "@/components/settings";
import { SiteLink } from "@/components/SiteLink";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Button,
  FieldError,
  OptionSelect,
  SkeletonList,
} from "@misty/ui";
import { fetchAccountProof, postProofForm } from "@/lib/account_proof";
import { ACCOUNT_PORTAL_URL } from "@/lib/site";
import {
  checkoutPlan,
  checkoutPlans,
  isCheckoutPlan,
  plans,
  type CheckoutPlan,
  type PaidPlanId,
} from "@/pages/Pricing/plans";
import {
  changePlan,
  changeSubscription,
  fetchSubscription,
  PlanChangeRefused,
  type SubscriptionState,
} from "../api";
import { failed, longDate, refusalMessages } from "../billing_messages";
import { ErrorRow, Row, Section } from "../components/SettingsRows";

function choiceOf(choice: CheckoutPlan): { plan: PaidPlanId; yearly: boolean } {
  return { plan: choice.startsWith("max") ? "max" : "pro", yearly: choice.endsWith("_yearly") };
}

function priceLine(plan: PaidPlanId, yearly: boolean): string {
  return yearly ? `$${plans[plan].yearly} a year` : `$${plans[plan].monthly} a month`;
}

function choiceLabel(choice: CheckoutPlan): string {
  const { plan, yearly } = choiceOf(choice);
  return `${plans[plan].name}, ${priceLine(plan, yearly)}`;
}

const planOptions = checkoutPlans.map((choice) => ({ value: choice, label: choiceLabel(choice) }));

function switchDescription(from: CheckoutPlan, to: CheckoutPlan): string {
  const now = choiceOf(from);
  const next = choiceOf(to);
  const { name, storage } = plans[next.plan];
  if (now.plan === next.plan) {
    return next.yearly
      ? `You'll pay $${plans[next.plan].yearly} for the year today, less what's left of this month, then $${plans[next.plan].yearly} each year.`
      : `You'll pay $${plans[next.plan].monthly} a month from now on. What's left of your year is credited toward those bills.`;
  }
  const smaller = next.plan === "pro";
  return [
    `You move to ${name}, with ${storage} of storage, right away, and pay ${priceLine(next.plan, next.yearly)} from now on. What's left of the period you've paid for counts toward it.`,
    smaller
      ? `Nothing is deleted: if you're over ${storage}, you can still open, download and delete everything, but you can't add more until you're under.`
      : "",
  ]
    .filter(Boolean)
    .join(" ");
}

export function SubscriptionPanel({ onClose }: { onClose: () => void }) {
  const [state, setState] = useState<SubscriptionState | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const [busy, setBusy] = useState<"cancel" | "resume" | "portal" | "plan" | null>(null);
  const [error, setError] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [switchOpen, setSwitchOpen] = useState(false);
  const [switchTo, setSwitchTo] = useState<CheckoutPlan | null>(null);

  const load = useCallback(
    () => fetchSubscription().then(setState, () => setLoadFailed(true)),
    [],
  );

  useEffect(() => {
    void load();
  }, [load]);

  async function run(next: "cancel" | "resume" | "plan", change: () => Promise<SubscriptionState>) {
    setBusy(next);
    setError("");
    try {
      setState(await change());
    } catch (err) {
      setError(err instanceof PlanChangeRefused ? refusalMessages[err.code] : failed);
    } finally {
      setBusy(null);
    }
  }

  async function openPortal() {
    setBusy("portal");
    setError("");
    try {
      postProofForm(ACCOUNT_PORTAL_URL, await fetchAccountProof());
    } catch {
      setBusy(null);
      setError(failed);
    }
  }

  if (loadFailed) {
    return (
      <Section title="Plan">
        <ErrorRow
          title="Your subscription is unavailable"
          message="Try again in a few minutes."
          onRetry={() => {
            setLoadFailed(false);
            void load();
          }}
        />
      </Section>
    );
  }

  if (!state) {
    return (
      <Section title="Plan">
        <SkeletonList
          label="Your plan"
          variant="settings"
          rows={3}
          trailing="button"
          rowClassName="px-5"
        />
      </Section>
    );
  }

  if (!state.subscribed) {
    return (
      <Section title="Plan">
        <Row label="Plan">{plans.free.name}</Row>
        <Row label="Includes">{`${plans.free.storage} of storage`}</Row>
        <DesktopSettingsRow
          label={`More storage: ${plans.pro.storage} with ${plans.pro.name}, ${plans.max.storage} with ${plans.max.name}`}
        >
          <Button asChild>
            <SiteLink to="/pricing" onClick={onClose}>
              See plans
            </SiteLink>
          </Button>
        </DesktopSettingsRow>
      </Section>
    );
  }

  const plan: PaidPlanId = state.plan === "max" ? "max" : "pro";
  const yearly = state.interval === "year";
  const current = checkoutPlan(plan, yearly);
  const { name, storage } = plans[plan];
  const ends = longDate(state.current_period_end);
  const pastDue = state.status === "past_due" || state.status === "unpaid";

  return (
    <div className="grid gap-4">
      <Section title="Plan">
        <Row label="Plan">{`${name}, ${yearly ? "yearly" : "monthly"}`}</Row>
        <Row label="Includes">{`${storage} of storage`}</Row>
        <Row label="Billing">{priceLine(plan, yearly)}</Row>
        <Row label={state.cancel_at_period_end ? "Ends on" : "Renews on"}>{ends}</Row>
        <DesktopSettingsRow label="Change plan">
          <OptionSelect
            aria-label="Change plan"
            className="w-56"
            value={current}
            options={planOptions}
            disabled={busy !== null || pastDue}
            onValueChange={(value) => {
              if (!isCheckoutPlan(value) || value === current) return;
              setSwitchTo(value);
              setSwitchOpen(true);
            }}
          />
        </DesktopSettingsRow>
        <DesktopSettingsRow label={pastDue ? "Your last payment failed" : "Card and invoices"}>
          <Button
            disabled={busy !== null}
            aria-busy={busy === "portal"}
            onClick={() => void openPortal()}
          >
            {pastDue ? "Update card" : "Manage"}
          </Button>
        </DesktopSettingsRow>
        {state.cancel_at_period_end ? (
          <DesktopSettingsRow label={`Keep ${name} after this period`}>
            <Button
              disabled={busy !== null}
              aria-busy={busy === "resume"}
              onClick={() => void run("resume", () => changeSubscription("resume"))}
            >
              Keep subscription
            </Button>
          </DesktopSettingsRow>
        ) : (
          <DesktopSettingsRow label="Cancel subscription">
            <Button
              disabled={busy !== null}
              aria-busy={busy === "cancel"}
              onClick={() => setConfirmOpen(true)}
            >
              Cancel
            </Button>
          </DesktopSettingsRow>
        )}
      </Section>

      {error ? (
        <FieldError message={<span role="alert">{error}</span>} className="px-1" />
      ) : null}

      <AlertDialog open={switchOpen} onOpenChange={setSwitchOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {switchTo ? `Switch to ${choiceLabel(switchTo)}?` : null}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {switchTo ? switchDescription(current, switchTo) : null}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep current plan</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (switchTo) void run("plan", () => changePlan(switchTo));
              }}
            >
              Switch plan
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel {name}?</AlertDialogTitle>
            <AlertDialogDescription>
              You keep {name} until {ends}. Then your account moves to Free, with{" "}
              {plans.free.storage} of storage. Nothing is deleted: if you're over, you can still
              open, download and delete everything, but you can't add more until you're under.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep {name}</AlertDialogCancel>
            <AlertDialogAction onClick={() => void run("cancel", () => changeSubscription("cancel"))}>
              Cancel subscription
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
