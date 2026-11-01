import { Check } from "lucide-react";
import type { ReactNode } from "react";
import { NavLink } from "react-router";

import { PageHeader, PublicPage } from "@/components/marketing";
import { Button } from "@/components/ui/button";
import { marketingCopy } from "@/content/marketingCopy";
import {
  CLOUD_CHECKOUT_STORAGE_URL,
  CLOUD_CHECKOUT_URL,
  CUSTOMER_PORTAL_URL,
} from "@/lib/site";
import {
  cloudIncludes,
  cloudPlan,
  freeIncludes,
  pricingDetails,
} from "./plans";

function PlanCard({
  name,
  price,
  period,
  summary,
  items,
  action,
  footnote,
}: {
  name: string;
  price: string;
  period: string;
  summary: string;
  items: string[];
  action: ReactNode;
  footnote?: ReactNode;
}) {
  const id = `plan-${name.toLowerCase().replace(/\s+/g, "-")}`;
  return (
    <section
      aria-labelledby={id}
      className="flex flex-col rounded-xl border border-border bg-card p-6 sm:p-8"
    >
      <h2 id={id} className="text-base font-medium text-foreground">
        {name}
      </h2>
      <p className="mt-4 flex items-baseline gap-1.5">
        <span className="text-4xl font-medium tracking-[-0.03em] text-foreground">
          {price}
        </span>
        <span className="text-sm text-muted-foreground">{period}</span>
      </p>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">{summary}</p>
      <ul className="mt-6 grid gap-3 border-t border-border pt-6 text-sm leading-6 text-foreground/85">
        {items.map((item) => (
          <li key={item} className="grid grid-cols-[1.25rem_1fr] gap-2">
            <Check aria-hidden="true" className="mt-1 size-4 text-foreground" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
      <div className="mt-auto pt-8">{action}</div>
      {footnote ? (
        <div className="mt-3 grid gap-1.5 text-xs leading-5 text-muted-foreground">
          {footnote}
        </div>
      ) : null}
    </section>
  );
}

const footLink =
  "text-foreground underline underline-offset-4 hover:text-foreground/80";

/** Free and Misty Cloud side by side, then what each Cloud limit counts. */
export default function Pricing() {
  return (
    <PublicPage>
      <PageHeader
        label="Pricing"
        title={marketingCopy.pricing.title}
        description={marketingCopy.pricing.description}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <PlanCard
          name="Free"
          price="$0"
          period="forever"
          summary="Misty with every feature, on a server you set up yourself."
          items={freeIncludes}
          action={
            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full rounded-full"
            >
              <NavLink to="/docs/self-hosting">
                Read the self-hosting guide
              </NavLink>
            </Button>
          }
        />
        <PlanCard
          name="Misty Cloud"
          price={`$${cloudPlan.price}`}
          period="a month, plus tax where it applies"
          summary="Misty with every feature, on a server that's already set up for you."
          items={cloudIncludes}
          action={
            <Button asChild size="lg" className="w-full rounded-full">
              <a href={CLOUD_CHECKOUT_URL}>Get Misty Cloud</a>
            </Button>
          }
          footnote={
            <>
              <p>
                Need more room?{" "}
                <a href={CLOUD_CHECKOUT_STORAGE_URL} className={footLink}>
                  Get Misty Cloud with {cloudPlan.storageAddOn.gb} GB more
                </a>{" "}
                for ${cloudPlan.storageAddOn.price} a month more.
              </p>
              <p>
                Already subscribed?{" "}
                <a href={CUSTOMER_PORTAL_URL} className={footLink}>
                  Manage your subscription
                </a>
                .
              </p>
            </>
          }
        />
      </div>

      <p className="mt-8 rounded-xl border border-border px-6 py-5 text-base leading-7 text-foreground">
        AI is never charged for, because it always runs on your own models.
      </p>

      <section aria-labelledby="pricing-details" className="mt-16 max-w-3xl">
        <h2
          id="pricing-details"
          className="text-xl font-medium tracking-[-0.02em] text-foreground"
        >
          What Misty Cloud counts
        </h2>
        <dl className="mt-6 grid border-t border-border">
          {pricingDetails.map(({ term, detail }) => (
            <div
              key={term}
              className="grid gap-1 border-b border-border py-4 sm:grid-cols-[12rem_1fr] sm:gap-6"
            >
              <dt className="text-sm font-medium text-foreground">{term}</dt>
              <dd className="text-sm leading-6 text-muted-foreground">
                {detail}
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-6 text-sm text-muted-foreground">
          Prices are in US dollars, plus tax where it applies. See the{" "}
          <NavLink
            to="/terms#cloud"
            className="text-foreground underline underline-offset-4"
          >
            Terms
          </NavLink>{" "}
          for billing and cancellation, and the{" "}
          <NavLink
            to="/docs"
            className="text-foreground underline underline-offset-4"
          >
            docs
          </NavLink>{" "}
          for how Misty works.
        </p>
      </section>
    </PublicPage>
  );
}
