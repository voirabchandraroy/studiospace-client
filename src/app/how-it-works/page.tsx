import Link from "next/link";
import { Search, Clock, CalendarCheck, Clapperboard, ShieldCheck, BadgeCheck, PackageCheck, Headset } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/shared/SectionHeading";

export const metadata = { title: "How It Works — StudioSpace" };

const steps = [
  {
    icon: Search,
    title: "Discover Spaces",
    text: "Filter the marketplace by discipline, hourly budget, crew capacity and city. Every listing shows real photos, the full amenity list and the host's rating, so you can shortlist confidently before you ever send a message.",
  },
  {
    icon: Clock,
    title: "Select Shoot Hours",
    text: "Choose a date and a start/end time. StudioSpace checks your range against every confirmed booking for that studio and blocks out the slots that are already taken, so you always see live availability.",
  },
  {
    icon: CalendarCheck,
    title: "Book Instantly",
    text: "Send a reservation request in one click. The host approves it (usually within a few hours), and the moment it flips to Confirmed you can download a branded PDF invoice for your records or your client.",
  },
  {
    icon: Clapperboard,
    title: "Create & Produce",
    text: "Turn up, roll camera, and get out on time. Deposits are released automatically 48 hours after wrap, and you can rate the space so the next creator books with the same confidence you did.",
  },
];

const guarantees = [
  {
    icon: ShieldCheck,
    title: "Liability protection",
    text: "Host liability cover up to $25,000 on every confirmed booking, included free with your account.",
  },
  {
    icon: BadgeCheck,
    title: "Verified profiles",
    text: "Guests verify their email and identity before their first booking. Hosts verify their space with photos and a walkthrough.",
  },
  {
    icon: PackageCheck,
    title: "Equipment safety",
    text: "Security deposits are held against damage claims and released automatically two days after the shoot.",
  },
  {
    icon: Headset,
    title: "24/7 host support",
    text: "Our creator support team replies in under 15 minutes, any hour, anywhere in the world.",
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <section className="border-b border-border bg-card/30">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <SectionHeading
            align="left"
            eyebrow="How it works"
            title="Booking a studio, start to finish"
            subtitle="Four steps, no phone tag, no surprise fees. Here's exactly what happens between browsing and rolling camera."
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2">
          {steps.map(({ icon: Icon, title, text }, i) => (
            <div
              key={title}
              className="rounded-2xl border border-border bg-card p-7 transition-all hover:-translate-y-1 hover:border-primary/50"
            >
              <div className="mb-5 flex items-center gap-4">
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary">
                  <Icon className="h-6 w-6" />
                </span>
                <span className="font-display text-4xl font-extrabold text-border">
                  0{i + 1}
                </span>
              </div>
              <h2 className="font-display text-xl font-bold">{title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-card/30">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Host guarantee"
            title="What we promise every host"
            subtitle="Listing a space on StudioSpace is designed to be low-risk. These four protections ship with every account."
          />

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {guarantees.map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-2xl border border-border bg-background p-6">
                <span className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="font-display text-base font-bold">{title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
        <h2 className="font-display text-3xl font-extrabold tracking-tight">
          Ready to book your next shoot?
        </h2>
        <p className="mt-4 text-muted-foreground">
          Hundreds of verified spaces are waiting — from a one-person podcast booth to a
          5,000 sq ft drive-in stage.
        </p>
        <Button asChild size="lg" className="mt-8">
          <Link href="/studios">Explore studios</Link>
        </Button>
      </section>
    </>
  );
}
