import { NavLink } from "react-router";

import { PageHeader, PublicPage } from "@/components/marketing";
import { Button } from "@/components/ui/button";
import { CUSTOMER_PORTAL_URL, SUPPORT_EMAIL } from "@/lib/site";

const linkClass = "text-foreground underline underline-offset-4 hover:text-foreground/80";

const STEPS = [
  <>
    <NavLink to="/download" className={linkClass}>
      Download Misty
    </NavLink>{" "}
    and install it on your computer.
  </>,
  "Open the setup email we sent to the address you paid with, and choose its setup link. The page it opens starts Misty with your server and setup key filled in.",
  "Set a password when Misty asks. It opens your encrypted sync, and you sign in with it on your other computers.",
  <>
    Pick your models. AI runs on your own ChatGPT plan, OpenRouter, Ollama or API key, and
    Misty never charges for it. See{" "}
    <NavLink to="/docs/models" className={linkClass}>
      Models
    </NavLink>
    .
  </>,
];

/** Where Stripe Checkout returns after a successful Misty Cloud payment. */
export default function CloudWelcome() {
  return (
    <PublicPage>
      <PageHeader
        label="Misty Cloud"
        title="Welcome to Misty Cloud"
        description="Your payment went through, and your setup email is on its way."
      />
      <div className="grid max-w-2xl gap-10">
        <ol className="grid gap-4 text-base leading-7 text-muted-foreground">
          {STEPS.map((step, index) => (
            <li key={index} className="grid grid-cols-[2rem_1fr] gap-2">
              <span className="pt-0.5 font-mono text-xs leading-7 text-muted-foreground">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg" className="rounded-full sm:px-6">
            <NavLink to="/download">Download Misty</NavLink>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-full sm:px-6">
            <NavLink to="/docs/connect#cloud">Read the setup guide</NavLink>
          </Button>
        </div>

        <div
          role="note"
          className="grid gap-2 rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm leading-6 text-foreground/85"
        >
          <p>
            The email usually arrives within a few minutes. Its setup key works once and lasts
            seven days. If nothing has arrived after an hour, check your spam folder, then write
            to{" "}
            <a href={`mailto:${SUPPORT_EMAIL}`} className={linkClass}>
              {SUPPORT_EMAIL}
            </a>{" "}
            from the address you paid with.
          </p>
          <p>
            To change your plan, update your card or cancel,{" "}
            <a href={CUSTOMER_PORTAL_URL} className={linkClass}>
              manage your subscription
            </a>
            .
          </p>
        </div>
      </div>
    </PublicPage>
  );
}
