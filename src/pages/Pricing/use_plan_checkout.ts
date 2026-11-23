import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";

import { useAuth } from "@/AuthContext";
import { fetchAccountProof, postProofForm } from "@/lib/account_proof";
import { CLOUD_CHECKOUT_URL, SUBSCRIPTION_SETTINGS_PATH } from "@/lib/site";
import { fetchSubscription } from "@/pages/AccountSettings/api";
import type { PlanId } from "./plans";

export type PlusCheckout = "plus" | "plus_yearly";

function plusCheckout(value: string | null): PlusCheckout | null {
  return value === "plus" || value === "plus_yearly" ? value : null;
}

export function usePlanCheckout() {
  const { user, sessionReady } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [starting, setStarting] = useState<PlusCheckout | null>(null);
  const [error, setError] = useState("");
  const [current, setCurrent] = useState<{ account: string; plan: PlanId } | null>(null);
  const resumed = useRef(false);
  const account = user?.id;

  useEffect(() => {
    if (!account) return;
    let live = true;
    const answer = (plan: PlanId) => {
      if (live) setCurrent({ account, plan });
    };
    fetchSubscription().then(
      (state) => answer(state.subscribed ? "plus" : "free"),
      () => answer("free"),
    );
    return () => {
      live = false;
    };
  }, [account]);

  const planRead = current !== null && current.account === account;
  const checking = !sessionReady || (Boolean(account) && !planRead);
  const plan: PlanId | null = account && planRead ? current.plan : null;

  const start = useCallback(
    async (chosen: PlusCheckout) => {
      setError("");
      if (!user) {
        navigate("/signin", { state: { from: `/pricing?checkout=${chosen}` } });
        return;
      }
      setStarting(chosen);
      try {
        postProofForm(CLOUD_CHECKOUT_URL, await fetchAccountProof(), { plan: chosen });
      } catch {
        setStarting(null);
        setError("Checkout is unavailable right now. Try again in a few minutes.");
      }
    },
    [navigate, user],
  );

  useEffect(() => {
    const asked = plusCheckout(searchParams.get("checkout"));
    if (checking || !user || resumed.current || !asked) return;
    resumed.current = true;
    if (plan === "plus") navigate(SUBSCRIPTION_SETTINGS_PATH, { replace: true });
    else void Promise.resolve().then(() => start(asked));
  }, [checking, navigate, plan, searchParams, start, user]);

  return { start, starting, error, checking, plan };
}
