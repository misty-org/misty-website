import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router";
import { useAuth } from "../../AuthContext";
import { Button } from "@/components/ui/button";
import { safeInternalPath } from "@/lib/navigation";
import AuthCard from "../Auth/AuthCard";
import AuthShell from "../Auth/AuthShell";
import GoogleSignInButton from "../Auth/GoogleSignInButton";
import {
  AuthRequestError,
  completeGoogleSignIn,
  googleSignInErrorMessage,
  signInRequest,
  type AuthUser,
} from "../Auth/api";
import { fetchSubscriptionWithProof, type MeResponse } from "../AccountSettings/api";
import PaymentFailedCard from "./PaymentFailedCard";
import SignInForm from "./SignInForm";

interface SignInContext {
  email: string;
  password: string;
  me: MeResponse | null;
}

/** A suspended sign-in's proof, if what suspended the account is a payment they can make. */
async function unpaidProof(err: unknown): Promise<string | null> {
  if (!(err instanceof AuthRequestError) || !err.proof) return null;
  try {
    const { status } = await fetchSubscriptionWithProof(err.proof);
    return status === "past_due" || status === "unpaid" ? err.proof : null;
  } catch {
    return null;
  }
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

  // Google sends the person back here with a code in the fragment, which no server sees.
  const [google] = useState(() => {
    const fragment = new URLSearchParams(window.location.hash.slice(1));
    return { refused: fragment.get("google_error"), code: fragment.get("google_code") };
  });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(Boolean(!google.refused && google.code));
  const [error, setError] = useState(() =>
    google.refused ? googleSignInErrorMessage(google.refused) : "",
  );
  const [cardProof, setCardProof] = useState<string | null>(null);
  const googleHandled = useRef(false);

  useEffect(() => {
    // A code works once, and development runs every effect twice.
    if (googleHandled.current || (!google.refused && !google.code)) return;
    googleHandled.current = true;
    window.history.replaceState(null, "", window.location.pathname);
    if (google.refused || !google.code) return;
    void completeGoogleSignIn(google.code)
      .then(async (headedTo) => {
        await refreshSession();
        window.location.replace(safeInternalPath(headedTo ?? undefined) ?? "/");
      })
      .catch(async (err) => {
        const proof = await unpaidProof(err);
        setCardProof(proof);
        if (!proof) setError(err instanceof Error ? err.message : "Could not sign in with Google.");
        setLoading(false);
      });
  }, [google, refreshSession]);

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
      const proof = await unpaidProof(err);
      setCardProof(proof);
      if (!proof) setError(err instanceof Error ? err.message : "Could not connect to server");
    } finally {
      setLoading(false);
    }
  }

  if (cardProof) {
    return <PaymentFailedCard proof={cardProof} onBack={() => setCardProof(null)} />;
  }

  return (
    <AuthShell title="Welcome back">
      <AuthCard
        footer={
          <Button asChild variant="link" className="h-auto p-0 text-foreground">
            <NavLink to="/register" state={location.state}>Don’t have an account? Create one</NavLink>
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
          <GoogleSignInButton returnTo={returnTo} disabled={loading} onError={setError} />
        </div>
      </AuthCard>
    </AuthShell>
  );
}
