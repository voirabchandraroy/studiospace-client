"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, SearchX } from "lucide-react";

import { StudioCard, StudioCardSkeleton } from "@/components/shared/StudioCard";
import { Button } from "@/components/ui/button";
import { getFeaturedStudios, getWishlist } from "@/lib/api";
import type { Studio } from "@/lib/types";
import { useAuth } from "@/providers/AuthProvider";

export function FeaturedStudios() {
  const { user } = useAuth();
  const [studios, setStudios] = useState<Studio[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFeaturedStudios()
      .then(({ data }) => setStudios(data))
      .catch(() => setStudios([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!user) {
      setSavedIds([]);
      return;
    }
    getWishlist()
      .then(({ data }) => setSavedIds(data))
      .catch(() => setSavedIds([]));
  }, [user]);

  const handleToggleSave = (studioId: string, saved: boolean) => {
    setSavedIds((prev) =>
      saved ? [...prev, studioId] : prev.filter((id) => id !== studioId)
    );
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary">
            Featured
          </p>
          <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            Top-rated studios this month
          </h2>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-muted-foreground">
            Hand-picked spaces with the best host ratings, cleanest gear and fastest
            response times — pulled live from our database.
          </p>
        </div>

        <Button asChild variant="outline">
          <Link href="/studios">
            View all studios <ArrowRight />
          </Link>
        </Button>
      </div>

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <StudioCardSkeleton key={i} />
          ))}
        </div>
      ) : studios.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/40 px-6 py-16 text-center">
          <div className="mb-5 grid h-16 w-16 place-items-center rounded-2xl bg-primary/10 text-primary">
            <SearchX className="h-8 w-8" />
          </div>
          <h3 className="font-display text-xl font-bold">No studios listed yet</h3>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Be the first host on StudioSpace — list your creative space and start
            earning from idle hours.
          </p>
          <Button asChild className="mt-6">
            <Link href="/add-studio">List your studio</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {studios.map((studio) => (
            <StudioCard
              key={studio._id}
              studio={studio}
              savedIds={savedIds}
              onToggleSave={handleToggleSave}
            />
          ))}
        </div>
      )}
    </section>
  );
}
