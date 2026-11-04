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
import { ACCOUNT_PORTAL_URL } from "@/lib/site";
import {
  changeSubscription,
  fetchSubscription,
  type SubscriptionState,
} from "../api";
import { customRowClass, ErrorRow, Row, Section } from "../components/SettingsRows";

const failed = "That didn't work. Try again in a few minutes.";

function longDate(value?: string) {
  if (!value) return "";
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** Misty Pro for this account: when it renews or ends, and cancelling it. */
export function SubscriptionPanel({ onClose }: { onClose: () => void }) {
  const [state, setState] = useState<SubscriptionState | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const [busy, setBusy] = useState<"cancel" | "resume" | "portal" | null>(null);
  const [error, setError] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);

  const load = useCallback(
    () => fetchSubscription().then(setState, () => setLoadFailed(true)),
    [],
  );

  useEffect(() => {
    void load();
  }, [load]);

  async function change(next: "cancel" | "resume") {
    setBusy(next);
    setError("");
    try {
      setState(await changeSubscription(next));
    } catch {
      setError(failed);
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
      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <DesktopSettingsRow label="You do not have an active subscription">
          <Button asChild variant="outline">
            <SiteLink to="/pricing" onClick={onClose}>
              See options
            </SiteLink>
          </Button>
        </DesktopSettingsRow>
      </div>
    );
  }

  const ends = longDate(state.current_period_end);
  const pastDue = state.status === "past_due" || state.status === "unpaid";

  return (
    <div className="grid gap-4">
      <Section title="Plan">
        <Row label="Plan">Misty Pro</Row>
        <Row label={state.cancel_at_period_end ? "Ends on" : "Renews on"}>{ends}</Row>
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
          <DesktopSettingsRow label="Keep Misty Pro after this month">
            <Button
              type="button"
              variant="outline"
              disabled={busy !== null}
              aria-busy={busy === "resume"}
              onClick={() => void change("resume")}
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

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Misty Pro?</AlertDialogTitle>
            <AlertDialogDescription>
              You keep Misty Pro until {ends}. After that your account is read-only for 30 days so
              you can export your data from the Misty app, and then it's deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Misty Pro</AlertDialogCancel>
            <AlertDialogAction onClick={() => void change("cancel")}>
              Cancel subscription
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
