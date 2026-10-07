import IntervalToggle from "../components/IntervalToggle";
import PricingCard from "../components/PricingCard";
import { plans, type PaidTier, type PricingInterval } from "../data";
import { planFeatureList } from "../planFeatures";

export default function PlanGrid({
  interval,
  checkoutPendingTier,
  checkoutError,
  checkoutReady,
  currentPlanTier,
  currentPlanInterval,
  hasManagedSubscription,
  trialEligible,
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
  trialEligible: boolean;
  onIntervalChange: (interval: PricingInterval) => void;
  onPaidCheckout: (tier: PaidTier) => void;
}) {
  return (
    <section aria-labelledby="plans-heading" className="pt-10 sm:pt-12">
      <h2 id="plans-heading" className="sr-only">
        Plans
      </h2>
      <IntervalToggle interval={interval} onChange={onIntervalChange} />

      <div className="mx-auto mb-12 grid max-w-6xl grid-cols-1 items-stretch gap-5 pt-3 md:grid-cols-3">
        {plans.map((plan, index) => {
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
              key={plan.id}
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
                        : plan.id === "pro" && trialEligible
                          ? "Start free trial"
                        : `Choose ${plan.name}`
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
