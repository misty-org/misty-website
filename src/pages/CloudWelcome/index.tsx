import { Button } from "@/components/ui/button";
import { SUBSCRIPTION_SETTINGS_PATH, SUPPORT_EMAIL } from "@/lib/site";
import { SiteLink } from "@/components/SiteLink";
import AuthCard from "../Auth/AuthCard";
import AuthShell from "../Auth/AuthShell";
import AuthSteps, { type AuthStep } from "../Auth/AuthSteps";

const footerLinkClass = "text-sm text-foreground underline-offset-4 hover:underline";

const STEPS: AuthStep[] = [
  {
    text: "Download Misty and install it on your computer.",
    action: (
      <Button asChild>
        <SiteLink to="/download">Download</SiteLink>
      </Button>
    ),
  },
  { text: "In Misty, choose Misty Pro and sign in with your Misty account." },
  {
    text: "Pick your models. AI runs on your own ChatGPT plan, OpenRouter, Ollama or API key, and Misty never charges for it.",
    action: (
      <Button asChild variant="outline">
        <SiteLink to="/docs/models">Models</SiteLink>
      </Button>
    ),
  },
];

/** Where Stripe Checkout returns after a successful Misty Pro payment. */
export default function CloudWelcome() {
  return (
    <AuthShell title="Welcome to Misty Pro" wide>
      <AuthCard
        footer={
          <nav
            aria-label="Misty Pro help"
            className="flex flex-wrap justify-center gap-x-6 gap-y-2"
          >
            <SiteLink to="/docs/connect#cloud" className={footerLinkClass}>
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
