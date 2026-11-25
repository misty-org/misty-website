import { Check } from "lucide-react";
import { useState, type ReactNode } from "react";

import { PublicPage } from "@/components/marketing";
import { Button, Disclosure, DisclosureList, InlineLink, SkeletonControl, Text } from "@misty/ui";
import { marketingCopy } from "@/content/marketing_copy";
import { DISCORD_URL, SUBSCRIPTION_SETTINGS_PATH, SUPPORT_EMAIL } from "@/lib/site";
import { usePlanCheckout } from "./use_plan_checkout";
import {
  checkoutPlan,
  includes,
  plans,
  pricingQuestions,
  taglines,
  yearlySaving,
  type PaidPlanId,
} from "./plans";
import { SiteLink } from "@/components/SiteLink";
import { BillingToggle } from "@/components/BillingToggle";

function PlanCard({
  name,
  tagline,
  price,
  period,
  items,
  action,
  recommended = false,
}: {
  name: string;
  tagline: string;
  price: string;
  period: string;
  items: ReactNode[];
  action: ReactNode;
  recommended?: boolean;
}) {
  const id = `plan-${name.toLowerCase().replace(/\s+/g, "-")}`;
  return (
    <section
      aria-labelledby={id}
      className="flex flex-col rounded-xl border border-border bg-card p-6 md:row-span-4 md:grid md:grid-rows-subgrid md:gap-y-0"
    >
      <div>
        <div className="flex items-center gap-2">
          <h2 id={id} className="text-xl font-medium text-foreground">
            {name}
          </h2>
          {recommended ? (
            <span className="rounded-md border border-border px-2 py-0.5 text-caption text-muted-foreground">
              Recommended
            </span>
          ) : null}
        </div>
        <p className="mt-1 text-control text-muted-foreground">{tagline}</p>
      </div>
      <p className="mt-5 flex items-baseline gap-2">
        <span className="text-4xl font-medium tracking-[-0.03em] text-foreground">
          {price}
        </span>
        <span className="text-control text-muted-foreground">{period}</span>
      </p>
      <div className="mt-5 flex">{action}</div>
      <ul className="mt-6 grid content-start gap-2 border-t border-border pt-5 text-control leading-6 text-foreground/85">
        {items.map((item, index) => (
          <li key={index} className="grid grid-cols-[1rem_1fr] gap-2.5">
            <Check aria-hidden="true" className="mt-1 size-4 text-foreground" />
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
    <Disclosure title={question}>{children}</Disclosure>
  );
}

function PricingQuestions() {
  return (
    <section
      aria-labelledby="pricing-questions"
      className="mt-24 grid items-start gap-8 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.7fr)] md:gap-16"
    >
      <div className="grid gap-2">
        <Text
          as="h2"
          wrap
          size="display"
          weight="medium"
          id="pricing-questions"
          className="tracking-[-0.02em] text-foreground"
        >
          Questions
        </Text>
        <Text wrap size="page" tone="muted">
          Something else? Ask on{" "}
          <InlineLink asChild className="text-foreground">
            <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer">
              Discord
            </a>
          </InlineLink>{" "}
          or email{" "}
          <InlineLink asChild className="text-foreground">
            <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
          </InlineLink>
          .
        </Text>
      </div>
      <DisclosureList className="border-t border-border">
        {pricingQuestions.map(({ question, answer }) => (
          <Question key={question} question={question}>
            {answer}
          </Question>
        ))}
        <Question question="How does billing work?">
          Prices are in US dollars, plus tax where it applies, and paid plans renew until you cancel. The{" "}
          <InlineLink asChild>
            <SiteLink to="/terms#cloud">Terms</SiteLink>
          </InlineLink>{" "}
          cover billing and cancellation. To update your card or cancel, go to{" "}
          <InlineLink asChild>
            <SiteLink to={SUBSCRIPTION_SETTINGS_PATH}>your account settings</SiteLink>
          </InlineLink>
          .
        </Question>
      </DisclosureList>
    </section>
  );
}

function PaidAction({
  plan,
  checkout,
  yearly,
}: {
  plan: PaidPlanId;
  checkout: ReturnType<typeof usePlanCheckout>;
  yearly: boolean;
}) {
  if (checkout.checking) {
    return <SkeletonControl kind="button" className="h-9 w-40" />;
  }
  if (checkout.plan === "pro" || checkout.plan === "max") {
    return (
      <Button size="lg" asChild>
        <SiteLink to={SUBSCRIPTION_SETTINGS_PATH}>
          {checkout.plan === plan ? "Manage subscription" : `Switch to ${plans[plan].name}`}
        </SiteLink>
      </Button>
    );
  }
  const chosen = checkoutPlan(plan, yearly);
  return (
    <div className="flex flex-col items-start gap-2">
      <Button variant={plan === "pro" ? "primary" : "secondary"} size="lg"
        disabled={checkout.starting !== null}
        onClick={() => void checkout.start(chosen)}
      >
        Get {plans[plan].name}
      </Button>
      {checkout.error && checkout.failed === chosen ? (
        <p role="alert" className="text-page text-muted-foreground">
          {checkout.error}
        </p>
      ) : null}
    </div>
  );
}

export default function Pricing() {
  const checkout = usePlanCheckout();
  const [yearly, setYearly] = useState(false);
  const saving = Math.min(
    yearlySaving(plans.pro.monthly, plans.pro.yearly),
    yearlySaving(plans.max.monthly, plans.max.yearly),
  );
  return (
    <PublicPage>
      <div>
        <h1 className="pb-6 text-center marketing-heading text-foreground">
          {marketingCopy.pricing.title}
        </h1>

        <div className="mb-10 flex justify-center">
          <BillingToggle
            label="Billing period"
            saving={saving}
            yearly={yearly}
            onChange={setYearly}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-3 md:gap-y-0">
          <PlanCard
            name={plans.free.name}
            tagline={taglines.free}
            price="$0"
            period="/month"
            items={[
              ...includes.free,
              <>
                Or <SiteLink to="/docs/self-hosting">host your own</SiteLink>, with no limits
              </>,
            ]}
            action={
              <Button size="lg" asChild>
                <SiteLink to="/download">Download Misty</SiteLink>
              </Button>
            }
          />
          <PlanCard
            name={plans.pro.name}
            tagline={taglines.pro}
            price={`$${yearly ? plans.pro.yearly : plans.pro.monthly}`}
            period={yearly ? "/year plus tax" : "/month plus tax"}
            items={[...includes.pro]}
            recommended
            action={<PaidAction plan="pro" checkout={checkout} yearly={yearly} />}
          />
          <PlanCard
            name={plans.max.name}
            tagline={taglines.max}
            price={`$${yearly ? plans.max.yearly : plans.max.monthly}`}
            period={yearly ? "/year plus tax" : "/month plus tax"}
            items={[...includes.max]}
            action={<PaidAction plan="max" checkout={checkout} yearly={yearly} />}
          />
        </div>

        <PricingQuestions />
      </div>
    </PublicPage>
  );
}
