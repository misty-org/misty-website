import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router";

import { useAuth } from "@/AuthContext";
import { Button, Skeleton } from "@misty/ui";
import { redeemWebHandoff } from "../Auth/api";
import AuthCard from "../Auth/AuthCard";
import AuthShell from "../Auth/AuthShell";

function sitePath(next: string | null): string {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) return "/";
  return next;
}

export default function ContinueFromApp() {
  const location = useLocation();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { refreshSession } = useAuth();
  const [code] = useState(() =>
    new URLSearchParams(location.hash.replace(/^#/, "")).get("code")?.trim() ?? "",
  );
  const [next] = useState(() => sitePath(params.get("next")));
  const [redeemFailed, setFailed] = useState(false);
  const failed = !code || redeemFailed;
  const started = useRef(false);

  useLayoutEffect(() => {
    if (!location.hash) return;
    navigate(
      { pathname: location.pathname, search: location.search, hash: "" },
      { replace: true, preventScrollReset: true },
    );
  }, [location.hash, location.pathname, location.search, navigate]);

  useEffect(() => {
    if (started.current || !code) return;
    started.current = true;
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
          <div className="grid gap-5 text-center text-page leading-7 text-foreground">
            <p role="status">This link has expired or was already used. Open it again from Misty, or sign in here.</p>
            <Button variant="primary" size="lg" className="w-full" onClick={() => navigate("/signin", { state: { from: next } })}>
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
