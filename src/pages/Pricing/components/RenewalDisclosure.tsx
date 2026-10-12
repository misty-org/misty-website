import { NavLink } from "react-router";

import { cn } from "@/lib/utils";
import type { PaidTier, PricingInterval } from "../data";
import { renewalSummary } from "../renewalTerms";

/**
 * Auto-renewal terms shown next to every button that starts a paid plan.
 * Automatic-renewal laws (e.g. California's) require the price, the renewal
 * frequency, that it continues until canceled, and how to cancel to sit
 * right beside the purchase button, so keep this next to the CTA.
 */
export default function RenewalDisclosure({
  tier,
  interval,
  className,
}: {
  tier: PaidTier;
  interval: PricingInterval;
  className?: string;
}) {
  return (
    <p className={cn("text-xs leading-5 text-muted-foreground", className)}>
      {renewalSummary(tier, interval)} Cancel anytime in Account
      Settings. Non-refundable except as described in our{" "}
      <NavLink
        to="/refunds"
        target="_blank"
        className="underline underline-offset-4"
      >
        Refund Policy
      </NavLink>
      .
    </p>
  );
}
