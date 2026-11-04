import { NavLink } from "react-router";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { marketingCopy } from "@/content/marketingCopy";

export default function Waitlist() {
  return (
    <div
      aria-labelledby="waitlist-title"
      className="bg-background pb-20 pt-8 text-foreground sm:pt-12"
    >
      <div className="site-container grid gap-10 lg:grid-cols-[minmax(0,1fr)_28rem] lg:items-start lg:gap-20">
        <section className="pt-1" aria-label="Join Misty">
          <h1
            id="waitlist-title"
            className="max-w-2xl marketing-heading text-foreground"
          >
            {marketingCopy.waitlist.title}
          </h1>
        </section>

        <Card className="gap-0 rounded-xl py-0 shadow-xl ring-1 ring-foreground/10">
          <CardContent className="p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-card-foreground">
              Sign in to Misty
            </h2>
            <Button asChild size="lg" className="mt-6 h-11 w-full">
              <NavLink to="/register">Join now</NavLink>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
