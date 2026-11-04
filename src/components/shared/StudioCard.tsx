"use client";

import Link from "next/link";
import { MapPin, Star, Users, Heart } from "lucide-react";
import { toast } from "sonner";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/providers/AuthProvider";
import { toggleWishlist } from "@/lib/api";
import { cn, formatRate } from "@/lib/utils";
import type { Studio } from "@/lib/types";

export function StudioCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="h-52 w-full rounded-none" />
      <div className="space-y-3 p-5">
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-9 w-full" />
      </div>
    </Card>
  );
}

export function StudioCard({
  studio,
  savedIds,
  onToggleSave,
}: {
  studio: Studio;
  savedIds?: string[];
  onToggleSave?: (studioId: string, saved: boolean) => void;
}) {
  const { user } = useAuth();
  const isSaved = savedIds?.includes(studio._id);

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error("Please log in to save studios to your wishlist.");
      return;
    }

    try {
      const { data } = await toggleWishlist(studio._id);
      toast.success(data.message);
      onToggleSave?.(studio._id, data.saved);
    } catch {
      toast.error("Could not update your saved studios.");
    }
  };

  return (
    <Card className="group flex h-full flex-col overflow-hidden hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10">
      {/* Image */}
      <div className="relative h-52 w-full overflow-hidden bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={studio.image}
          alt={studio.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        <Badge className="absolute left-3 top-3 bg-background/90 text-foreground backdrop-blur">
          {studio.category}
        </Badge>

        <button
          onClick={handleSave}
          aria-label={isSaved ? "Remove from saved" : "Save studio"}
          className={cn(
            "absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full backdrop-blur transition-all",
            isSaved
              ? "bg-primary text-primary-foreground"
              : "bg-background/90 text-foreground hover:bg-primary hover:text-primary-foreground"
          )}
        >
          <Heart className={cn("h-4 w-4", isSaved && "fill-current")} />
        </button>

        {/* Rating badge */}
        <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full bg-background/90 px-2.5 py-1 text-xs font-bold backdrop-blur">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          {studio.rating > 0 ? studio.rating.toFixed(1) : "New"}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-bold leading-tight line-clamp-1">
          {studio.title}
        </h3>

        <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          <span className="line-clamp-1">{studio.location}</span>
        </p>

        <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
          <Users className="h-3.5 w-3.5 shrink-0" />
          Up to {studio.maxCapacity} people
        </p>

        <div className="mt-4 flex items-end justify-between border-t border-border pt-4">
          <div>
            <p className="font-display text-xl font-extrabold text-primary">
              {formatRate(studio.hourlyRate)}
            </p>
            {studio.securityDeposit > 0 && (
              <p className="text-xs text-muted-foreground">
                ${studio.securityDeposit} deposit
              </p>
            )}
          </div>

          <Button asChild size="sm" variant="secondary">
            <Link href={`/studios/${studio._id}`}>View Details</Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}
