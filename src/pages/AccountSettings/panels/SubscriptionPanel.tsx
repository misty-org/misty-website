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
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { fetchAccountProof, postProofForm } from "@/lib/accountProof";
import { ACCOUNT_PORTAL_URL, BOOSTS_SETTINGS_PATH } from "@/lib/site";
import { plans } from "@/pages/Pricing/plans";
import {
  changePlan,
  changeSubscription,
  fetchSubscription,
  PlanChangeRefused,
  type SubscriptionState,
} from "../api";
import { failed, longDate, refusalMessages } from "../billingMessages";
import { customRowClass, ErrorRow, Row, Section } from "../components/SettingsRows";

const plusAllowance = `${plans.plus.storage} of storage · ${plans.plus.upload} files · ${plans.plus.boosts} Boosts`;

/** This account's plan: Free, or Misty+ with when it renews or ends, its billing period and cancelling. */
export function SubscriptionPanel({ onClose }: { onClose: () => void }) {
  const [state, setState] = useState<SubscriptionState | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const [busy, setBusy] = useState<"cancel" | "resume" | "portal" | "plan" | null>(null);
  const [error, setError] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [switchOpen, setSwitchOpen] = useState(false);

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
        {[0, 1, 2].map((row) => (
          <div
            key={row}
            aria-hidden="true"
            className={`${customRowClass} flex min-h-14 items-center justify-between gap-8`}
          >
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-8 w-24" />
          </div>
        ))}
      </Section>
    );
  }

  if (!state.subscribed) {
    return (
      <Section title="Plan">
        <Row label="Plan">{plans.free.name}</Row>
        <Row label="Includes">{`${plans.free.storage} of storage`}</Row>
        <DesktopSettingsRow label={`${plans.plus.name}: ${plusAllowance}`}>
          <Button asChild variant="outline">
            <SiteLink to="/pricing" onClick={onClose}>
              See plans
            </SiteLink>
          </Button>
        </DesktopSettingsRow>
      </Section>
    );
  }

  const yearly = state.interval === "year";
  const ends = longDate(state.current_period_end);
  const pastDue = state.status === "past_due" || state.status === "unpaid";

  return (
    <div className="grid gap-4">
      <Section title="Plan">
        <Row label="Plan">{plans.plus.name}</Row>
        <Row label="Includes">{plusAllowance}</Row>
        <Row label="Billing">{yearly ? `$${plans.plus.yearly} a year` : `$${plans.plus.monthly} a month`}</Row>
        <Row label={state.cancel_at_period_end ? "Ends on" : "Renews on"}>{ends}</Row>
        <DesktopSettingsRow label={yearly ? `Monthly: $${plans.plus.monthly} a month` : `Yearly: $${plans.plus.yearly} a year, 3 months free`}>
          <Button
            type="button"
            variant="outline"
            disabled={busy !== null || pastDue}
            aria-busy={busy === "plan"}
            onClick={() => setSwitchOpen(true)}
          >
            {busy === "plan" ? <Spinner aria-hidden="true" /> : null}
            {yearly ? "Switch to monthly" : "Switch to yearly"}
          </Button>
        </DesktopSettingsRow>
        <DesktopSettingsRow label="Included Boosts">
          <Button asChild variant="outline">
            <SiteLink to={BOOSTS_SETTINGS_PATH}>Give Boosts</SiteLink>
          </Button>
        </DesktopSettingsRow>
        <DesktopSettingsRow label={pastDue ? "Your last payment failed" : "Card and invoices"}>
          <Button
            type="button"
            variant="outline"
            disabled={busy !== null}
            aria-busy={busy === "portal"}
            onClick={() => void openPortal()}
          >
            {busy === "portal" ? <Spinner aria-hidden="true" /> : null}
            {pastDue ? "Update card" : "Manage"}
          </Button>
        </DesktopSettingsRow>
        {state.cancel_at_period_end ? (
          <DesktopSettingsRow label={`Keep ${plans.plus.name} after this period`}>
            <Button
              type="button"
              variant="outline"
              disabled={busy !== null}
              aria-busy={busy === "resume"}
              onClick={() => void run("resume", () => changeSubscription("resume"))}
            >
              {busy === "resume" ? <Spinner aria-hidden="true" /> : null}
              Keep subscription
            </Button>
          </DesktopSettingsRow>
        ) : (
          <DesktopSettingsRow label="Cancel subscription">
            <Button
              type="button"
              variant="outline"
              disabled={busy !== null}
              aria-busy={busy === "cancel"}
              onClick={() => setConfirmOpen(true)}
            >
              {busy === "cancel" ? <Spinner aria-hidden="true" /> : null}
              Cancel
            </Button>
          </DesktopSettingsRow>
        )}
      </Section>

      {error ? (
        <p role="alert" className="px-1 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <AlertDialog open={switchOpen} onOpenChange={setSwitchOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{yearly ? "Switch to monthly?" : "Switch to yearly?"}</AlertDialogTitle>
            <AlertDialogDescription>
              {yearly
                ? `You'll pay $${plans.plus.monthly} a month from now on. What's left of your year is credited toward those bills.`
                : `You'll pay $${plans.plus.yearly} for the year today, less what's left of this month, then $${plans.plus.yearly} each year.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep {yearly ? "yearly" : "monthly"}</AlertDialogCancel>
            <AlertDialogAction onClick={() => void run("plan", () => changePlan(yearly ? "plus" : "plus_yearly"))}>
              {yearly ? "Switch to monthly" : "Switch to yearly"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel {plans.plus.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              You keep {plans.plus.name} until {ends}. Then your account moves to Free, with{" "}
              {plans.free.storage} of storage, and your included Boosts leave their Spaces. Nothing is
              deleted: if you're over, you can still open, download and delete everything, but you
              can't add more until you're under.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep {plans.plus.name}</AlertDialogCancel>
            <AlertDialogAction onClick={() => void run("cancel", () => changeSubscription("cancel"))}>
              Cancel subscription
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
