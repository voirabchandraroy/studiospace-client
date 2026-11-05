"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PrivateRoute } from "@/components/shared/PrivateRoute";
import { EmptyState } from "@/components/shared/EmptyState";
import { StudioCard } from "@/components/shared/StudioCard";
import { getStudios, getWishlist } from "@/lib/api";
import type { Studio } from "@/lib/types";

function WishlistContent() {
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getWishlist()
      .then(async ({ data }) => {
        setSavedIds(data);
        if (data.length === 0) {
          setStudios([]);
          return;
        }
        // Pull the full studio documents for the saved ids
        const { data: list } = await getStudios({});
        setStudios(list.filter((s) => data.includes(s._id)));
      })
      .catch(() => setStudios([]))
      .finally(() => setLoading(false));
  }, []);

  const handleToggleSave = (studioId: string, saved: boolean) => {
    setSavedIds((prev) =>
      saved ? [...prev, studioId] : prev.filter((id) => id !== studioId)
    );
    if (!saved) setStudios((prev) => prev.filter((s) => s._id !== studioId));
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10">
        <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary">
          <Heart className="h-3.5 w-3.5" /> Wishlist
        </p>
        <h1 className="font-display text-4xl font-extrabold tracking-tight">
          Saved studios
        </h1>
        <p className="mt-2 text-muted-foreground">
          Spaces you hearted, kept in one place so you can book them later.
        </p>
      </div>

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-80 w-full" />
          ))}
        </div>
      ) : studios.length === 0 ? (
        <EmptyState
          icon={<Heart className="h-8 w-8" />}
          title="Your wishlist is empty"
          description="Tap the heart on any studio card and it will show up here instantly."
          action={
            <Button asChild>
              <Link href="/studios">
                <Search /> Find a studio
              </Link>
            </Button>
          }
        />
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

export default function WishlistPage() {
  return (
    <PrivateRoute>
      <WishlistContent />
    </PrivateRoute>
  );
}
