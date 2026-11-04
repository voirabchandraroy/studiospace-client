import { Suspense } from "react";

import { StudiosExplorer } from "@/components/studios/StudiosExplorer";
import { Spinner } from "@/components/shared/Loading";

export const metadata = { title: "Explore Studios — StudioSpace" };

export default function StudiosPage() {
  return (
    <>
      {/* Page header */}
      <section className="border-b border-border bg-card/30">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary">
            Marketplace
          </p>
          <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
            Explore creative studios
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
            Every listing is verified, priced per hour and bookable in a couple of clicks.
            Filter by discipline, then check live availability before you reserve.
          </p>
        </div>
      </section>

      <Suspense fallback={<Spinner />}>
        <StudiosExplorer />
      </Suspense>
    </>
  );
}
