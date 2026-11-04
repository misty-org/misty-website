import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router";

import { useAuth } from "@/AuthContext";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CLOUD_HOST } from "@/lib/site";
import { AuthRequestError, confirmEmailSignIn } from "../Auth/api";
import AuthCard from "../Auth/AuthCard";
import AuthShell from "../Auth/AuthShell";
import { parseServerHost } from "../Setup/setupLink";

const results: Record<string, string> = {
  confirmed: "Your email is confirmed. You can go back to Misty.",
  exists: "This email already has a Misty account. Sign in with it.",
  expired: "This link has expired or was already used. Create your account again for a new one.",
  failed: "Misty couldn't confirm your email. Open the link in your email and try again.",
};

/**
 * The form's target on the server named in the link, or null when the link is incomplete.
 * `ownServer` says it is the server this site signs in on.
 */
function readLink(hash: string): { action: string; token: string; ownServer: boolean } | null {
  const params = new URLSearchParams(hash.replace(/^#/, ""));
  const server = parseServerHost(params.get("server") ?? "");
  const token = (params.get("token") ?? "").trim();
  if (!server || !token) return null;
  const local = /^(localhost|127\.0\.0\.1|\[::1\])(:|$)/.test(server);
  return {
    action: `${local ? "http" : "https"}://${server}/v1/auth/confirm-email`,
    token,
    ownServer: server === CLOUD_HOST,
  };
}

/**
 * Where confirmation emails point: `/confirm-email#server=<host>&token=<token>`. The fragment
 * never leaves the browser, so only something that runs this page can confirm. Opening the link
 * on this site's own server confirms and signs in. On any other, this site has no session to
 * give, so the form posts straight to that server, which sends the person back here with
 * `?result=`, and the app they signed up in signs itself in. A browser that says it is
 * automated, as mail scanners' often do, gets a button instead.
 */
export default function ConfirmEmail() {
  const location = useLocation();
  const navigate = useNavigate();
  const { refreshSession } = useAuth();
  const [params] = useSearchParams();
  const [link] = useState(() => readLink(location.hash));
  const [automated] = useState(() => navigator.webdriver);
  const [outcome, setOutcome] = useState<string | null>(null);
  const form = useRef<HTMLFormElement>(null);
  const submitted = useRef(false);
  const result = results[outcome ?? params.get("result") ?? ""];

  const confirm = useCallback(() => {
    if (!link || submitted.current) return;
    submitted.current = true;
    if (!link.ownServer) {
      form.current?.submit();
      return;
    }
    confirmEmailSignIn(link.token).then(
      async () => {
        await refreshSession().catch(() => undefined);
        navigate("/", { replace: true });
      },
      (error: unknown) => {
        const code = error instanceof AuthRequestError ? error.code : undefined;
        setOutcome(code && results[code] ? code : "failed");
      },
    );
  }, [link, navigate, refreshSession]);

  useEffect(() => {
    if (!automated && form.current) confirm();
  }, [automated, confirm]);

  useLayoutEffect(() => {
    if (!location.hash) return;
    navigate(
      { pathname: location.pathname, search: location.search, hash: "" },
      { replace: true, preventScrollReset: true },
    );
  }, [location.hash, location.pathname, location.search, navigate]);

  return (
    <AuthShell title="Confirm your email">
      <AuthCard>
        <div className="text-center text-base leading-7 text-foreground">
          {result ? (
            <p role="status">{result}</p>
          ) : link ? (
            <form
              ref={form}
              method="post"
              action={link.action}
              onSubmit={(event) => {
                event.preventDefault();
                confirm();
              }}
            >
              <input type="hidden" name="token" value={link.token} />
              {automated ? (
                <Button type="submit" size="lg" className="h-11 w-full">
                  Confirm email
                </Button>
              ) : (
                <Skeleton aria-hidden="true" className="mx-auto h-7 w-3/4" />
              )}
            </form>
          ) : (
            <p>This link isn't complete. Open the link in your email again.</p>
          )}
        </div>
      </AuthCard>
    </AuthShell>
  );
}
