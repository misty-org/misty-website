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
import { SUBSCRIPTION_SETTINGS_PATH } from "@/lib/site";
import { useProCheckout } from "./useProCheckout";
import {
  cloudIncludes,
  cloudPlan,
  compareRows,
  freeIncludes,
  pricingQuestions,
} from "./plans";
import { SiteLink } from "@/components/SiteLink";

const sectionHeading =
  "text-center text-xl font-medium tracking-[-0.02em] text-foreground sm:text-2xl";
const buttonClass = "h-11 w-full rounded-full";

function PlanCard({
  name,
  price,
  period,
  items,
  action,
}: {
  name: string;
  price: string;
  period: string;
  items: string[];
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
      <p className="mt-4 flex items-baseline gap-2">
        <span className="text-4xl font-medium tracking-[-0.03em] text-foreground">
          {price}
        </span>
        <span className="text-base text-muted-foreground">{period}</span>
      </p>
      <div className="mt-6">{action}</div>
      <ul className="mt-8 grid gap-3 border-t border-border pt-6 text-base leading-7 text-foreground/85">
        {items.map((item) => (
          <li key={item} className="grid grid-cols-[1.25rem_1fr] gap-2.5">
            <Check aria-hidden="true" className="mt-1.5 size-4 text-foreground" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function ComparePlans() {
  return (
    <section aria-labelledby="compare-plans" className="mt-24">
      <h2 id="compare-plans" className={sectionHeading}>
        Compare plans
      </h2>
      <div className="mt-8 overflow-x-auto">
        <table className="w-full min-w-[34rem] border-collapse text-left text-base leading-6">
          <thead>
            <tr className="border-b border-border">
              <td className="w-1/4" />
              <th scope="col" className="w-[37.5%] py-3 pr-4 font-medium text-foreground">
                Free
              </th>
              <th scope="col" className="w-[37.5%] py-3 font-medium text-foreground">
                Misty Pro
              </th>
            </tr>
          </thead>
          <tbody>
            {compareRows.map(([label, free, pro]) => (
              <tr key={label} className="border-b border-border/60 align-top">
                <th scope="row" className="py-4 pr-4 font-normal text-foreground">
                  {label}
                </th>
                <td className="py-4 pr-4 text-muted-foreground">{free}</td>
                <td className="py-4 text-muted-foreground">{pro}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
    <section aria-labelledby="pricing-questions" className="mt-24">
      <h2 id="pricing-questions" className={sectionHeading}>
        Questions
      </h2>
      <Accordion type="multiple" className="mt-8 border-t border-border">
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
    return <Skeleton aria-hidden="true" className={buttonClass} />;
  }
  if (checkout.subscribed) {
    return (
      <Button asChild variant="outline" size="lg" className={buttonClass}>
        <SiteLink to={SUBSCRIPTION_SETTINGS_PATH}>Manage subscription</SiteLink>
      </Button>
    );
  }
  return (
    <div className="grid gap-2">
      <Button
        size="lg"
        className={buttonClass}
        disabled={checkout.starting}
        onClick={() => void checkout.start()}
      >
        Get Misty Pro
      </Button>
      {checkout.error ? (
        <p role="alert" className="text-base text-muted-foreground">
          {checkout.error}
        </p>
      ) : null}
    </div>
  );
}

/** Free and Misty Pro side by side, then the two compared, then the questions people ask. */
export default function Pricing() {
  const checkout = useProCheckout();
  return (
    <PublicPage>
      <div className="mx-auto max-w-4xl">
        <h1 className="pb-12 text-center marketing-heading text-foreground">
          {marketingCopy.pricing.title}
        </h1>

        <div className="grid gap-4 md:grid-cols-2">
          <PlanCard
            name="Free"
            price="$0"
            period="/month"
            items={freeIncludes}
            action={
              <Button asChild variant="outline" size="lg" className={buttonClass}>
                <SiteLink to="/docs/self-hosting">
                  Read the self-hosting guide
                </SiteLink>
              </Button>
            }
          />
          <PlanCard
            name="Misty Pro"
            price={`$${cloudPlan.price}`}
            period="/month plus tax"
            items={cloudIncludes}
            action={<ProAction checkout={checkout} />}
          />
        </div>

        <ComparePlans />
        <PricingQuestions />
      </div>
    </PublicPage>
  );
}
