import { marketingCopy } from "@/content/marketingCopy";

export default function PricingHeader() {
  return (
    <header className="mx-auto max-w-3xl text-center">
      <h1 className="marketing-heading text-foreground">
        {marketingCopy.pricing.title}
      </h1>
      <p className="mt-4 text-pretty marketing-description text-muted-foreground">
        {marketingCopy.pricing.description}
      </p>
    </header>
  );
}
