import { Search, Clock, CalendarCheck, Clapperboard } from "lucide-react";

import { SectionHeading } from "@/components/shared/SectionHeading";

const steps = [
  {
    step: "01",
    icon: Search,
    title: "Discover Spaces",
    text: "Filter by category, budget, capacity and location to shortlist rooms that actually fit your shoot.",
  },
  {
    step: "02",
    icon: Clock,
    title: "Select Shoot Hours",
    text: "Pick a date and a start/end time. Live availability blocks out slots that are already confirmed.",
  },
  {
    step: "03",
    icon: CalendarCheck,
    title: "Book Instantly",
    text: "Send a reservation request with one click and download a PDF invoice the moment it's confirmed.",
  },
  {
    step: "04",
    icon: Clapperboard,
    title: "Create & Produce",
    text: "Show up, roll camera, and leave the cleanup to the host. Rate the space when you wrap.",
  },
];

export function HowItWorks() {
  return (
    <section className="border-y border-border bg-card/30">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="How booking works"
          title="From browse to rolling in four steps"
          subtitle="No phone calls, no deposits held hostage, no surprise fees. The whole flow lives inside StudioSpace."
        />

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(({ step, icon: Icon, title, text }) => (
            <div key={step} className="relative text-center sm:text-left">
              <div className="mb-5 inline-flex items-center gap-3">
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary">
                  <Icon className="h-6 w-6" />
                </span>
                <span className="font-display text-4xl font-extrabold text-border">
                  {step}
                </span>
              </div>

              <h3 className="font-display text-lg font-bold">{title}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                {text}
              </p>

              {/* connector line (desktop only) */}
              <span className="absolute -right-4 top-7 hidden h-px w-8 bg-border lg:block" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
