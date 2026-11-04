import Link from "next/link";

import { Button } from "@/components/ui/button";

export const metadata = { title: "Terms of Service — StudioSpace" };

const sections = [
  {
    title: "1. Using StudioSpace",
    body: "StudioSpace is a marketplace that connects hosts who own creative space with guests who want to book it. We do not own, operate or insure any studio listed on the platform. By creating an account you confirm you are at least 18 years old and legally able to enter a contract.",
  },
  {
    title: "2. Host responsibilities",
    body: "Hosts must describe their space accurately, keep availability and pricing current, and honour every booking they confirm. Photos must represent the actual space. Listing a studio you do not control, or misrepresenting equipment, is grounds for immediate removal.",
  },
  {
    title: "3. Guest responsibilities",
    body: "Guests agree to leave a space in the condition they found it, respect the stated capacity limits and house rules, and vacate at the end of the reserved time range. Damage beyond normal wear is chargeable against the security deposit.",
  },
  {
    title: "4. Payments, deposits and cancellations",
    body: "Hourly rates and security deposits are set by the host and shown before booking. Pending requests can be cancelled by the guest at any time at no cost. Once a host confirms a reservation, the cancellation terms displayed on the listing apply. Security deposits are released automatically 48 hours after the booking ends unless a damage claim is filed.",
  },
  {
    title: "5. Liability",
    body: "StudioSpace provides host liability protection of up to $25,000 per confirmed booking as a courtesy, not as an insurer. We are not liable for loss, theft, injury or equipment damage that occurs on a host's premises.",
  },
  {
    title: "6. Changes to these terms",
    body: "We may update these terms as the platform grows. Material changes will be announced on the site and by email at least 14 days before they take effect.",
  },
];

export default function TermsPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary">
        Legal
      </p>
      <h1 className="font-display text-4xl font-extrabold tracking-tight">
        Terms of Service
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Last updated {new Date().toLocaleDateString("en-GB", { dateStyle: "long" })}
      </p>

      <div className="mt-10 space-y-8">
        {sections.map(({ title, body }) => (
          <div key={title}>
            <h2 className="font-display text-xl font-bold">{title}</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">{body}</p>
          </div>
        ))}
      </div>

      <div className="mt-14 flex flex-wrap gap-3 border-t border-border pt-8">
        <Button asChild variant="outline">
          <Link href="/privacy">Privacy Policy</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    </section>
  );
}
