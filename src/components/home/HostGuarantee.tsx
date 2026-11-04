import { ShieldCheck, BadgeCheck, PackageCheck, Headset } from "lucide-react";

import { SectionHeading } from "@/components/shared/SectionHeading";

const guarantees = [
  {
    icon: ShieldCheck,
    title: "Liability protection",
    text: "Every confirmed booking is covered by host liability protection up to $25,000, at no extra cost to you.",
  },
  {
    icon: BadgeCheck,
    title: "Verified profiles",
    text: "Guests verify their email and ID before their first booking, so you always know who is walking in.",
  },
  {
    icon: PackageCheck,
    title: "Equipment safety",
    text: "Security deposits are held against damage claims and released automatically 48 hours after wrap.",
  },
  {
    icon: Headset,
    title: "24/7 host support",
    text: "Our creator support team answers in under 15 minutes — day or night, anywhere in the world.",
  },
];

export function HostGuarantee() {
  return (
    <section className="relative overflow-hidden">
      <div className="spotlight absolute inset-0" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Host guarantee"
          title="Creator support that has your back"
          subtitle="Listing your space should feel safe. These four promises ship with every StudioSpace account."
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {guarantees.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
            >
              <span className="mb-5 grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-6 w-6" />
              </span>
              <h3 className="font-display text-base font-bold">{title}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                {text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
