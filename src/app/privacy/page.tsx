import Link from "next/link";

import { Button } from "@/components/ui/button";

export const metadata = { title: "Privacy Policy — StudioSpace" };

const sections = [
  {
    title: "What we collect",
    body: "When you register we store your name, email address and (optionally) a profile photo URL. If you list a studio we also store the listing details you provide — title, category, rates, location, photos and amenities. Passwords are hashed with bcrypt and are never stored or logged in plain text.",
  },
  {
    title: "How we use it",
    body: "Your data powers the core features of the platform: matching you with studios, showing hosts who is booking their space, and sending booking notifications. We do not sell your personal information to third parties, ever.",
  },
  {
    title: "Cookies & authentication",
    body: "We issue a single HTTPOnly cookie containing a signed JSON Web Token when you log in. Because it is HTTPOnly, browser JavaScript cannot read it, which protects your session against cross-site scripting. The cookie expires seven days after it is issued.",
  },
  {
    title: "Google sign-in",
    body: "If you choose to continue with Google, Google tells us your name, email and avatar. We store those three values only — never your Google password, and never your contacts or drive files.",
  },
  {
    title: "Your rights",
    body: "You can edit your profile, delete your listings, and request a full export or deletion of your account data at any time by contacting the support team. Deletion requests are honoured within 30 days.",
  },
  {
    title: "Data retention",
    body: "Booking records are retained for seven years for tax and dispute-resolution purposes, even after an account is closed. Everything else is removed on deletion.",
  },
];

export default function PrivacyPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary">
        Legal
      </p>
      <h1 className="font-display text-4xl font-extrabold tracking-tight">
        Privacy Policy
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
          <Link href="/terms">Terms of Service</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    </section>
  );
}
