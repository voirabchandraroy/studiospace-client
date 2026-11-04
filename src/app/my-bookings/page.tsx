"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarX2, FileDown, Loader2, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { PrivateRoute } from "@/components/shared/PrivateRoute";
import { EmptyState } from "@/components/shared/EmptyState";
import { ConfirmModal } from "@/components/shared/ConfirmModal";
import { cancelBooking, getMyBookings } from "@/lib/api";
import { generateBookingInvoice } from "@/lib/invoice";
import { formatDate, formatTime } from "@/lib/utils";
import type { Booking, BookingStatus } from "@/lib/types";

const statusVariant: Record<BookingStatus, "warning" | "success" | "info" | "danger"> = {
  Pending: "warning",
  Confirmed: "success",
  Completed: "info",
  Cancelled: "danger",
};

function MyBookingsContent() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"All" | BookingStatus>("All");
  const [target, setTarget] = useState<Booking | null>(null);
  const [cancelling, setCancelling] = useState(false);

  const fetchBookings = () => {
    setLoading(true);
    getMyBookings()
      .then(({ data }) => setBookings(data))
      .catch(() => toast.error("Could not load your bookings."))
      .finally(() => setLoading(false));
  };

  useEffect(fetchBookings, []);

  const confirmCancel = async () => {
    if (!target) return;
    setCancelling(true);
    try {
      const { data } = await cancelBooking(target._id);
      toast.success(data.message || "Booking cancelled.");
      setBookings((prev) => prev.filter((b) => b._id !== target._id));
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Could not cancel this booking.");
    } finally {
      setCancelling(false);
      setTarget(null);
    }
  };

  const visible =
    filter === "All" ? bookings : bookings.filter((b) => b.status === filter);

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary">
          <CalendarX2 className="h-3.5 w-3.5" /> Guest
        </p>
        <h1 className="font-display text-4xl font-extrabold tracking-tight">
          My bookings
        </h1>
        <p className="mt-2 text-muted-foreground">
          Track every reservation request, download invoices, and cancel pending slots.
        </p>
      </div>

      {/* Filter chips */}
      {!loading && bookings.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {["All", "Pending", "Confirmed", "Completed", "Cancelled"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s as "All" | BookingStatus)}
              className={
                "rounded-full px-4 py-1.5 text-xs font-semibold transition-colors " +
                (filter === s
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/70")
              }
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <EmptyState
          icon={<CalendarX2 className="h-8 w-8" />}
          title="No bookings yet"
          description="When you reserve a studio it will appear here with its live status and a downloadable invoice."
          action={
            <Button asChild>
              <Link href="/studios">
                <Search /> Explore studios
              </Link>
            </Button>
          }
        />
      ) : visible.length === 0 ? (
        <EmptyState
          title={`No ${filter.toLowerCase()} bookings`}
          description="Switch the filter above to see your other reservations."
        />
      ) : (
        <div className="space-y-4">
          {visible.map((booking) => (
            <div
              key={booking._id}
              className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-5 sm:flex-row"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={booking.studioImage}
                alt={booking.studioTitle}
                className="h-40 w-full shrink-0 rounded-xl object-cover sm:h-28 sm:w-44"
              />

              <div className="flex-1">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <Link
                      href={`/studios/${booking.studioId}`}
                      className="font-display text-lg font-bold hover:text-primary"
                    >
                      {booking.studioTitle}
                    </Link>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {booking.location}
                    </p>
                  </div>
                  <Badge variant={statusVariant[booking.status]}>{booking.status}</Badge>
                </div>

                <div className="mt-4 grid gap-2 text-sm sm:grid-cols-3">
                  <p>
                    <span className="text-muted-foreground">Date: </span>
                    <span className="font-semibold">{formatDate(booking.date)}</span>
                  </p>
                  <p>
                    <span className="text-muted-foreground">Time: </span>
                    <span className="font-semibold">
                      {formatTime(booking.startTime)} – {formatTime(booking.endTime)}
                    </span>
                  </p>
                  <p>
                    <span className="text-muted-foreground">Total: </span>
                    <span className="font-semibold text-primary">
                      ${booking.totalCost.toLocaleString()}
                    </span>{" "}
                    <span className="text-muted-foreground">
                      ({booking.hours}h × ${booking.hourlyRate})
                    </span>
                  </p>
                </div>

                {booking.note && (
                  <p className="mt-3 rounded-lg bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
                    Note: {booking.note}
                  </p>
                )}

                <div className="mt-4 flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      try {
                        generateBookingInvoice(booking);
                        toast.success("Invoice downloaded.");
                      } catch {
                        toast.error("Could not generate the invoice.");
                      }
                    }}
                  >
                    <FileDown /> Download invoice
                  </Button>

                  {booking.status === "Pending" && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => setTarget(booking)}
                    >
                      <Trash2 /> Cancel booking
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        open={Boolean(target)}
        onOpenChange={(open) => !open && setTarget(null)}
        onConfirm={confirmCancel}
        loading={cancelling}
        title="Cancel this booking?"
        description={
          target
            ? `Your ${target.hours}-hour reservation at ${target.studioTitle} on ${formatDate(
                target.date
              )} will be removed. You can book the slot again if it's still free.`
            : undefined
        }
        confirmLabel="Yes, cancel it"
        cancelLabel="Keep booking"
      />
    </section>
  );
}

export default function MyBookingsPage() {
  return (
    <PrivateRoute>
      <MyBookingsContent />
    </PrivateRoute>
  );
}
