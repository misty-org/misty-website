import { describe, expect, it } from "vitest";

import { marketingCopy } from "@/content/marketingCopy";
import {
  ownerRules,
  planLimitRows,
  plans,
  pricingFaqs,
  PRICING_MODEL,
} from "@/pages/Pricing/data";
import { renewalSummary } from "@/pages/Pricing/renewalTerms";

describe("pricing contract", () => {
  it("publishes Basic, Pro, Max, Ultra and Ultra+", () => {
    expect(plans.map((plan) => plan.id)).toEqual(["free", "pro", "max", "ultra", "ultra_plus"]);
    expect(plans.map((plan) => plan.name)).toEqual(["Basic", "Pro", "Max", "Ultra", "Ultra+"]);
  });

  it("publishes exact monthly and annual prices, with two months free yearly", () => {
    expect(plans[0].prices.month.price).toBe("Free");
    expect(plans[0].prices.year.price).toBe("Free");
    const expected = [
      ["$12", "$120", "$24"],
      ["$20", "$200", "$40"],
      ["$100", "$1,000", "$200"],
      ["$200", "$2,000", "$400"],
    ];
    expected.forEach(([month, year, savings], index) => {
      const plan = plans[index + 1];
      expect(plan.prices.month.price).toBe(month);
      expect(plan.prices.year.price).toBe(year);
      expect(plan.prices.year.billingNote).toBe(`Two months free: save ${savings} a year`);
    });
  });

  it("keeps internal usage and per-seat terminology out of customer copy", () => {
    const customerCopy = JSON.stringify({
      plans,
      planLimitRows,
      ownerRules,
      pricingFaqs,
      home: marketingCopy.home,
      pricing: marketingCopy.pricing,
      metadata: {
        home: marketingCopy.metadata.home,
        pricing: marketingCopy.metadata.pricing,
      },
    });
    expect(customerCopy).not.toMatch(
      /(?:hosted ai|credits?|tokens?|micro-usd|provider costs?|per-seat)/i,
    );
  });

  it("publishes the storage billing enforces (account-v2)", () => {
    expect(plans[0].features).toContain("5 GB storage");
    expect(plans[1].features).toContain("50 GB storage");
    expect(plans[2].features).toContain("200 GB storage");
    expect(plans[3].features).toContain("1 TB storage");
    expect(plans[4].features).toContain("2 TB storage");
    expect(PRICING_MODEL.ultra.storage).toBe("1 TB");
  });

  it("promises every feature on every plan and no trial", () => {
    for (const plan of plans) expect(plan.features).toContain("Every Misty feature");
    const customerCopy = JSON.stringify({ ownerRules, pricingFaqs });
    expect(customerCopy).toMatch(/Basic is the trial/i);
    expect(customerCopy).toMatch(/refills five hours after a session starts/i);
    expect(customerCopy).toMatch(/A task that is already running/i);
    expect(customerCopy).not.toMatch(/free for 14 days/i);
  });

  it("states price, cadence, and renewal next to every paid checkout", () => {
    expect(renewalSummary("pro", "month")).toBe(
      "$12/month plus applicable tax, renewing monthly until you cancel.",
    );
    expect(renewalSummary("ultra_plus", "year")).toBe(
      "$2,000/year plus applicable tax, renewing yearly until you cancel.",
    );
  });
});
