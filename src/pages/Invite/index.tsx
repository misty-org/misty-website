import { useEffect } from "react";
import { NavLink, useParams } from "react-router";

import { useAuth } from "@/AuthContext";
import { PublicPage } from "@/components/marketing";
import { Button } from "@/components/ui/button";
import { claimRememberedReferral, rememberReferral } from "./referralCode";

/** The landing page an invite link opens. */
export default function Invite() {
  const { code = "" } = useParams();
  const { user, sessionReady } = useAuth();
  useEffect(() => {
    rememberReferral(code);
    if (sessionReady && user) void claimRememberedReferral().catch(() => undefined);
  }, [code, sessionReady, user]);
  return (
    <PublicPage>
      <header className="mx-auto max-w-2xl text-center">
        <h1 className="marketing-heading text-foreground">A friend invited you to Misty</h1>
        <p className="mt-4 text-pretty marketing-description text-muted-foreground">
          Misty is free with every feature. If you later subscribe, you both get extra AI every
          month: you for your first two months, your friend for as long as you stay.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Button asChild>
            <NavLink to="/register">Create a free account</NavLink>
          </Button>
          <Button asChild variant="outline">
            <NavLink to="/pricing">See plans</NavLink>
          </Button>
        </div>
      </header>
    </PublicPage>
  );
}
