import { useSearchParams } from "react-router";

import { PageHeader, PublicPage } from "@/components/marketing";
import { Button } from "@/components/ui/button";
import { BILLING_URL } from "@/lib/site";

const linkClass = "text-foreground underline underline-offset-4 hover:text-foreground/80";

/**
 * "Email me a sign-in link" for Misty Cloud. The form posts straight to misty-billing, which
 * emails a new setup link to Cloud customers and sends every visitor back to `?sent=1` either
 * way, so the page never shows who has an account. The link also lets the person set a new
 * password.
 */
export default function SignInLink() {
  const [params] = useSearchParams();
  const sent = params.get("sent") === "1";

  return (
    <PublicPage>
      <PageHeader
        label="Sign in"
        title="Get a sign-in link"
        description="For Misty Cloud. The link signs you in to Misty and lets you choose a new password."
      />
      <div className="grid max-w-xl gap-6 text-base leading-7 text-muted-foreground">
        {sent ? (
          <p role="status" className="text-foreground">
            If that email has a Misty Cloud account, a sign-in link is on its way. It works once
            and lasts seven days.
          </p>
        ) : (
          <form
            method="post"
            action={`${BILLING_URL}/sign-in-link`}
            className="grid gap-4"
          >
            <label htmlFor="sign-in-link-email" className="grid gap-2 text-sm text-foreground">
              Email
              <input
                id="sign-in-link-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="you@example.com"
                className="h-11 rounded-lg border border-border bg-background px-3 text-base text-foreground outline-none focus-visible:border-foreground"
              />
            </label>
            <Button type="submit" size="lg" className="w-full rounded-full sm:w-fit sm:px-6">
              Email me a link
            </Button>
          </form>
        )}
        <p>
          On a server someone else runs, ask them for a sign-in link instead. They make one in
          their server's console. If you run your own server, open its console and make one for
          yourself. See{" "}
          <a href="/docs/self-hosting" className={linkClass}>
            Run a server
          </a>
          .
        </p>
      </div>
    </PublicPage>
  );
}
