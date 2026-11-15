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
import { BOOSTS_SETTINGS_PATH, DISCORD_URL, SUBSCRIPTION_SETTINGS_PATH, SUPPORT_EMAIL } from "@/lib/site";
import { usePlanCheckout } from "./usePlanCheckout";
import {
  boost,
  includes,
  levelRows,
  plans,
  pricingQuestions,
  spaceLevels,
  storagePerBoost,
  taglines,
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
          </a>{" "}
          or email{" "}
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="text-foreground underline underline-offset-4"
          >
            {SUPPORT_EMAIL}
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

/** Misty+'s buttons: checkout (monthly, or yearly), or for someone who has it, their subscription. */
function PlusAction({ checkout }: { checkout: ReturnType<typeof usePlanCheckout> }) {
  if (checkout.checking) {
    return <Skeleton aria-hidden="true" className={buttonSkeletonClass} />;
  }
  if (checkout.plan === "plus") {
    return (
      <Button asChild variant="outline" size="lg">
        <SiteLink to={SUBSCRIPTION_SETTINGS_PATH}>Manage subscription</SiteLink>
      </Button>
    );
  }
  return (
    <div className="flex flex-col items-start gap-2">
      <div className="flex flex-wrap gap-2">
        <Button size="lg" disabled={checkout.starting !== null} onClick={() => void checkout.start("plus")}>
          Get {plans.plus.name}
        </Button>
        <Button
          size="lg"
          variant="outline"
          disabled={checkout.starting !== null}
          onClick={() => void checkout.start("plus_yearly")}
        >
          ${plans.plus.yearly} a year
        </Button>
      </div>
      {checkout.error ? (
        <p role="alert" className="text-base text-muted-foreground">
          {checkout.error}
        </p>
      ) : null}
    </div>
  );
}

/** What each Space level allows, beside a short heading, like the questions below it. */
function SpaceLevels() {
  return (
    <section
      aria-labelledby="space-levels"
      className="mt-24 grid items-start gap-8 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.7fr)] md:gap-16"
    >
      <div className="grid gap-2">
        <h2
          id="space-levels"
          className="text-xl font-medium tracking-[-0.02em] text-foreground sm:text-2xl"
        >
          Space levels
        </h2>
        <p className="text-base text-muted-foreground">
          Boosts from everyone in a Space add up. Each Boost past a level adds {storagePerBoost} more
          shared storage.
        </p>
      </div>
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[32rem] text-left text-sm">
          <thead>
            <tr className="border-b border-border">
              <th scope="col" className="px-4 py-3 font-normal text-muted-foreground">
                <span className="sr-only">Limit</span>
              </th>
              {spaceLevels.map((level) => (
                <th key={level.name} scope="col" className="px-4 py-3 font-medium text-foreground">
                  {level.name}
                  <span className="block text-xs font-normal text-muted-foreground">
                    {level.boosts ? `${level.boosts} Boosts` : "No Boosts"}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {levelRows.map((row) => (
              <tr key={row.key} className="border-b border-border last:border-b-0">
                <th scope="row" className="px-4 py-3 font-normal text-muted-foreground">
                  {row.label}
                </th>
                {spaceLevels.map((level) => (
                  <td key={level.name} className="px-4 py-3 text-foreground">
                    {level[row.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

/** Free, Misty+ and Boosts side by side, then Space levels and the questions people ask. */
export default function Pricing() {
  const checkout = usePlanCheckout();
  return (
    <PublicPage>
      <div>
        <h1 className="pb-12 text-center marketing-heading text-foreground">
          {marketingCopy.pricing.title}
        </h1>

        <div className="grid gap-4 md:grid-cols-3">
          <PlanCard
            name={plans.free.name}
            tagline={taglines.free}
            price="$0"
            period="/month"
            items={[
              ...includes.free,
              <>
                Or host your own server, with every Space unlimited, using{" "}
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
            name={plans.plus.name}
            tagline={taglines.plus}
            price={`$${plans.plus.monthly}`}
            period="/month plus tax"
            items={[...includes.plus]}
            action={<PlusAction checkout={checkout} />}
          />
          <PlanCard
            name={boost.name}
            tagline={taglines.boost}
            price={`$${boost.price}`}
            period="/month per Boost"
            items={[...includes.boost]}
            action={
              <Button asChild variant="outline" size="lg">
                <SiteLink to={BOOSTS_SETTINGS_PATH}>Boost a Space</SiteLink>
              </Button>
            }
          />
        </div>

        <SpaceLevels />
        <PricingQuestions />
      </div>
    </PublicPage>
  );
}
