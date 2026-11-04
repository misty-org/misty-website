import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";

import { useAuth } from "@/AuthContext";
import { fetchAccountProof, postProofForm } from "@/lib/accountProof";
import { CLOUD_CHECKOUT_URL, SUBSCRIPTION_SETTINGS_PATH } from "@/lib/site";
import { fetchSubscription } from "@/pages/AccountSettings/api";

/**
 * Misty Pro needs a Misty account. "Get Misty Pro" sends someone signed out through
 * sign-in or sign-up first, and they come back here to continue to checkout. Someone
 * already subscribed manages their plan in account settings instead.
 */
export function useProCheckout() {
  const { user, sessionReady } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState("");
  const [plan, setPlan] = useState<{ account: string; subscribed: boolean } | null>(null);
  const resumed = useRef(false);
  const account = user?.id;

  useEffect(() => {
    if (!account) return;
    let current = true;
    const answer = (subscribed: boolean) => {
      if (current) setPlan({ account, subscribed });
    };
    // When billing can't say, checkout stays on offer: it sends a subscriber to their settings.
    fetchSubscription().then(
      (state) => answer(state.subscribed),
      () => answer(false),
    );
    return () => {
      current = false;
    };
  }, [account]);

  const planRead = plan !== null && plan.account === account;
  const checking = !sessionReady || (Boolean(account) && !planRead);
  const subscribed = Boolean(account) && planRead && plan.subscribed;

  const start = useCallback(async () => {
    setError("");
    if (!user) {
      navigate("/signin", { state: { from: "/pricing?checkout=pro" } });
      return;
    }
    setStarting(true);
    try {
      postProofForm(CLOUD_CHECKOUT_URL, await fetchAccountProof());
    } catch {
      setStarting(false);
      setError("Checkout is unavailable right now. Try again in a few minutes.");
    }
  }, [navigate, user]);

  useEffect(() => {
    if (checking || !user || resumed.current || searchParams.get("checkout") !== "pro") return;
    resumed.current = true;
    if (subscribed) navigate(SUBSCRIPTION_SETTINGS_PATH, { replace: true });
    else void Promise.resolve().then(start);
  }, [checking, navigate, searchParams, start, subscribed, user]);

  return { start, starting, error, checking, subscribed };
}
