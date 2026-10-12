import { PRICING_MODEL, type PaidTier, type PricingInterval } from "./data";

/** The one-sentence price and renewal terms for a paid plan. */
export function renewalSummary(tier: PaidTier, interval: PricingInterval): string {
  const plan = PRICING_MODEL[tier];
  const price =
    interval === "year" ? `${plan.yearlyPrice}/year` : `${plan.monthlyPrice}/month`;
  const cadence = interval === "year" ? "yearly" : "monthly";
  return `${price} plus applicable tax, renewing ${cadence} until you cancel.`;
}
