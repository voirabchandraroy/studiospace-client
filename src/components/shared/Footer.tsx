"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Aperture, Send, Instagram, Linkedin, Youtube, Facebook } from "lucide-react";

import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { STUDIO_CATEGORIES } from "@/lib/types";

/** Brand-new X logo (NOT the old Twitter bird) */
const XLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/studios", label: "Explore Studios" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/about", label: "About Us" },
];

const companyLinks = [
  { href: "/add-studio", label: "Host Your Space" },
  { href: "/dashboard", label: "Creator Dashboard" },
  { href: "/my-bookings", label: "My Bookings" },
  { href: "/wishlist", label: "Saved Studios" },
];

const socials = [
  { label: "X", href: "https://x.com", Icon: XLogo },
  { label: "Instagram", href: "https://instagram.com", Icon: Instagram },
  { label: "YouTube", href: "https://youtube.com", Icon: Youtube },
  { label: "LinkedIn", href: "https://linkedin.com", Icon: Linkedin },
  { label: "Facebook", href: "https://facebook.com", Icon: Facebook },
];

export function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email to subscribe.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("That email address doesn't look right.");
      return;
    }
    toast.success("You're on the list! Studio drops coming to your inbox.");
    setEmail("");
  };

  return (
    <footer className="mt-24 border-t border-border bg-card/40">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              StudioSpace connects filmmakers, photographers, podcasters and musicians
              with verified creative spaces — bookable by the hour, anywhere.
            </p>
            <div className="mt-5 flex items-center gap-2">
              {socials.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={label}
                  className="grid h-9 w-9 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary hover:bg-primary/10 hover:text-primary"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-display text-sm font-bold uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-display text-sm font-bold uppercase tracking-wider">
              Popular Categories
            </h3>
            <ul className="mt-4 space-y-2.5">
              {STUDIO_CATEGORIES.map((category) => (
                <li key={category}>
                  <Link
                    href={`/studios?category=${encodeURIComponent(category)}`}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-display text-sm font-bold uppercase tracking-wider">
              Creator Newsletter
            </h3>
            <p className="mt-4 text-sm text-muted-foreground">
              New spaces, gear deals and booking tips — once a month, no spam.
            </p>
            <form onSubmit={handleSubscribe} className="mt-4 flex gap-2">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@studio.com"
                aria-label="Email address"
              />
              <Button type="submit" size="icon" aria-label="Subscribe">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
          <p className="text-center text-xs text-muted-foreground sm:text-left">
            &copy; {new Date().getFullYear()} StudioSpace. All rights reserved.
          </p>
          <p className="flex items-center gap-3 text-xs text-muted-foreground">
            <Link href="/terms" className="hover:text-primary">
              Terms of Service
            </Link>
            <span aria-hidden>&bull;</span>
            <Link href="/privacy" className="hover:text-primary">
              Privacy Policy
            </Link>
            <span aria-hidden>&bull;</span>
            <span>Built for creators</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
