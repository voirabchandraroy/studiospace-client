import Link from "next/link";
import { ArrowRight, Building2 } from "lucide-react";

import { Button } from "@/components/ui/button";

export function CtaBanner() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/15 via-accent/10 to-transparent px-6 py-14 text-center sm:px-14">
        <div className="film-grain absolute inset-0 opacity-30" aria-hidden />

        <div className="relative mx-auto max-w-2xl">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary">
            <Building2 className="h-3.5 w-3.5" /> For hosts
          </span>

          <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            Your studio sits empty 60% of the week
          </h2>

          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Turn those idle hours into revenue. Listing is free, you set the rate, and you
            approve every single booking request.
          </p>

          <Button asChild size="lg" className="mt-8">
            <Link href="/add-studio">
              List your space free <ArrowRight />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
