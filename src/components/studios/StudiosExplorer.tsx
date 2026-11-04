"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SearchX, Search, SlidersHorizontal, X } from "lucide-react";

import { StudioCard, StudioCardSkeleton } from "@/components/shared/StudioCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getStudios, getWishlist } from "@/lib/api";
import { STUDIO_CATEGORIES, type Studio } from "@/lib/types";
import { useAuth } from "@/providers/AuthProvider";
import { cn } from "@/lib/utils";

const sortOptions = [
  { value: "newest", label: "Newest first" },
  { value: "rating", label: "Top rated" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
];

export function StudiosExplorer() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const categoryParam = searchParams.get("category") || "All";

  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [category, setCategory] = useState(categoryParam);
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);

  const [studios, setStudios] = useState<Studio[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // Keep state in sync when coming from a category card on the home page
  useEffect(() => {
    setCategory(categoryParam);
    setPage(1);
  }, [categoryParam]);

  useEffect(() => {
    setLoading(true);
    getStudios({ search, category, sort, page: String(page), limit: "9" })
      .then(({ data }) => {
        setStudios(data.studios);
        setTotalPages(data.totalPages || 1);
        setTotal(data.total);
      })
      .catch(() => setStudios([]))
      .finally(() => setLoading(false));
  }, [search, category, sort, page]);

  useEffect(() => {
    if (!user) return setSavedIds([]);
    getWishlist()
      .then(({ data }) => setSavedIds(data))
      .catch(() => setSavedIds([]));
  }, [user]);

  const handleToggleSave = (studioId: string, saved: boolean) =>
    setSavedIds((prev) =>
      saved ? [...prev, studioId] : prev.filter((id) => id !== studioId)
    );

  const resetFilters = () => {
    setSearch("");
    setCategory("All");
    setSort("newest");
    setPage(1);
  };

  const hasFilters = search || category !== "All" || sort !== "newest";

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Filter bar */}
      <div className="mb-8 rounded-2xl border border-border bg-card p-4 sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by studio name, city or keyword…"
              className="pl-10"
              aria-label="Search studios"
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Select
              value={category}
              onValueChange={(v) => {
                setCategory(v);
                setPage(1);
              }}
            >
              <SelectTrigger className="sm:w-52">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All categories</SelectItem>
                {STUDIO_CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={sort}
              onValueChange={(v) => {
                setSort(v);
                setPage(1);
              }}
            >
              <SelectTrigger className="sm:w-52">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Category chips */}
        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-4">
          <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
          {["All", ...STUDIO_CATEGORIES].map((c) => (
            <button
              key={c}
              onClick={() => {
                setCategory(c);
                setPage(1);
              }}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors",
                category === c
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/70"
              )}
            >
              {c}
            </button>
          ))}

          {hasFilters && (
            <button
              onClick={resetFilters}
              className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-destructive"
            >
              <X className="h-3.5 w-3.5" /> Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Result count */}
      {!loading && (
        <p className="mb-6 text-sm text-muted-foreground">
          Showing <span className="font-semibold text-foreground">{studios.length}</span> of{" "}
          <span className="font-semibold text-foreground">{total}</span> studio
          {total === 1 ? "" : "s"}
          {category !== "All" && (
            <>
              {" "}
              in <Badge variant="default">{category}</Badge>
            </>
          )}
        </p>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <StudioCardSkeleton key={i} />
          ))}
        </div>
      ) : studios.length === 0 ? (
        <EmptyState
          icon={<SearchX className="h-8 w-8" />}
          title="No studios match your search"
          description="Try a different keyword, switch categories, or clear the filters to see every space on StudioSpace."
          action={
            <div className="flex flex-wrap justify-center gap-3">
              <Button onClick={resetFilters}>Clear filters</Button>
              <Button variant="outline" onClick={() => router.push("/add-studio")}>
                List your own studio
              </Button>
            </div>
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

      {/* Pagination */}
      {totalPages > 1 && !loading && (
        <div className="mt-12 flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </Button>

          {Array.from({ length: totalPages }).map((_, i) => (
            <Button
              key={i}
              size="sm"
              variant={page === i + 1 ? "default" : "outline"}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </Button>
          ))}

          <Button
            variant="outline"
            size="sm"
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Next
          </Button>
        </div>
      )}
    </section>
  );
}
