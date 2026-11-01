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
          Misty is a free, open-source browser with agents built in. Download it to start
          browsing, or create an account to join your friend.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Button asChild>
            <NavLink to="/register">Create an account</NavLink>
          </Button>
          <Button asChild variant="outline">
            <NavLink to="/download">Download Misty</NavLink>
          </Button>
        </div>
      </header>
    </PublicPage>
  );
}
