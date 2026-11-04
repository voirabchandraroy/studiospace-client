"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import {
  MapPin,
  Users,
  Star,
  Check,
  CalendarCheck,
  Heart,
  SearchX,
  Loader2,
  ShieldCheck,
  Wallet,
  Mail,
} from "lucide-react";
import { toast } from "sonner";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/shared/Loading";
import { EmptyState } from "@/components/shared/EmptyState";
import { BookingModal } from "./BookingModal";
import { useAuth } from "@/providers/AuthProvider";
import { getStudioById, toggleWishlist } from "@/lib/api";
import { formatRate } from "@/lib/utils";
import type { Booking, Studio } from "@/lib/types";

interface StudioWithReviews extends Studio {
  reviews?: Booking[];
}

export function StudioDetails({ id }: { id: string }) {
  const { user } = useAuth();

  const [studio, setStudio] = useState<StudioWithReviews | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getStudioById(id)
      .then(({ data }) => setStudio(data))
      .catch((err) =>
        setError(err?.response?.data?.message || "We couldn't load this studio.")
      )
      .finally(() => setLoading(false));
  }, [id]);

  const handleBook = () => {
    if (!user) {
      toast.error("Please log in to book this workspace.");
      return;
    }
    if (studio?.ownerEmail === user.email) {
      toast.error("This is your own listing — you can't book it.");
      return;
    }
    setBookingOpen(true);
  };

  const handleSave = async () => {
    if (!user) {
      toast.error("Log in to save studios to your wishlist.");
      return;
    }
    try {
      const { data } = await toggleWishlist(id);
      setSaved(data.saved);
      toast.success(data.message);
    } catch {
      toast.error("Could not update your saved studios.");
    }
  };

  if (loading) return <Spinner />;

  if (error || !studio) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-20">
        <EmptyState
          icon={<SearchX className="h-8 w-8" />}
          title="Studio not found"
          description={error || "This listing may have been removed by its host."}
          action={
            <Button asChild>
              <Link href="/studios">Browse other studios</Link>
            </Button>
          }
        />
      </section>
    );
  }

  const gallery = studio.gallery?.length ? studio.gallery : [studio.image];

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-primary">
          Home
        </Link>
        <span>/</span>
        <Link href="/studios" className="hover:text-primary">
          Studios
        </Link>
        <span>/</span>
        <span className="truncate text-foreground">{studio.title}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-3">
        {/* ---------------- Left: gallery + info ---------------- */}
        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-2xl border border-border">
            <Swiper
              modules={[Pagination, Navigation]}
              pagination={{ clickable: true }}
              navigation
              loop={gallery.length > 1}
              className="h-[320px] w-full sm:h-[440px]"
            >
              {gallery.map((src, i) => (
                <SwiperSlide key={i} className="relative">
                  <div
                    className="h-full w-full bg-cover bg-center"
                    style={{
                      backgroundImage: `linear-gradient(135deg, oklch(0.25 0.04 270), oklch(0.45 0.08 55)), url(${src})`,
                    }}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Title block */}
          <div className="mt-8">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="default">{studio.category}</Badge>
              <span className="inline-flex items-center gap-1 text-sm font-semibold">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                {studio.rating > 0 ? studio.rating.toFixed(1) : "New"}
                {studio.reviewCount > 0 && (
                  <span className="font-normal text-muted-foreground">
                    ({studio.reviewCount} reviews)
                  </span>
                )}
              </span>
            </div>

            <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
              {studio.title}
            </h1>

            <p className="mt-3 flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" /> {studio.location}
            </p>
          </div>

          {/* Specs */}
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: "Hourly rate", value: formatRate(studio.hourlyRate), icon: Wallet },
              { label: "Max capacity", value: `${studio.maxCapacity} people`, icon: Users },
              {
                label: "Deposit",
                value: studio.securityDeposit > 0 ? `$${studio.securityDeposit}` : "None",
                icon: ShieldCheck,
              },
              { label: "Category", value: studio.category, icon: Star },
            ].map(({ label, value, icon: Icon }) => (
              <div
                key={label}
                className="rounded-xl border border-border bg-card p-4 text-center"
              >
                <Icon className="mx-auto mb-2 h-5 w-5 text-primary" />
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {label}
                </p>
                <p className="mt-1 font-display text-base font-bold">{value}</p>
              </div>
            ))}
          </div>

          {/* Overview */}
          <div className="mt-10">
            <h2 className="font-display text-2xl font-bold">About this space</h2>
            <p className="mt-4 whitespace-pre-line leading-relaxed text-muted-foreground">
              {studio.overview}
            </p>
          </div>

          {/* Amenities */}
          <div className="mt-10">
            <h2 className="font-display text-2xl font-bold">What&apos;s included</h2>
            {studio.amenities?.length ? (
              <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {studio.amenities.map((amenity) => (
                  <li key={amenity} className="flex items-center gap-2.5 text-sm">
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    {amenity}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">
                The host hasn&apos;t listed any amenities yet.
              </p>
            )}
          </div>

          {/* Reviews */}
          <div className="mt-10">
            <h2 className="font-display text-2xl font-bold">Recent productions</h2>
            {studio.reviews?.length ? (
              <ul className="mt-4 space-y-4">
                {studio.reviews.map((r) => (
                  <li key={r._id} className="rounded-xl border border-border bg-card p-4">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold">{r.userName}</p>
                      <span className="text-xs text-muted-foreground">
                        {new Date(r.createdAt || "").toLocaleDateString("en-GB")}
                      </span>
                    </div>
                    <p className="mt-1.5 text-sm text-muted-foreground">
                      Booked {r.hours}h — {r.hours > 4 ? "full day shoot" : "short session"}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 rounded-xl border border-dashed border-border bg-card/40 p-6 text-center text-sm text-muted-foreground">
                No completed shoots here yet — be the first to book and leave a review.
              </p>
            )}
          </div>
        </div>

        {/* ---------------- Right: booking card ---------------- */}
        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-lg">
            <p className="font-display text-3xl font-extrabold text-primary">
              {formatRate(studio.hourlyRate)}
            </p>
            {studio.securityDeposit > 0 && (
              <p className="mt-1 text-sm text-muted-foreground">
                ${studio.securityDeposit} refundable deposit
              </p>
            )}

            <div className="mt-6 space-y-3 border-t border-border pt-5 text-sm">
              <p className="flex items-center justify-between">
                <span className="text-muted-foreground">Category</span>
                <span className="font-semibold">{studio.category}</span>
              </p>
              <p className="flex items-center justify-between">
                <span className="text-muted-foreground">Capacity</span>
                <span className="font-semibold">{studio.maxCapacity} people</span>
              </p>
              <p className="flex items-center justify-between">
                <span className="text-muted-foreground">Location</span>
                <span className="font-semibold">{studio.location}</span>
              </p>
            </div>

            <Button className="mt-6 w-full" size="lg" onClick={handleBook}>
              <CalendarCheck /> Book Workspace Now
            </Button>

            <Button
              variant="outline"
              className="mt-3 w-full"
              size="lg"
              onClick={handleSave}
            >
              <Heart className={saved ? "fill-current text-primary" : ""} />
              {saved ? "Saved to wishlist" : "Save for later"}
            </Button>

            {/* Host card */}
            <div className="mt-6 rounded-xl border border-border bg-background p-4">
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Hosted by
              </p>
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-primary/15 font-bold text-primary">
                  {studio.ownerName?.charAt(0).toUpperCase()}
                </span>
                <div className="min-w-0">
                  <p className="truncate font-semibold">{studio.ownerName}</p>
                  <p className="flex items-center gap-1.5 truncate text-xs text-muted-foreground">
                    <Mail className="h-3 w-3" /> {studio.ownerEmail}
                  </p>
                </div>
              </div>
            </div>

            <p className="mt-5 text-center text-xs text-muted-foreground">
              You won&apos;t be charged until the host confirms your request.
            </p>
          </div>
        </aside>
      </div>

      <BookingModal studio={studio} open={bookingOpen} onOpenChange={setBookingOpen} />
    </section>
  );
}
