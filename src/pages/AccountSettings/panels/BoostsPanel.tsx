import { Minus, Plus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router";

import { DesktopSettingsRow } from "@/components/settings";
import { BillingToggle } from "@/components/BillingToggle";
import { SiteLink } from "@/components/SiteLink";
import {
  Button,
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  FieldError,
  IconButton,
  SkeletonList,
  Text,
} from "@misty/ui";
import { fetchAccountProof, postProofForm } from "@/lib/account_proof";
import { CLOUD_CHECKOUT_URL } from "@/lib/site";
import { boost, plans, yearlySaving } from "@/pages/Pricing/plans";
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
import { failed, longDate, refusalMessages } from "../billing_messages";
import { levelLine } from "../boost_text";
import { ErrorRow, Row, Section } from "../components/SettingsRows";

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
      <IconButton
        variant="secondary"
        label={`Fewer ${label.toLowerCase()}`}
        disabled={value <= min}
        onClick={() => onChange(value - 1)}
      >
        <Minus aria-hidden="true" />
      </IconButton>
      <Text bare size="control" className="w-6 text-center tabular-nums" aria-live="polite">
        {value}
      </Text>
      <IconButton
        variant="secondary"
        label={`More ${label.toLowerCase()}`}
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
      >
        <Plus aria-hidden="true" />
      </IconButton>
    </div>
  );
}

export function BoostsPanel({ onClose }: { onClose: () => void }) {
  const [searchParams] = useSearchParams();
  const [subscription, setSubscription] = useState<SubscriptionState | null>(null);
  const [spaces, setSpaces] = useState<SpaceSummary[] | null>(null);
  const [levels, setLevels] = useState<Record<string, SpaceBoostsState>>({});
  const [loadFailed, setLoadFailed] = useState(false);
  const [editing, setEditing] = useState<string | null>(searchParams.get("space"));
  const [included, setIncluded] = useState(0);
  const [bought, setBought] = useState(0);
  const [yearly, setYearly] = useState(searchParams.get("billing") === "yearly");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(
    () =>
      Promise.all([fetchSubscription(), fetchSpaces()])
        .then(async ([state, list]) => {
          setSubscription(state);
          setSpaces(list);
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
          plan: yearly ? "boost_yearly" : "boost",
          space_id: spaceId,
          quantity: String(bought),
        });
        return;
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
        <SkeletonList
          label="Your Boosts"
          variant="settings"
          rows={3}
          trailing="button"
          rowClassName="px-5"
        />
      </Section>
    );
  }

  const editingSpace = spaces.find((space) => space.id === editing) ?? null;
  const existing = editingSpace ? boughtHere(editingSpace.id) : undefined;
  const includedMax = editingSpace ? includedTotal - assignedTotal + assignedHere(editingSpace.id) : 0;
  const checkoutNext = editingSpace && !existing && bought > 0;
  const billedYearly = existing ? existing.interval === "year" : yearly;
  const each = billedYearly ? boost.yearly : boost.price;
  const per = billedYearly ? "year" : "month";

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
            <Button asChild>
              <SiteLink to="/pricing" onClick={onClose}>
                See plans
              </SiteLink>
            </Button>
          </DesktopSettingsRow>
        )}
      </Section>

      <Section title="Your spaces">
        {spaces.map((space) => {
          const mine = assignedHere(space.id) + (boughtHere(space.id)?.quantity ?? 0);
          return (
            <DesktopSettingsRow
              key={space.id}
              label={space.name}
              description={[levelLine(levels[space.id]), mine ? `${mine} from you` : ""].filter(Boolean).join(", ")}
            >
              <Button disabled={busy} onClick={() => openSpace(space.id)}>
                Boost
              </Button>
            </DesktopSettingsRow>
          );
        })}
      </Section>

      <Dialog open={editingSpace !== null} onOpenChange={(open) => (open ? null : setEditing(null))}>
        <DialogContent size="sm">
          <DialogHeader>
            <DialogTitle>Boost {editingSpace?.name}</DialogTitle>
            <DialogDescription>{levelLine(editingSpace ? levels[editingSpace.id] : undefined)}</DialogDescription>
          </DialogHeader>
          <DialogBody className="grid gap-3 py-1">
            {includedTotal > 0 ? (
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <Text size="control">Included Boosts</Text>
                  <Text size="meta" tone="muted">{`${includedMax} available`}</Text>
                </div>
                <Stepper label="Included Boosts" value={included} min={0} max={includedMax} onChange={setIncluded} />
              </div>
            ) : null}
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <Text size="control">Bought Boosts</Text>
                <Text size="meta" tone="muted">{`$${each} a ${per} each, $${bought * each} a ${per} in all`}</Text>
              </div>
              <Stepper label="Bought Boosts" value={bought} min={0} max={50} onChange={setBought} />
            </div>
            {checkoutNext ? (
              <BillingToggle
                label="Boost billing period"
                saving={yearlySaving(boost.price, boost.yearly)}
                yearly={yearly}
                onChange={setYearly}
              />
            ) : null}
            {existing && bought !== existing.quantity ? (
              <Text wrap size="meta" tone="muted">
                {bought === 0
                  ? `These Boosts end on ${longDate(existing.current_period_end)}.`
                  : bought > existing.quantity
                    ? `Your card is charged for the rest of this ${per} today.`
                    : `What's left of this ${per} is credited toward your next bills.`}
              </Text>
            ) : null}
            {error ? <FieldError message={<span role="alert">{error}</span>} /> : null}
          </DialogBody>
          <DialogFooter>
            <Button variant="quiet" size="lg" disabled={busy} onClick={() => setEditing(null)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="lg"
              disabled={busy}
              aria-busy={busy}
              onClick={() => editingSpace && void save(editingSpace.id)}
            >
              {checkoutNext ? "Continue to payment" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
