"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Pencil, Trash2, Plus, Building2, Star } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { PrivateRoute } from "@/components/shared/PrivateRoute";
import { EmptyState } from "@/components/shared/EmptyState";
import { ConfirmModal } from "@/components/shared/ConfirmModal";
import { deleteStudio, getMyStudios } from "@/lib/api";
import { formatRate } from "@/lib/utils";
import type { Studio } from "@/lib/types";

function MyListingsContent() {
  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);
  const [target, setTarget] = useState<Studio | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchListings = () => {
    setLoading(true);
    getMyStudios()
      .then(({ data }) => setStudios(data))
      .catch(() => toast.error("Could not load your listings."))
      .finally(() => setLoading(false));
  };

  useEffect(fetchListings, []);

  const confirmDelete = async () => {
    if (!target) return;
    setDeleting(true);
    try {
      const { data } = await deleteStudio(target._id);
      toast.success(data.message || "Listing deleted successfully.");
      setStudios((prev) => prev.filter((s) => s._id !== target._id));
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to delete the listing.");
    } finally {
      setDeleting(false);
      setTarget(null);
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary">
            <Building2 className="h-3.5 w-3.5" /> Host
          </p>
          <h1 className="font-display text-4xl font-extrabold tracking-tight">
            My studio listings
          </h1>
          <p className="mt-2 text-muted-foreground">
            Update rates, swap photos, or take a space offline while you&apos;re on a shoot.
          </p>
        </div>

        <Button asChild size="lg">
          <Link href="/add-studio">
            <Plus /> Add New Studio
          </Link>
        </Button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full" />
          ))}
        </div>
      ) : studios.length === 0 ? (
        <EmptyState
          icon={<Building2 className="h-8 w-8" />}
          title="You haven't listed a studio yet"
          description="Turn idle hours into income. Publishing a listing takes about three minutes and is completely free."
          action={
            <Button asChild>
              <Link href="/add-studio">
                <Plus /> List your first studio
              </Link>
            </Button>
          }
        />
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden overflow-hidden rounded-2xl border border-border bg-card md:block">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-muted/40">
                <tr>
                  <th className="px-5 py-4 text-left font-bold">Studio</th>
                  <th className="px-5 py-4 text-left font-bold">Category</th>
                  <th className="px-5 py-4 text-left font-bold">Rate</th>
                  <th className="px-5 py-4 text-left font-bold">Rating</th>
                  <th className="px-5 py-4 text-right font-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {studios.map((studio) => (
                  <tr
                    key={studio._id}
                    className="border-b border-border last:border-0 hover:bg-muted/30"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={studio.image}
                          alt={studio.title}
                          className="h-14 w-20 shrink-0 rounded-lg object-cover"
                        />
                        <div className="min-w-0">
                          <p className="truncate font-semibold">{studio.title}</p>
                          <p className="truncate text-xs text-muted-foreground">
                            {studio.location}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <Badge variant="default">{studio.category}</Badge>
                    </td>
                    <td className="px-5 py-4 font-semibold text-primary">
                      {formatRate(studio.hourlyRate)}
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        {studio.rating > 0 ? studio.rating.toFixed(1) : "New"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <Button asChild size="sm" variant="outline">
                          <Link href={`/studios/edit/${studio._id}`}>
                            <Pencil /> Update
                          </Link>
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => setTarget(studio)}
                        >
                          <Trash2 /> Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="space-y-4 md:hidden">
            {studios.map((studio) => (
              <div
                key={studio._id}
                className="overflow-hidden rounded-2xl border border-border bg-card"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={studio.image}
                  alt={studio.title}
                  className="h-44 w-full object-cover"
                />
                <div className="p-4">
                  <Badge variant="default">{studio.category}</Badge>
                  <h3 className="mt-3 font-display text-lg font-bold">{studio.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{studio.location}</p>
                  <p className="mt-2 font-semibold text-primary">
                    {formatRate(studio.hourlyRate)}
                  </p>
                  <div className="mt-4 flex gap-2">
                    <Button asChild size="sm" variant="outline" className="flex-1">
                      <Link href={`/studios/edit/${studio._id}`}>
                        <Pencil /> Update
                      </Link>
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="flex-1"
                      onClick={() => setTarget(studio)}
                    >
                      <Trash2 /> Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <ConfirmModal
        open={Boolean(target)}
        onOpenChange={(open) => !open && setTarget(null)}
        onConfirm={confirmDelete}
        loading={deleting}
        title="Delete this studio listing?"
        description={
          target
            ? `"${target.title}" will be permanently removed from StudioSpace, along with its gallery and amenities. This cannot be undone.`
            : undefined
        }
      />
    </section>
  );
}

export default function MyListingsPage() {
  return (
    <PrivateRoute>
      <MyListingsContent />
    </PrivateRoute>
  );
}
