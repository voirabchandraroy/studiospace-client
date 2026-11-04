import Link from "next/link";
import { Aperture, Users, Building2, CalendarCheck, Globe2, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/shared/SectionHeading";

export const metadata = { title: "About Us — StudioSpace" };

const values = [
  {
    icon: Users,
    title: "Built by crew, for crew",
    text: "Our founders spent a decade losing deposits on spaces that looked nothing like the listing. StudioSpace exists so nobody has to book blind again.",
  },
  {
    icon: Globe2,
    title: "Local first, global always",
    text: "Every city has empty studios and creators who can't afford them. We connect the two, neighbourhood by neighbourhood.",
  },
  {
    icon: Sparkles,
    title: "Transparent by default",
    text: "Hourly rate, deposit, amenities and real availability — visible before you book, never revealed after payment.",
  },
];

const milestones = [
  { icon: Building2, value: "240+", label: "Verified studios" },
  { icon: Users, value: "3,100+", label: "Active creators" },
  { icon: CalendarCheck, value: "12,000+", label: "Hours booked" },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-card/30">
        <div className="spotlight absolute inset-0" aria-hidden />
        <div className="relative mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <span className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-2xl bg-primary/10 text-primary">
            <Aperture className="h-8 w-8" />
          </span>
          <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
            We&apos;re putting the world&apos;s{" "}
            <span className="text-gradient">idle studios</span> back to work
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground">
            StudioSpace is a peer-to-peer marketplace for creative space. Photography cyc
            walls, cinema sound stages, podcast lounges, music suites and art workshops —
            listed by the people who own them, booked by the people who need them, by the
            hour.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-3">
          {milestones.map(({ icon: Icon, value, label }) => (
            <div
              key={label}
              className="rounded-2xl border border-border bg-card p-7 text-center"
            >
              <Icon className="mx-auto mb-4 h-7 w-7 text-primary" />
              <p className="font-display text-3xl font-extrabold">{value}</p>
              <p className="mt-1.5 text-sm text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Our mission"
          title="Make great creative space accessible to anyone with an idea"
          subtitle="Talent is evenly distributed. Access to a decent room to work in is not. We're closing that gap one listing at a time."
        />

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {values.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="rounded-2xl border border-border bg-card p-7 transition-all hover:-translate-y-1 hover:border-primary/50"
            >
              <span className="mb-5 grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-6 w-6" />
              </span>
              <h3 className="font-display text-lg font-bold">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6">
        <h2 className="font-display text-3xl font-extrabold tracking-tight">
          Got a space sitting empty?
        </h2>
        <p className="mt-4 text-muted-foreground">
          List it for free, set your own rate, and approve every request yourself.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg">
            <Link href="/add-studio">Host your space</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/studios">Explore studios</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
