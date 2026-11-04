"use client";

import Link from "next/link";
import { Home, Search, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto flex min-h-[80vh] max-w-5xl flex-col items-center justify-center px-4 text-center sm:px-6">
        {/* Creative studio illustration (inline SVG — no external assets) */}
        <svg
          viewBox="0 0 420 260"
          className="mb-8 h-48 w-full max-w-md sm:h-56"
          role="img"
          aria-label="An empty studio with a spotlight and camera"
        >
          <defs>
            <linearGradient id="nf-floor" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.18" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          <g className="text-primary">
            {/* spotlight beam */}
            <path d="M210 8 L150 150 L270 150 Z" fill="currentColor" opacity="0.12" />
            {/* spotlight housing */}
            <rect x="180" y="0" width="60" height="26" rx="8" fill="currentColor" opacity="0.9" />
            <circle cx="210" cy="26" r="6" fill="currentColor" />
          </g>

          <g className="text-muted-foreground">
            {/* backdrop wall */}
            <rect
              x="70"
              y="70"
              width="280"
              height="120"
              rx="10"
              fill="url(#nf-floor)"
              stroke="currentColor"
              strokeOpacity="0.25"
              strokeWidth="2"
            />
            {/* floor */}
            <path
              d="M40 190 L380 190 L410 236 L10 236 Z"
              fill="currentColor"
              opacity="0.08"
            />
            {/* tripod */}
            <path
              d="M188 190 L210 150 L232 190 M198 190 L210 168 L222 190"
              stroke="currentColor"
              strokeOpacity="0.45"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
            {/* camera body */}
            <rect
              x="188"
              y="126"
              width="46"
              height="30"
              rx="6"
              fill="currentColor"
              opacity="0.35"
            />
            <circle cx="211" cy="141" r="9" fill="currentColor" opacity="0.55" />
            {/* clapperboard */}
            <g transform="translate(268 152)">
              <rect width="54" height="34" rx="5" fill="currentColor" opacity="0.28" />
              <path d="M0 12 L54 12" stroke="currentColor" strokeOpacity="0.5" strokeWidth="3" />
              <path
                d="M4 4 L14 -6 M18 4 L28 -6 M32 4 L42 -6"
                stroke="currentColor"
                strokeOpacity="0.5"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </g>
          </g>

          <text
            x="210"
            y="258"
            textAnchor="middle"
            className="fill-current text-muted-foreground"
            style={{ fontSize: 13, letterSpacing: 6, opacity: 0.5 }}
          >
            SCENE NOT FOUND
          </text>
        </svg>

        <p className="font-display text-7xl font-extrabold tracking-tighter text-primary sm:text-8xl">
          404
        </p>

        <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          This scene never made the cut
        </h1>

        <p className="mt-4 max-w-lg text-base leading-relaxed text-muted-foreground">
          The studio page you&apos;re looking for has been moved, unlisted, or the shoot
          wrapped early. Let&apos;s roll you back to somewhere real.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg">
            <Link href="/">
              <Home /> Return to Home
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/studios">
              <Search /> Browse Studios
            </Link>
          </Button>
        </div>

        <button
          onClick={() => window.history.back()}
          className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" /> Go back to the previous page
        </button>
      </div>
    </section>
  );
}
