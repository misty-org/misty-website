import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";

import { useAuth } from "@/AuthContext";
import type { MeResponse } from "@/pages/AccountSettings/api";
import { useUserStore } from "@/store/userStore";
import {
  createBillingPortal,
  createSubscriptionCheckout,
} from "../AccountSettings/api";
import type { PaidTier, PricingInterval } from "./data";

function effectivePaidTier(me: MeResponse | null): PaidTier | null {
  if (
    me?.allows_use &&
    (me.status === "active" || me.status === "trialing") &&
    (me?.tier === "pro" || me?.tier === "max")
  ) {
    return me.tier;
  }
  return null;
}

function hasManagedSubscription(me: MeResponse | null): boolean {
  const status = me?.billing?.subscription_status;
  if (status) return status !== "canceled" && status !== "incomplete_expired";
  return (
    me?.billing?.kind === "subscription" || me?.billing?.kind === "trial"
  );
}

function planName(tier: PaidTier): string {
  return tier === "max" ? "Max" : "Pro";
}

function currentPlanMessage(tier: PaidTier): string {
  return `You're already on the ${planName(tier)} plan.`;
}

function shouldRefreshAfterCheckoutError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  const status = (error as Error & { status?: number }).status;
  return status === 409 || error.message === "Checkout did not return a URL";
}

/**
 * Opens Checkout for new subscriptions or the portal for existing ones,
 * sending signed-out visitors through sign-in first.
 * The checkout parameter is what they come back to, so it is consumed once
 * per user/interval pair and then cleared from the URL.
 */
export function usePaidCheckout(
  onIntervalRestored: (interval: PricingInterval) => void,
) {
  const [pendingTier, setPendingTier] = useState<PaidTier | null>(null);
  const [error, setError] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const checkoutAttempt = useRef("");
  const billingInFlight = useRef(false);
  const navigate = useNavigate();
  const { user, sessionReady, refreshSession } = useAuth();
  const me = useUserStore((store) => store.me);
  const currentPlanTier = effectivePaidTier(me);
  const currentPlanInterval = me?.billing?.interval ?? null;
  const subscriptionStatus = me?.billing?.subscription_status;
  const managedSubscription = hasManagedSubscription(me);
  const trialEligible = me?.trial_eligible === true;

  const openCheckout = useCallback(
    async (tier: PaidTier, selectedInterval: PricingInterval) => {
      if (!sessionReady || billingInFlight.current) return;

      if (tier === currentPlanTier && !managedSubscription) {
        setError(currentPlanMessage(tier));
        return;
      }

      if (!user) {
        navigate("/signin", {
          state: {
            from: `/pricing?checkout=${tier}&interval=${selectedInterval}`,
          },
        });
        return;
      }

      billingInFlight.current = true;
      setPendingTier(tier);
      setError("");
      try {
        const changesPlan =
          tier !== currentPlanTier ||
          (currentPlanInterval && selectedInterval !== currentPlanInterval);
        const needsPaymentRecovery =
          subscriptionStatus &&
          subscriptionStatus !== "active" &&
          subscriptionStatus !== "trialing";
        // The billing service resolves a plan selection into new Checkout or
        // a confirmation flow that updates the existing subscription.
        const { url } = managedSubscription && (!changesPlan || needsPaymentRecovery)
          ? await createBillingPortal()
          : await createSubscriptionCheckout(tier, selectedInterval);
        window.location.assign(url);
      } catch (error) {
        if (shouldRefreshAfterCheckoutError(error)) {
          try {
            const account = await refreshSession();
            const refreshedTier = effectivePaidTier(account);
            if (hasManagedSubscription(account)) {
              setError(
                "You already have a subscription. Select your plan again to open Stripe billing.",
              );
              return;
            }
            if (refreshedTier === tier) {
              setError(currentPlanMessage(tier));
              return;
            }
          } catch {
            // Preserve the original checkout error if session refresh fails.
          }
        }
        setError(
          error instanceof Error ? error.message : "Unable to start checkout",
        );
      } finally {
        billingInFlight.current = false;
        setPendingTier(null);
      }
    },
    [
      currentPlanTier,
      currentPlanInterval,
      managedSubscription,
      navigate,
      refreshSession,
      sessionReady,
      subscriptionStatus,
      user,
    ],
  );

  useEffect(() => {
    const checkoutTier = searchParams.get("checkout");
    if (
      !sessionReady ||
      !user ||
      (checkoutTier !== "pro" && checkoutTier !== "max")
    ) {
      return;
    }
    const selectedInterval =
      searchParams.get("interval") === "year" ? "year" : "month";
    const attemptKey = `${user.id}:${checkoutTier}:${selectedInterval}`;
    if (checkoutAttempt.current === attemptKey) return;
    checkoutAttempt.current = attemptKey;
    onIntervalRestored(selectedInterval);
    setSearchParams({}, { replace: true });
    void openCheckout(checkoutTier, selectedInterval);
  }, [
    onIntervalRestored,
    openCheckout,
    searchParams,
    sessionReady,
    setSearchParams,
    user,
  ]);

  return {
    openCheckout,
    pendingTier,
    error,
    currentPlanTier,
    currentPlanInterval,
    hasManagedSubscription: managedSubscription,
    trialEligible,
    checkoutReady: sessionReady,
  };
}
