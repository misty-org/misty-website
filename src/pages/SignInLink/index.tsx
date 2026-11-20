import { useState } from "react";
import { useSearchParams } from "react-router";

import { Button, InlineLink, Text } from "@misty/ui";

import { SiteLink } from "@/components/SiteLink";
import { BILLING_URL } from "@/lib/site";
import AuthCard from "../Auth/AuthCard";
import AuthField from "../Auth/AuthField";
import AuthShell from "../Auth/AuthShell";

/**
 * "Email me a sign-in link" for a Misty account. The form posts straight to misty-cloud, which
 * has the server email a new setup link and sends every visitor back to `?sent=1` either
 * way, so the page never shows who has an account. The link also lets the person set a new
 * password.
 */
export default function SignInLink() {
  const [params] = useSearchParams();
  const [email, setEmail] = useState("");
  const sent = params.get("sent") === "1";

  return (
    <AuthShell title="Get a sign-in link">
      <AuthCard
        footer={
          <Text wrap size="page" tone="muted" className="text-center">
            This is for accounts on Misty's server. On a server someone else runs, ask them for a
            link. On your own, make one in its console. See{" "}
            <InlineLink asChild>
              <SiteLink to="/docs/self-hosting">Run a server</SiteLink>
            </InlineLink>
            .
          </Text>
        }
      >
        {sent ? (
          <Text wrap size="page" role="status">
            If that email has a Misty account with a password, a sign-in link is on its way. It
            works once, lasts seven days and lets you choose a new password in the app.
          </Text>
        ) : (
          <form method="post" action={`${BILLING_URL}/sign-in-link`} className="grid gap-5">
            <AuthField
              id="sign-in-link-email"
              name="email"
              label="Email"
              type="email"
              autoComplete="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={setEmail}
            />
            <Button type="submit" variant="primary" size="lg" className="w-full">
              Email me a link
            </Button>
          </form>
        )}
      </AuthCard>
    </AuthShell>
  );
}
