"use client";

import { useEffect, useState } from "react";
import { CalendarDays, Clock, Wallet, AlertTriangle, Loader2, FileText } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/providers/AuthProvider";
import { createBooking, getStudioBookings } from "@/lib/api";
import { formatTime } from "@/lib/utils";
import type { Booking, Studio } from "@/lib/types";

const TIME_SLOTS = Array.from({ length: 18 }, (_, i) => {
  const hour = i + 6; // 06:00 → 23:00
  return `${String(hour).padStart(2, "0")}:00`;
});

const today = () => new Date().toISOString().split("T")[0];

export function BookingModal({
  studio,
  open,
  onOpenChange,
}: {
  studio: Studio;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { user } = useAuth();

  const [date, setDate] = useState(today());
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("13:00");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [taken, setTaken] = useState<Booking[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Load already-booked slots for the selected date (live availability)
  useEffect(() => {
    if (!open) return;
    setLoadingSlots(true);
    getStudioBookings(studio._id)
      .then(({ data }) => setTaken(data.filter((b) => b.date === date)))
      .catch(() => setTaken([]))
      .finally(() => setLoadingSlots(false));
  }, [open, studio._id, date]);

  const hours =
    (Number(endTime.split(":")[0]) - Number(startTime.split(":")[0])) || 0;
  const totalCost = hours > 0 ? hours * studio.hourlyRate : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please log in to reserve this studio.");
      return;
    }
    if (!date) {
      toast.error("Pick the shoot date.");
      return;
    }
    if (hours <= 0) {
      toast.error("End time must be later than the start time.");
      return;
    }

    setSubmitting(true);
    try {
      const { data } = await createBooking({
        studioId: studio._id,
        date,
        startTime,
        endTime,
        note,
      });
      toast.success(data.message || "Booking request sent!");
      onOpenChange(false);
      setNote("");
    } catch (error: any) {
      // Challenge 2: double-booking rejection message comes straight from the API
      toast.error(
        error?.response?.data?.message || "Could not create the booking. Try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Book {studio.title}</DialogTitle>
          <DialogDescription>
            Pick your shoot date and hours. You&apos;ll get a PDF invoice once the host
            confirms.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date" className="flex items-center gap-2">
              <CalendarDays className="h-3.5 w-3.5" /> Shoot date
            </Label>
            <Input
              id="date"
              type="date"
              value={date}
              min={today()}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          {/* Time range */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Clock className="h-3.5 w-3.5" /> Start
              </Label>
              <Select value={startTime} onValueChange={setStartTime}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIME_SLOTS.map((t) => (
                    <SelectItem key={t} value={t}>
                      {formatTime(t)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>End</Label>
              <Select value={endTime} onValueChange={setEndTime}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIME_SLOTS.map((t) => (
                    <SelectItem key={t} value={t}>
                      {formatTime(t)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Availability */}
          <div className="rounded-xl border border-border bg-card/60 p-3.5">
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Already booked on this date
            </p>
            {loadingSlots ? (
              <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Checking availability…
              </span>
            ) : taken.length === 0 ? (
              <p className="text-sm text-emerald-600 dark:text-emerald-400">
                Fully open — no confirmed bookings yet.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {taken.map((b) => (
                  <span
                    key={b._id}
                    className="rounded-lg bg-destructive/10 px-2.5 py-1 text-xs font-semibold text-destructive"
                  >
                    {formatTime(b.startTime)} – {formatTime(b.endTime)}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Cost summary */}
          <div className="flex items-center justify-between rounded-xl bg-primary/10 px-4 py-3.5">
            <span className="inline-flex items-center gap-2 text-sm font-semibold">
              <Wallet className="h-4 w-4 text-primary" />
              {hours > 0 ? `${hours} h × $${studio.hourlyRate}` : "Select a valid time range"}
            </span>
            <span className="font-display text-xl font-extrabold text-primary">
              ${totalCost.toLocaleString()}
            </span>
          </div>

          {hours <= 0 && (
            <p className="inline-flex items-center gap-2 text-xs font-semibold text-destructive">
              <AlertTriangle className="h-3.5 w-3.5" /> End time must be after the start time.
            </p>
          )}

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="note">Notes for the host (optional)</Label>
            <Textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Crew of 6, need blackout curtains and a loading dock…"
              className="min-h-[90px]"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting || hours <= 0}>
              {submitting ? "Sending request…" : <>Confirm booking <FileText /></>}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
