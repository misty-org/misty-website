import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router";

import { useAuth } from "@/AuthContext";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { redeemWebHandoff } from "../Auth/api";
import AuthCard from "../Auth/AuthCard";
import AuthShell from "../Auth/AuthShell";

/** A page on this site to go on to; anything else, such as another site, goes home. */
function sitePath(next: string | null): string {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) return "/";
  return next;
}

/**
 * Where the app opens the website signed in as its own account:
 * `/continue?next=<path>#code=<code>`. The code is single-use and lasts two minutes, and the
 * fragment never leaves the browser. Trading it for a session signs this browser in to the
 * app's account, then the page goes on to `next`, such as checkout for Misty+.
 */
export default function ContinueFromApp() {
  const location = useLocation();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { refreshSession } = useAuth();
  const [code] = useState(() =>
    new URLSearchParams(location.hash.replace(/^#/, "")).get("code")?.trim() ?? "",
  );
  const [next] = useState(() => sitePath(params.get("next")));
  const [failed, setFailed] = useState(false);
  const started = useRef(false);

  useLayoutEffect(() => {
    if (!location.hash) return;
    navigate(
      { pathname: location.pathname, search: location.search, hash: "" },
      { replace: true, preventScrollReset: true },
    );
  }, [location.hash, location.pathname, location.search, navigate]);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    if (!code) {
      setFailed(true);
      return;
    }
    redeemWebHandoff(code).then(
      async () => {
        await refreshSession().catch(() => undefined);
        navigate(next, { replace: true });
      },
      () => setFailed(true),
    );
  }, [code, navigate, next, refreshSession]);

  return (
    <AuthShell title="Continue from Misty">
      <AuthCard>
        {failed ? (
          <div className="grid gap-5 text-center text-base leading-7 text-foreground">
            <p role="status">This link has expired or was already used. Open it again from Misty, or sign in here.</p>
            <Button size="lg" className="h-11 w-full" onClick={() => navigate("/signin", { state: { from: next } })}>
              Sign in
            </Button>
          </div>
        ) : (
          <Skeleton aria-hidden="true" className="mx-auto h-7 w-3/4" />
        )}
      </AuthCard>
    </AuthShell>
  );
}
