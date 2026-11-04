"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Building2,
  CalendarCheck,
  Clock,
  CheckCircle2,
  Plus,
  List,
  Inbox,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { PrivateRoute } from "@/components/shared/PrivateRoute";
import { EmptyState } from "@/components/shared/EmptyState";
import { useAuth } from "@/providers/AuthProvider";
import { getHostBookings, getMyBookings, getMyStudios, updateBookingStatus } from "@/lib/api";
import { formatDate, formatTime } from "@/lib/utils";
import type { Booking, Studio } from "@/lib/types";

function DashboardContent() {
  const { user } = useAuth();

  const [studios, setStudios] = useState<Studio[]>([]);
  const [hostBookings, setHostBookings] = useState<Booking[]>([]);
  const [myBookings, setMyBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getMyStudios(), getHostBookings(), getMyBookings()])
      .then(([s, h, m]) => {
        setStudios(s.data);
        setHostBookings(h.data);
        setMyBookings(m.data);
      })
      .catch(() => toast.error("Could not load your dashboard data."))
      .finally(() => setLoading(false));
  }, []);

  const changeStatus = async (booking: Booking, status: string) => {
    setUpdatingId(booking._id);
    try {
      const { data } = await updateBookingStatus(booking._id, status);
      toast.success(data.message || `Booking marked ${status}.`);
      setHostBookings((prev) =>
        prev.map((b) => (b._id === booking._id ? { ...b, status: status as Booking["status"] } : b))
      );
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Could not update this booking.");
    } finally {
      setUpdatingId(null);
    }
  };

  const pendingIn = hostBookings.filter((b) => b.status === "Pending");
  const confirmed = hostBookings.filter((b) => b.status === "Confirmed");
  const revenue = hostBookings
    .filter((b) => b.status !== "Cancelled")
    .reduce((sum, b) => sum + b.totalCost, 0);

  const stats = [
    {
      label: "My listings",
      value: studios.length,
      icon: Building2,
      hint: "Active studio spaces",
    },
    {
      label: "Pending requests",
      value: pendingIn.length,
      icon: Clock,
      hint: "Awaiting your approval",
    },
    {
      label: "Confirmed shoots",
      value: confirmed.length,
      icon: CalendarCheck,
      hint: "Locked-in bookings",
    },
    {
      label: "Pipeline value",
      value: `$${revenue.toLocaleString()}`,
      icon: Wallet,
      hint: "Excluding cancelled",
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Greeting */}
      <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary">
            Dashboard
          </p>
          <h1 className="font-display text-4xl font-extrabold tracking-tight">
            Hello, {user?.name?.split(" ")[0]}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {user?.email} &bull; Everything happening across your studios and bookings.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <Link href="/my-listings">
              <List /> My listings
            </Link>
          </Button>
          <Button asChild>
            <Link href="/add-studio">
              <Plus /> Add studio
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map(({ label, value, icon: Icon, hint }) => (
            <div
              key={label}
              className="rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-primary/50"
            >
              <span className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </span>
              <p className="font-display text-3xl font-extrabold">{value}</p>
              <p className="mt-1 text-sm font-semibold">{label}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>
            </div>
          ))}
        </div>
      )}

      {/* Booking requests inbox */}
      <div className="mt-14">
        <h2 className="mb-6 font-display text-2xl font-bold">Booking requests for my studios</h2>

        {loading ? (
          <Skeleton className="h-40 w-full" />
        ) : hostBookings.length === 0 ? (
          <EmptyState
            icon={<Inbox className="h-8 w-8" />}
            title="No booking requests yet"
            description="When a creator reserves one of your spaces, the request lands here for you to confirm or decline."
            action={
              <Button asChild>
                <Link href="/add-studio">
                  <Plus /> List a studio
                </Link>
              </Button>
            }
          />
        ) : (
          <div className="space-y-4">
            {hostBookings.slice(0, 8).map((booking) => (
              <div
                key={booking._id}
                className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 sm:flex-row sm:items-center"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={booking.studioImage}
                  alt={booking.studioTitle}
                  className="h-24 w-full shrink-0 rounded-xl object-cover sm:w-36"
                />

                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="font-display text-base font-bold">
                      {booking.studioTitle}
                    </p>
                    <Badge
                      variant={
                        booking.status === "Confirmed"
                          ? "success"
                          : booking.status === "Pending"
                          ? "warning"
                          : booking.status === "Completed"
                          ? "info"
                          : "danger"
                      }
                    >
                      {booking.status}
                    </Badge>
                  </div>

                  <p className="mt-1.5 text-sm text-muted-foreground">
                    {booking.userName} &bull; {formatDate(booking.date)} &bull;{" "}
                    {formatTime(booking.startTime)} – {formatTime(booking.endTime)} &bull;{" "}
                    <span className="font-semibold text-primary">
                      ${booking.totalCost.toLocaleString()}
                    </span>
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {booking.status === "Pending" && (
                    <>
                      <Button
                        size="sm"
                        disabled={updatingId === booking._id}
                        onClick={() => changeStatus(booking, "Confirmed")}
                      >
                        <CheckCircle2 /> Confirm
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={updatingId === booking._id}
                        onClick={() => changeStatus(booking, "Cancelled")}
                      >
                        Decline
                      </Button>
                    </>
                  )}
                  {booking.status === "Confirmed" && (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={updatingId === booking._id}
                      onClick={() => changeStatus(booking, "Completed")}
                    >
                      Mark completed
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* My upcoming bookings as a guest */}
      <div className="mt-14">
        <h2 className="mb-6 font-display text-2xl font-bold">My reservations as a guest</h2>

        {loading ? (
          <Skeleton className="h-32 w-full" />
        ) : myBookings.length === 0 ? (
          <EmptyState
            icon={<CalendarCheck className="h-8 w-8" />}
            title="You haven't booked a studio yet"
            description="Find a space, pick your hours and send a request — it takes under a minute."
            action={
              <Button asChild>
                <Link href="/studios">Explore studios</Link>
              </Button>
            }
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {myBookings.slice(0, 3).map((booking) => (
              <Link
                key={booking._id}
                href="/my-bookings"
                className="rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/50"
              >
                <Badge
                  variant={
                    booking.status === "Confirmed"
                      ? "success"
                      : booking.status === "Pending"
                      ? "warning"
                      : booking.status === "Completed"
                      ? "info"
                      : "danger"
                  }
                >
                  {booking.status}
                </Badge>
                <p className="mt-3 font-display text-base font-bold line-clamp-1">
                  {booking.studioTitle}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {formatDate(booking.date)} &bull; {formatTime(booking.startTime)}
                </p>
                <p className="mt-2 font-semibold text-primary">
                  ${booking.totalCost.toLocaleString()}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default function DashboardPage() {
  return (
    <PrivateRoute>
      <DashboardContent />
    </PrivateRoute>
  );
}
