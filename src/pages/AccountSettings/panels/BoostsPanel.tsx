import { Minus, Plus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router";

import { DesktopSettingsRow } from "@/components/settings";
import { SiteLink } from "@/components/SiteLink";
import {
  AlertDialog,
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
import { CLOUD_CHECKOUT_URL } from "@/lib/site";
import { boost, plans } from "@/pages/Pricing/plans";
import {
  assignBoosts,
  fetchSpaceBoosts,
  fetchSpaces,
  fetchSubscription,
  PlanChangeRefused,
  setBoughtBoosts,
  type SpaceBoostsState,
  type SpaceSummary,
  type SubscriptionState,
} from "../api";
import { failed, longDate, refusalMessages } from "../billingMessages";
import { levelLine } from "../boostText";
import { customRowClass, ErrorRow, Row, Section } from "../components/SettingsRows";

function Stepper({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="flex items-center gap-2" role="group" aria-label={label}>
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        aria-label={`Fewer ${label.toLowerCase()}`}
        disabled={value <= min}
        onClick={() => onChange(value - 1)}
      >
        <Minus aria-hidden="true" />
      </Button>
      <span className="w-6 text-center text-sm tabular-nums text-foreground" aria-live="polite">
        {value}
      </span>
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        aria-label={`More ${label.toLowerCase()}`}
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
      >
        <Plus aria-hidden="true" />
      </Button>
    </div>
  );
}

/**
 * The account's Boosts: Misty+'s included ones to give, and Boosts bought for each Space it's
 * in, with each Space's level. `?space=` (from the app's Boost button) opens that Space.
 */
export function BoostsPanel({ onClose }: { onClose: () => void }) {
  const [searchParams] = useSearchParams();
  const [subscription, setSubscription] = useState<SubscriptionState | null>(null);
  const [spaces, setSpaces] = useState<SpaceSummary[] | null>(null);
  const [levels, setLevels] = useState<Record<string, SpaceBoostsState>>({});
  const [loadFailed, setLoadFailed] = useState(false);
  const [editing, setEditing] = useState<string | null>(searchParams.get("space"));
  const [included, setIncluded] = useState(0);
  const [bought, setBought] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(
    () =>
      Promise.all([fetchSubscription(), fetchSpaces()])
        .then(async ([state, list]) => {
          setSubscription(state);
          setSpaces(list);
          // The Space the app asked for opens with what it has now.
          const asked = searchParams.get("space");
          if (asked) {
            setIncluded(state.boosts?.assigned.find((a) => a.space_id === asked)?.boosts ?? 0);
            setBought(state.boosts?.bought.find((b) => b.space_id === asked)?.quantity ?? 0);
          }
          const answers = await Promise.all(list.map((space) => fetchSpaceBoosts(space.id).catch(() => null)));
          const next: Record<string, SpaceBoostsState> = {};
          answers.forEach((answer) => {
            if (answer) next[answer.space_id] = answer;
          });
          setLevels(next);
        })
        .catch(() => setLoadFailed(true)),
    [searchParams],
  );

  useEffect(() => {
    void load();
  }, [load]);

  const boosts = subscription?.boosts;
  const includedTotal = boosts?.included ?? 0;
  const assignedHere = (spaceId: string) => boosts?.assigned.find((a) => a.space_id === spaceId)?.boosts ?? 0;
  const boughtHere = (spaceId: string) => boosts?.bought.find((b) => b.space_id === spaceId);
  const assignedTotal = boosts?.assigned.reduce((sum, a) => sum + a.boosts, 0) ?? 0;

  // Opening a Space's dialog starts from what it has now.
  function openSpace(spaceId: string) {
    setIncluded(assignedHere(spaceId));
    setBought(boughtHere(spaceId)?.quantity ?? 0);
    setError("");
    setEditing(spaceId);
  }

  async function save(spaceId: string) {
    setBusy(true);
    setError("");
    try {
      let state = subscription;
      if (included !== assignedHere(spaceId)) state = await assignBoosts(spaceId, included);
      const existing = boughtHere(spaceId);
      if (!existing && bought > 0) {
        postProofForm(CLOUD_CHECKOUT_URL, await fetchAccountProof(), {
          plan: "boost",
          space_id: spaceId,
          quantity: String(bought),
        });
        return; // Leaving for Stripe Checkout.
      }
      if (existing && bought !== existing.quantity) state = await setBoughtBoosts(spaceId, bought);
      setSubscription(state);
      setLevels({ ...levels, [spaceId]: await fetchSpaceBoosts(spaceId) });
      setEditing(null);
    } catch (err) {
      setError(err instanceof PlanChangeRefused ? refusalMessages[err.code] : failed);
    } finally {
      setBusy(false);
    }
  }

  if (loadFailed) {
    return (
      <Section title="Boosts">
        <ErrorRow
          title="Your Boosts are unavailable"
          message="Try again in a few minutes."
          onRetry={() => {
            setLoadFailed(false);
            void load();
          }}
        />
      </Section>
    );
  }

  if (!subscription || !spaces) {
    return (
      <Section title="Boosts">
        {[0, 1, 2].map((row) => (
          <div
            key={row}
            aria-hidden="true"
            className={`${customRowClass} flex min-h-14 items-center justify-between gap-8`}
          >
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-8 w-20" />
          </div>
        ))}
      </Section>
    );
  }

  const editingSpace = spaces.find((space) => space.id === editing) ?? null;
  const existing = editingSpace ? boughtHere(editingSpace.id) : undefined;
  const includedMax = editingSpace ? includedTotal - assignedTotal + assignedHere(editingSpace.id) : 0;
  const checkoutNext = editingSpace && !existing && bought > 0;

  return (
    <div className="grid gap-4">
      <Section title="Boosts">
        {includedTotal > 0 ? (
          <Row
            label={`Included with ${plans.plus.name}`}
            description={boosts?.next_move_at ? `Moved this week. You can move them again on ${longDate(boosts.next_move_at)}.` : undefined}
          >
            {`${assignedTotal} of ${includedTotal} given`}
          </Row>
        ) : (
          <DesktopSettingsRow label={`${plans.plus.name} comes with ${plans.plus.boosts} Boosts`}>
            <Button asChild variant="outline">
              <SiteLink to="/pricing" onClick={onClose}>
                See plans
              </SiteLink>
            </Button>
          </DesktopSettingsRow>
        )}
      </Section>

      <Section title="Your Spaces">
        {spaces.map((space) => {
          const mine = assignedHere(space.id) + (boughtHere(space.id)?.quantity ?? 0);
          return (
            <DesktopSettingsRow
              key={space.id}
              label={space.name}
              description={[levelLine(levels[space.id]), mine ? `${mine} from you` : ""].filter(Boolean).join(" · ")}
            >
              <Button type="button" variant="outline" disabled={busy} onClick={() => openSpace(space.id)}>
                Boost
              </Button>
            </DesktopSettingsRow>
          );
        })}
      </Section>

      <AlertDialog open={editingSpace !== null} onOpenChange={(open) => (open ? null : setEditing(null))}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Boost {editingSpace?.name}</AlertDialogTitle>
            <AlertDialogDescription>{levelLine(editingSpace ? levels[editingSpace.id] : undefined)}</AlertDialogDescription>
          </AlertDialogHeader>
          <div className="grid gap-3 py-1">
            {includedTotal > 0 ? (
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-foreground">
                  Included Boosts
                  <span className="block text-xs text-muted-foreground">{`${includedMax} available`}</span>
                </span>
                <Stepper label="Included Boosts" value={included} min={0} max={includedMax} onChange={setIncluded} />
              </div>
            ) : null}
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-foreground">
                Bought Boosts
                <span className="block text-xs text-muted-foreground">{`$${boost.price} a month each · $${bought * boost.price} a month`}</span>
              </span>
              <Stepper label="Bought Boosts" value={bought} min={0} max={50} onChange={setBought} />
            </div>
            {existing && bought !== existing.quantity ? (
              <p className="text-xs text-muted-foreground">
                {bought === 0
                  ? `These Boosts end on ${longDate(existing.current_period_end)}.`
                  : bought > existing.quantity
                    ? "Your card is charged for the rest of this month today."
                    : "What's left of this month is credited toward your next bills."}
              </p>
            ) : null}
            {error ? (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            ) : null}
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={busy}>Cancel</AlertDialogCancel>
            <Button type="button" disabled={busy} aria-busy={busy} onClick={() => editingSpace && void save(editingSpace.id)}>
              {busy ? <Spinner aria-hidden="true" /> : null}
              {checkoutNext ? "Continue to payment" : "Save"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
