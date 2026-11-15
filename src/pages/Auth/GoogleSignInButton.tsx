import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import googleLogo from "@/assets/google-logo.svg";
import { beginGoogleSignIn } from "./api";

/** Leaves for Google in this tab; the sign-in page finishes when Google sends the person back. */
export default function GoogleSignInButton({
  returnTo,
  disabled,
  onError,
}: {
  returnTo: string | null;
  disabled?: boolean;
  onError: (message: string) => void;
}) {
  const [starting, setStarting] = useState(false);

  async function start() {
    onError("");
    setStarting(true);
    try {
      await beginGoogleSignIn(returnTo);
    } catch (err) {
      onError(err instanceof Error ? err.message : "Could not sign in with Google.");
      setStarting(false);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3 text-sm text-muted-foreground" aria-hidden="true">
        <span className="h-px flex-1 bg-border" />
        or
        <span className="h-px flex-1 bg-border" />
      </div>
      <Button
        type="button"
        variant="outline"
        size="lg"
        disabled={disabled || starting}
        aria-busy={starting}
        className="h-11 w-full gap-2.5"
        onClick={() => void start()}
      >
        {starting ? (
          <Spinner aria-hidden="true" />
        ) : (
          <img src={googleLogo} alt="" aria-hidden="true" className="size-[1.125rem]" />
        )}
        Continue with Google
      </Button>
    </div>
  );
}
