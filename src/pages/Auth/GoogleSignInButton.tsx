import { useState } from "react";

import { BrandIcon, Button, Text } from "@misty/ui";

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
      <Text bare size="control" tone="muted" as="div" className="flex items-center gap-3" aria-hidden="true">
        <span className="h-px flex-1 bg-border" />
        or
        <span className="h-px flex-1 bg-border" />
      </Text>
      <Button
        size="lg"
        disabled={disabled || starting}
        aria-busy={starting}
        className="w-full"
        icon={<BrandIcon brand="google-logo" size={16} aria-hidden />}
        onClick={() => void start()}
      >
        Continue with Google
      </Button>
    </div>
  );
}
