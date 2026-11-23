import { useState } from "react";
import { NavLink, useLocation } from "react-router";

import { Checkbox, InlineLink, Text } from "@misty/ui";

import { marketingCopy } from "@/content/marketing_copy";
import AuthCard from "../Auth/AuthCard";
import AuthField from "../Auth/AuthField";
import AuthMessage from "../Auth/AuthMessage";
import AuthShell from "../Auth/AuthShell";
import AuthSubmitButton from "../Auth/AuthSubmitButton";
import GoogleSignInButton from "../Auth/GoogleSignInButton";
import { registerRequest } from "../Auth/api";
import { useAuth } from "../../AuthContext";
import { passwordProblem } from "@/lib/account_password";
import { safeInternalPath } from "@/lib/navigation";

export default function Register() {
  const { refreshSession } = useAuth();
  const location = useLocation();
  const returnTo = safeInternalPath((location.state as { from?: string } | null)?.from);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirming, setConfirming] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const problem = passwordProblem(password);
    if (problem) {
      setError(problem);
      return;
    }
    setLoading(true);

    try {
      const { confirmEmail } = await registerRequest(username, email, password);
      if (confirmEmail) {
        setConfirming(true);
        return;
      }
      await refreshSession();
      window.location.replace(returnTo ?? "/");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not connect to server",
      );
    } finally {
      setLoading(false);
    }
  }

  if (confirming) {
    return (
      <AuthShell title="Check your email">
        <AuthCard>
          <Text wrap size="page" role="status">
            We sent a link to {email}. Open it to finish creating your account.
          </Text>
        </AuthCard>
      </AuthShell>
    );
  }

  return (
    <AuthShell title={marketingCopy.auth.registerTitle}>
      <AuthCard
        footer={
          <InlineLink asChild>
            <NavLink to="/signin" state={location.state}>Already have an account? Sign in</NavLink>
          </InlineLink>
        }
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <AuthField
            id="register-username"
            label="Username"
            value={username}
            autoComplete="username"
            placeholder="yourname"
            required
            onChange={setUsername}
          />

          <AuthField
            id="register-email"
            type="email"
            label="Email"
            value={email}
            autoComplete="email"
            placeholder="you@example.com"
            required
            onChange={setEmail}
          />

          <AuthField
            id="register-password"
            type="password"
            label="Password"
            value={password}
            autoComplete="new-password"
            placeholder="••••••••"
            required
            onChange={setPassword}
          />

          <div className="flex items-start gap-3">
            <Checkbox
              id="register-terms"
              checked={agreed}
              required
              onCheckedChange={(checked) => setAgreed(checked === true)}
              className="mt-0.5"
            />
            <label htmlFor="register-terms" className="min-w-0">
              <Text wrap size="control" tone="muted" as="span">
              I agree to the{" "}
              <InlineLink asChild>
                <NavLink to="/terms" target="_blank">
                  Terms of service
                </NavLink>
              </InlineLink>{" "}
              and{" "}
              <InlineLink asChild>
                <NavLink to="/privacy" target="_blank">
                  Privacy policy
                </NavLink>
              </InlineLink>
              .
              </Text>
            </label>
          </div>

          {error ? <AuthMessage tone="error" message={error} /> : null}

          <AuthSubmitButton
            idleLabel="Create account"
            loading={loading}
            disabled={!agreed}
          />
          <GoogleSignInButton
            returnTo={returnTo}
            disabled={loading || !agreed}
            onError={setError}
          />
        </form>
      </AuthCard>
    </AuthShell>
  );
}
