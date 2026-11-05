import Link from "next/link";
import { Camera, Clapperboard, Mic, Music, Palette, ArrowUpRight } from "lucide-react";

import { SectionHeading } from "@/components/shared/SectionHeading";
import { STUDIO_CATEGORIES } from "@/lib/types";

/**
 * `label` is the friendly wording shown on the card;
 * `value` is the canonical category stored in MongoDB (STUDIO_CATEGORIES).
 * Keeping them separate means clicking a card always hits a populated filter.
 */
const categories = [
  {
    label: "Photo Studios",
    value: STUDIO_CATEGORIES[0], // Photo Studio
    icon: Camera,
    blurb: "Cyc walls, natural light & strobe kits",
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80",
  },
  {
    label: "Sound Stages",
    value: STUDIO_CATEGORIES[1], // Film Stage
    icon: Clapperboard,
    blurb: "Pre-lit sets, green screens & grip",
    image:
      "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?auto=format&fit=crop&w=900&q=80",
  },
  {
    label: "Podcast Rooms",
    value: STUDIO_CATEGORIES[2], // Podcast Lounge
    icon: Mic,
    blurb: "Treated rooms & broadcast consoles",
    image:
      "https://images.unsplash.com/photo-1587731556938-38755b4803a6?auto=format&fit=crop&w=900&q=80",
  },
  {
    label: "Music Suites",
    value: STUDIO_CATEGORIES[3], // Music Suite
    icon: Music,
    blurb: "Isolation booths & analog consoles",
    image:
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=900&q=80",
  },
  {
    label: "Art Workshops",
    value: STUDIO_CATEGORIES[4], // Art Workshop
    icon: Palette,
    blurb: "Messy-friendly benches & kilns",
    image:
      "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=900&q=80",
  },
];

export function CategorySection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Browse by category"
        title="Find the right room for the work"
        subtitle="Every space is verified before it goes live. Pick a discipline and we'll filter the marketplace for you."
      />

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {categories.map(({ label, value, icon: Icon, blurb, image }) => (
          <Link
            key={value}
            href={`/studios?category=${encodeURIComponent(value)}`}
            className="group relative flex h-64 flex-col justify-end overflow-hidden rounded-2xl border border-border p-5 transition-all hover:-translate-y-1 hover:border-primary/60 hover:shadow-xl hover:shadow-primary/10"
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
              style={{
                backgroundImage: `linear-gradient(135deg, oklch(0.25 0.04 270), oklch(0.45 0.08 55)), url(${image})`,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/10" />

            <div className="relative">
              <span className="mb-3 grid h-11 w-11 place-items-center rounded-xl bg-white/15 text-white backdrop-blur transition-colors group-hover:bg-primary">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="flex items-center gap-1.5 font-display text-lg font-bold text-white">
                {label}
                <ArrowUpRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
              </h3>
              <p className="mt-1 text-sm text-white/70">{blurb}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
