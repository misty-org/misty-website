import { useLayoutEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router";

import { useAuth } from "@/AuthContext";
import { Input } from "@misty/ui";
import { CLOUD_HOST } from "@/lib/site";
import { AuthRequestError, confirmEmailSignIn } from "../Auth/api";
import AuthCard from "../Auth/AuthCard";
import AuthField from "../Auth/AuthField";
import AuthShell from "../Auth/AuthShell";
import AuthSubmitButton from "../Auth/AuthSubmitButton";
import { parseServerHost } from "../Setup/setup_link";

const results: Record<string, string> = {
  confirmed: "Your email is confirmed. You can go back to Misty.",
  exists: "This email already has a Misty account. Sign in with it.",
  expired: "This link has expired or was already used. Create your account again for a new one.",
  failed: "Misty couldn't confirm your email. Open the link in your email and try again.",
  wrong_password:
    "That isn't the password chosen when this account was created. Open the link in your email and try again.",
};

const wrongPassword = "That isn't the password you chose when you signed up.";

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

export default function ConfirmEmail() {
  const location = useLocation();
  const navigate = useNavigate();
  const { refreshSession } = useAuth();
  const [params] = useSearchParams();
  const [link] = useState(() => readLink(location.hash));
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [outcome, setOutcome] = useState<string | null>(null);
  const form = useRef<HTMLFormElement>(null);
  const result = results[outcome ?? params.get("result") ?? ""];

  useLayoutEffect(() => {
    if (!location.hash) return;
    navigate(
      { pathname: location.pathname, search: location.search, hash: "" },
      { replace: true, preventScrollReset: true },
    );
  }, [location.hash, location.pathname, location.search, navigate]);

  function confirm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!link || loading || !password) return;
    setError("");
    if (!link.ownServer) {
      form.current?.submit();
      return;
    }
    setLoading(true);
    confirmEmailSignIn(link.token, password).then(
      async () => {
        await refreshSession().catch(() => undefined);
        navigate("/", { replace: true });
      },
      (failure: unknown) => {
        setLoading(false);
        const code = failure instanceof AuthRequestError ? failure.code : undefined;
        if (code === "wrong_password") {
          setError(wrongPassword);
          return;
        }
        setOutcome(code && results[code] ? code : "failed");
      },
    );
  }

  return (
    <AuthShell title="Confirm your email">
      <AuthCard>
        {result ? (
          <p role="status" className="text-center text-page leading-7 text-foreground">
            {result}
          </p>
        ) : link ? (
          <form
            ref={form}
            method="post"
            action={link.action}
            onSubmit={confirm}
            className="flex flex-col gap-5"
          >
            <Input type="hidden" name="token" value={link.token} />
            <AuthField
              id="confirm-password"
              label="Password"
              name="password"
              type="password"
              value={password}
              autoComplete="current-password"
              required
              disabled={loading}
              error={error}
              onChange={setPassword}
            />
            <AuthSubmitButton idleLabel="Confirm email" loading={loading} disabled={!password} />
          </form>
        ) : (
          <p className="text-center text-page leading-7 text-foreground">
            This link isn't complete. Open the link in your email again.
          </p>
        )}
      </AuthCard>
    </AuthShell>
  );
}
