import { Check } from "lucide-react";
import type { ReactNode } from "react";

import { PublicPage } from "@/components/marketing";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { marketingCopy } from "@/content/marketingCopy";
import { DISCORD_URL, SUBSCRIPTION_SETTINGS_PATH } from "@/lib/site";
import { useProCheckout } from "./useProCheckout";
import {
  cloudIncludes,
  cloudPlan,
  cloudTagline,
  freeIncludes,
  freeTagline,
  pricingQuestions,
} from "./plans";
import { SiteLink } from "@/components/SiteLink";

/** A plan's button is as wide as its label, like the app's; the skeleton holds that place. */
const buttonSkeletonClass = "h-9 w-40 rounded-lg";

function PlanCard({
  name,
  tagline,
  price,
  period,
  items,
  action,
}: {
  name: string;
  tagline: string;
  price: string;
  period: string;
  items: ReactNode[];
  action: ReactNode;
}) {
  const id = `plan-${name.toLowerCase().replace(/\s+/g, "-")}`;
  return (
    <section
      aria-labelledby={id}
      className="flex flex-col rounded-xl border border-border bg-card p-6 sm:p-8"
    >
      <h2 id={id} className="text-xl font-medium text-foreground">
        {name}
      </h2>
      <p className="mt-1 text-base text-muted-foreground">{tagline}</p>
      <p className="mt-4 flex items-baseline gap-2">
        <span className="text-4xl font-medium tracking-[-0.03em] text-foreground">
          {price}
        </span>
        <span className="text-base text-muted-foreground">{period}</span>
      </p>
      <div className="mt-6 flex">{action}</div>
      <ul className="mt-8 grid gap-3 border-t border-border pt-6 text-base leading-7 text-foreground/85">
        {items.map((item, index) => (
          <li key={index} className="grid grid-cols-[1.25rem_1fr] gap-2.5">
            <Check aria-hidden="true" className="mt-1.5 size-4 text-foreground" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Question({
  question,
  children,
}: {
  question: string;
  children: ReactNode;
}) {
  return (
    <AccordionItem value={question}>
      <AccordionTrigger className="items-center gap-4 text-base hover:no-underline">
        {question}
      </AccordionTrigger>
      <AccordionContent className="h-auto text-base leading-7 text-muted-foreground">
        {children}
      </AccordionContent>
    </AccordionItem>
  );
}

function PricingQuestions() {
  return (
    // Two columns, like the homepage's: the heading and where to ask the rest on the left, the
    // questions on the right, so the list never stretches across the whole page alone.
    <section
      aria-labelledby="pricing-questions"
      className="mt-24 grid items-start gap-8 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.7fr)] md:gap-16"
    >
      <div className="grid gap-2">
        <h2
          id="pricing-questions"
          className="text-xl font-medium tracking-[-0.02em] text-foreground sm:text-2xl"
        >
          Questions
        </h2>
        <p className="text-base text-muted-foreground">
          Something else? Ask on{" "}
          <a
            href={DISCORD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground underline underline-offset-4"
          >
            Discord
          </a>
          .
        </p>
      </div>
      <Accordion type="multiple" className="border-t border-border">
        {pricingQuestions.map(({ question, answer }) => (
          <Question key={question} question={question}>
            {answer}
          </Question>
        ))}
        <Question question="How does billing work?">
          Prices are in US dollars, plus tax where it applies. The{" "}
          <SiteLink to="/terms#cloud">Terms</SiteLink> cover billing and
          cancellation. To update your card or cancel, go to{" "}
          <SiteLink to={SUBSCRIPTION_SETTINGS_PATH}>your account settings</SiteLink>.
        </Question>
      </Accordion>
    </section>
  );
}

/** Checkout, or for someone already subscribed, the way to their plan. */
function ProAction({ checkout }: { checkout: ReturnType<typeof useProCheckout> }) {
  if (checkout.checking) {
    return <Skeleton aria-hidden="true" className={buttonSkeletonClass} />;
  }
  if (checkout.subscribed) {
    return (
      <Button asChild variant="outline" size="lg">
        <SiteLink to={SUBSCRIPTION_SETTINGS_PATH}>Manage subscription</SiteLink>
      </Button>
    );
  }
  return (
    <div className="flex flex-col items-start gap-2">
      <Button
        size="lg"
        disabled={checkout.starting}
        onClick={() => void checkout.start()}
      >
        Get Pro
      </Button>
      {checkout.error ? (
        <p role="alert" className="text-base text-muted-foreground">
          {checkout.error}
        </p>
      ) : null}
    </div>
  );
}

/** Free and Pro side by side, then the questions people ask. */
export default function Pricing() {
  const checkout = useProCheckout();
  return (
    <PublicPage>
      <div>
        <h1 className="pb-12 text-center marketing-heading text-foreground">
          {marketingCopy.pricing.title}
        </h1>

        <div className="grid gap-4 md:grid-cols-2">
          <PlanCard
            name="Free"
            tagline={freeTagline}
            price="$0"
            period="/month"
            items={[
              ...freeIncludes,
              <>
                Share Spaces by hosting them yourself, with{" "}
                <SiteLink to="/docs/self-hosting">our guide</SiteLink>
              </>,
            ]}
            action={
              <Button asChild variant="outline" size="lg">
                <SiteLink to="/download">Download Misty</SiteLink>
              </Button>
            }
          />
          <PlanCard
            name="Pro"
            tagline={cloudTagline}
            price={`$${cloudPlan.price}`}
            period="/month plus tax"
            items={cloudIncludes}
            action={<ProAction checkout={checkout} />}
          />
        </div>

        <PricingQuestions />
      </div>
    </PublicPage>
  );
}
