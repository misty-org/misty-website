import { Button } from "@misty/ui";
import { SUBSCRIPTION_SETTINGS_PATH, SUPPORT_EMAIL } from "@/lib/site";
import { SiteLink } from "@/components/SiteLink";
import AuthCard from "../Auth/AuthCard";
import AuthShell from "../Auth/AuthShell";
import AuthSteps, { type AuthStep } from "../Auth/AuthSteps";

const footerLinkClass = "text-control text-foreground underline-offset-4 hover:underline";

const STEPS: AuthStep[] = [
  {
    text: "Download Misty and install it on your computer.",
    action: (
      <Button variant="primary" asChild>
        <SiteLink to="/download">Download</SiteLink>
      </Button>
    ),
  },
  { text: "In Misty, choose Misty Cloud and sign in with your Misty account." },
  {
    text: "Choose your agent, such as Claude Code or Codex. It runs on your own plan with that AI, and Misty never charges for AI.",
    action: (
      <Button asChild>
        <SiteLink to="/docs/choose-agent">Choose your agent</SiteLink>
      </Button>
    ),
  },
];

/** Where Stripe Checkout returns after a successful Misty+ or Boost payment. */
export default function CloudWelcome() {
  return (
    <AuthShell title="Thanks for subscribing" wide>
      <AuthCard
        footer={
          <nav
            aria-label="Subscription help"
            className="flex flex-wrap justify-center gap-x-6 gap-y-2"
          >
            <SiteLink to="/docs/quickstart" className={footerLinkClass}>
              Setup guide
            </SiteLink>
            <SiteLink to={SUBSCRIPTION_SETTINGS_PATH} className={footerLinkClass}>
              Manage subscription
            </SiteLink>
            <a href={`mailto:${SUPPORT_EMAIL}`} className={footerLinkClass}>
              {SUPPORT_EMAIL}
            </a>
          </nav>
        }
      >
        <AuthSteps steps={STEPS} />
      </AuthCard>
    </AuthShell>
  );
}
