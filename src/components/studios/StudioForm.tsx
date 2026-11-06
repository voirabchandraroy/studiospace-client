"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Save, Plus, Link2, ArrowLeft, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/providers/AuthProvider";
import { createStudio, updateStudio } from "@/lib/api";
import { AMENITY_OPTIONS, STUDIO_CATEGORIES, type Studio } from "@/lib/types";

interface FormState {
  title: string;
  category: string;
  hourlyRate: string;
  securityDeposit: string;
  maxCapacity: string;
  location: string;
  image: string;
  gallery: string[];
  amenities: string[];
  overview: string;
}

const emptyForm: FormState = {
  title: "",
  category: "",
  hourlyRate: "",
  securityDeposit: "",
  maxCapacity: "",
  location: "",
  image: "",
  gallery: [],
  amenities: [],
  overview: "",
};

export function StudioForm({
  mode = "create",
  initialData,
  studioId,
}: {
  mode?: "create" | "edit";
  initialData?: Studio;
  studioId?: string;
}) {
  const router = useRouter();
  const { user } = useAuth();

  const [form, setForm] = useState<FormState>(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  // Pre-fill the form when editing
  useEffect(() => {
    if (mode === "edit" && initialData) {
      setForm({
        title: initialData.title || "",
        category: initialData.category || "",
        hourlyRate: String(initialData.hourlyRate ?? ""),
        securityDeposit: String(initialData.securityDeposit ?? ""),
        maxCapacity: String(initialData.maxCapacity ?? ""),
        location: initialData.location || "",
        image: initialData.image || "",
        gallery: initialData.gallery || [],
        amenities: initialData.amenities || [],
        overview: initialData.overview || "",
      });
    }
  }, [mode, initialData]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const toggleAmenity = (amenity: string) =>
    setForm((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));

  const addGalleryImage = () => {
    set("gallery", [...form.gallery, ""]);
  };

  const validate = (): string | null => {
    if (!form.title.trim()) return "Studio title is required.";
    if (!form.category) return "Please pick a studio category.";
    if (!form.hourlyRate || Number(form.hourlyRate) <= 0)
      return "Hourly rate must be greater than zero.";
    if (!form.location.trim()) return "Location / address is required.";
    if (!form.image.trim()) return "A cover image is required (upload or paste a URL).";
    if (!form.maxCapacity || Number(form.maxCapacity) <= 0)
      return "Max capacity must be at least 1.";
    if (!form.overview.trim()) return "Please write a short overview for guests.";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const error = validate();
    if (error) {
      toast.error(error);
      return;
    }

    const payload = {
      title: form.title.trim(),
      category: form.category,
      hourlyRate: Number(form.hourlyRate),
      securityDeposit: Number(form.securityDeposit) || 0,
      maxCapacity: Number(form.maxCapacity),
      location: form.location.trim(),
      image: form.image.trim(),
      gallery: form.gallery.filter((g) => g.trim()),
      amenities: form.amenities,
      overview: form.overview.trim(),
    };

    setSubmitting(true);
    try {
      if (mode === "create") {
        const { data } = await createStudio(payload);
        toast.success(data.message || "Studio listed successfully!");
      } else {
        const { data } = await updateStudio(studioId!, payload);
        toast.success(data.message || "Studio updated successfully!");
      }
      router.push("/my-listings");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic info */}
      <Card>
        <CardHeader>
          <CardTitle>Studio basics</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="title">Studio title</Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="Northlight Cyc Wall Studio"
            />
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={form.category} onValueChange={(v) => set("category", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {STUDIO_CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location / address</Label>
            <Input
              id="location"
              value={form.location}
              onChange={(e) => set("location", e.target.value)}
              placeholder="Banani, Dhaka"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hourlyRate">Hourly rate ($)</Label>
            <Input
              id="hourlyRate"
              type="number"
              min={1}
              value={form.hourlyRate}
              onChange={(e) => set("hourlyRate", e.target.value)}
              placeholder="45"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="securityDeposit">Security deposit ($)</Label>
            <Input
              id="securityDeposit"
              type="number"
              min={0}
              value={form.securityDeposit}
              onChange={(e) => set("securityDeposit", e.target.value)}
              placeholder="100"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxCapacity">Max capacity (people)</Label>
            <Input
              id="maxCapacity"
              type="number"
              min={1}
              value={form.maxCapacity}
              onChange={(e) => set("maxCapacity", e.target.value)}
              placeholder="12"
            />
          </div>
        </CardContent>
      </Card>

      {/* Host info (read-only) */}
      <Card>
        <CardHeader>
          <CardTitle>Host information</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="ownerName">Host name</Label>
            <Input id="ownerName" value={user?.name || ""} readOnly className="bg-muted/60" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ownerEmail">Host email</Label>
            <Input id="ownerEmail" value={user?.email || ""} readOnly className="bg-muted/60" />
          </div>
          <p className="text-xs text-muted-foreground sm:col-span-2">
            These fields come from your account and cannot be edited here.
          </p>
        </CardContent>
      </Card>

      {/* Images */}
      <Card>
        <CardHeader>
          <CardTitle>Cover image</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="image">Image URL</Label>
            <div className="relative">
              <Link2 className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="image"
                value={form.image}
                onChange={(e) => set("image", e.target.value)}
                placeholder="https://…/studio.jpg"
                className="pl-10"
              />
            </div>
          </div>

          {form.image && (
            <div className="relative h-56 w-full overflow-hidden rounded-xl border border-border bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={form.image}
                alt="Cover preview"
                className="h-full w-full object-cover"
              />
            </div>
          )}

          {/* Gallery */}
          <div className="space-y-3 border-t border-border pt-5">
            <div className="flex items-center justify-between">
              <Label>Gallery images (optional)</Label>
              <Button type="button" size="sm" variant="outline" onClick={addGalleryImage}>
                <Plus /> Add image
              </Button>
            </div>

            {form.gallery.map((url, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={url}
                  onChange={(e) => {
                    const next = [...form.gallery];
                    next[index] = e.target.value;
                    set("gallery", next);
                  }}
                  placeholder="https://…/gallery-shot.jpg"
                />
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  aria-label="Remove gallery image"
                  onClick={() =>
                    set(
                      "gallery",
                      form.gallery.filter((_, i) => i !== index)
                    )
                  }
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Amenities */}
      <Card>
        <CardHeader>
          <CardTitle>Amenities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2.5">
            {AMENITY_OPTIONS.map((amenity) => (
              <Checkbox
                key={amenity}
                label={amenity}
                checked={form.amenities.includes(amenity)}
                onCheckedChange={() => toggleAmenity(amenity)}
              />
            ))}
          </div>
          {form.amenities.length > 0 && (
            <p className="mt-4 text-sm text-muted-foreground">
              {form.amenities.length} amenit{form.amenities.length === 1 ? "y" : "ies"} selected.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed overview</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={form.overview}
            onChange={(e) => set("overview", e.target.value)}
            placeholder="Describe the space: dimensions, ceiling height, natural light, parking, included gear, house rules…"
            className="min-h-[160px]"
          />
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <Button type="submit" size="lg" disabled={submitting}>
          {submitting ? (
            "Saving…"
          ) : (
            <>
              <Save /> {mode === "create" ? "Publish studio" : "Update studio"}
            </>
          )}
        </Button>

        <Button type="button" size="lg" variant="outline" asChild>
          <Link href="/my-listings">
            <ArrowLeft /> Cancel
          </Link>
        </Button>
      </div>
    </form>
  );
}
