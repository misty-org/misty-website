import { useState } from "react";
import { NavLink, useLocation } from "react-router";
import { useAuth } from "../../AuthContext";
import { Button } from "@/components/ui/button";
import { safeInternalPath } from "@/lib/navigation";
import AuthCard from "../Auth/AuthCard";
import AuthShell from "../Auth/AuthShell";
import { signInRequest, type AuthUser } from "../Auth/api";
import type { MeResponse } from "../AccountSettings/api";
import SignInForm from "./SignInForm";
import { marketingCopy } from "@/content/marketingCopy";

interface SignInContext {
  email: string;
  password: string;
  me: MeResponse | null;
}

interface SignInProps {
  onSignedIn?: (user: AuthUser, context: SignInContext) => void | Promise<void>;
}

export default function SignIn({ onSignedIn }: SignInProps = {}) {
  const { refreshSession } = useAuth();
  const location = useLocation();
  // The nav links have always set this state; until now nothing read it.
  const returnTo = safeInternalPath(
    (location.state as { from?: string } | null)?.from,
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSignIn(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await signInRequest(email, password);
      const me = await refreshSession();
      await onSignedIn?.(user, { email, password, me });
      // Return to wherever the visitor was headed — a settings deep link from
      // the desktop app, say — instead of always dropping them on home.
      window.location.replace(returnTo ?? "/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not connect to server");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell title="Welcome back" description={marketingCopy.auth.signInDescription}>
      <AuthCard
        footer={
          <Button asChild variant="link" className="h-auto p-0 text-foreground">
            <NavLink to="/register">Don’t have an account? Create one</NavLink>
          </Button>
        }
      >
        <div className="flex flex-col gap-5">
          <SignInForm
            email={email}
            password={password}
            loading={loading}
            error={error}
            onEmailChange={setEmail}
            onPasswordChange={setPassword}
            onSubmit={handleSignIn}
          />
        </div>
      </AuthCard>
    </AuthShell>
  );
}
