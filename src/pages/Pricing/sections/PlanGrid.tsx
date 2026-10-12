import { useState } from "react";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import IntervalToggle from "../components/IntervalToggle";
import PricingCard from "../components/PricingCard";
import RenewalDisclosure from "../components/RenewalDisclosure";
import { plans, type CustomerPlanId, type PaidTier, type PricingInterval } from "../data";
import { planFeatureList } from "../planFeatures";

/** Three cards: Basic alone, then Pro and Max sharing one card, and Ultra and Ultra+ another. */
const PLAN_GROUPS: CustomerPlanId[][] = [["free"], ["pro", "max"], ["ultra", "ultra_plus"]];

const tabClass =
  "h-7 min-w-0 rounded-[5px] px-2.5 text-[13px] text-muted-foreground data-[state=on]:bg-background data-[state=on]:text-foreground data-[state=on]:shadow-xs";

export default function PlanGrid({
  interval,
  checkoutPendingTier,
  checkoutError,
  checkoutReady,
  currentPlanTier,
  currentPlanInterval,
  hasManagedSubscription,
  onIntervalChange,
  onPaidCheckout,
}: {
  interval: PricingInterval;
  checkoutPendingTier: PaidTier | null;
  checkoutError: string;
  checkoutReady: boolean;
  currentPlanTier: PaidTier | null;
  currentPlanInterval: PricingInterval | null;
  hasManagedSubscription: boolean;
  onIntervalChange: (interval: PricingInterval) => void;
  onPaidCheckout: (tier: PaidTier) => void;
}) {
  // A card opens on the visitor's current tier when it holds it, otherwise on its first tier.
  const [picked, setPicked] = useState<Partial<Record<number, CustomerPlanId>>>({});
  const selectedIn = (group: CustomerPlanId[], groupIndex: number) =>
    picked[groupIndex] ??
    group.find((id) => id === currentPlanTier) ??
    group[0];

  return (
    <section aria-labelledby="plans-heading" className="pt-10 sm:pt-12">
      <h2 id="plans-heading" className="sr-only">
        Plans
      </h2>
      <IntervalToggle interval={interval} onChange={onIntervalChange} />

      <div className="mx-auto mb-12 grid max-w-5xl grid-cols-1 items-stretch gap-4 pt-3 md:grid-cols-3">
        {PLAN_GROUPS.map((group, groupIndex) => {
          const selected = selectedIn(group, groupIndex);
          const index = plans.findIndex((plan) => plan.id === selected);
          const plan = plans[index];
          const { inheritsFrom, features } = planFeatureList(index);
          const paidTier = plan.id === "free" ? null : plan.id;
          const isCurrentPlan =
            paidTier !== null && paidTier === currentPlanTier;
          const managesCurrentSubscription =
            isCurrentPlan && hasManagedSubscription &&
            (!currentPlanInterval || currentPlanInterval === interval);
          const changesManagedSubscription =
            paidTier !== null &&
            hasManagedSubscription &&
            !managesCurrentSubscription;
          return (
            <PricingCard
              key={group.join("-")}
              name={plan.name}
              price={plan.prices[interval].price}
              period={plan.prices[interval].period}
              billingNote={plan.prices[interval].billingNote}
              features={features}
              inheritsFrom={inheritsFrom}
              ctaHref={plan.id === "free" ? "/register" : undefined}
              ctaLabel={
                plan.id === "free"
                  ? "Get started free"
                  : managesCurrentSubscription
                    ? "Manage subscription"
                    : changesManagedSubscription
                      ? `Change to ${plan.name}${isCurrentPlan ? (interval === "year" ? " yearly" : " monthly") : ""}`
                      : isCurrentPlan
                        ? "Current plan"
                        : `Choose ${plan.name}`
              }
              ctaNote={
                paidTier && !managesCurrentSubscription ? (
                  <RenewalDisclosure tier={paidTier} interval={interval} />
                ) : undefined
              }
              ctaBusy={paidTier === checkoutPendingTier}
              ctaDisabled={
                paidTier !== null &&
                (!checkoutReady ||
                  checkoutPendingTier !== null ||
                  (isCurrentPlan && !hasManagedSubscription))
              }
              onCtaClick={
                paidTier ? () => onPaidCheckout(paidTier) : undefined
              }
              popular={plan.id === "pro"}
              tabs={
                group.length > 1 ? (
                  <ToggleGroup
                    type="single"
                    value={selected}
                    onValueChange={(value) => {
                      if (value) setPicked((current) => ({ ...current, [groupIndex]: value as CustomerPlanId }));
                    }}
                    spacing={1}
                    className="rounded-[7px] border border-border bg-muted/60 p-0.5"
                    aria-label={`${group.map((id) => plans.find((p) => p.id === id)!.name).join(" or ")} plan`}
                  >
                    {group.map((id) => (
                      <ToggleGroupItem key={id} value={id} className={tabClass}>
                        {plans.find((p) => p.id === id)!.name}
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                ) : undefined
              }
            />
          );
        })}
      </div>
      {checkoutError ? (
        <p
          role="alert"
          className="mx-auto -mt-8 mb-12 max-w-6xl text-sm text-destructive"
        >
          {checkoutError}
        </p>
      ) : null}
    </section>
  );
}
