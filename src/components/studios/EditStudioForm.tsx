"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { SearchX, Loader2 } from "lucide-react";

import { StudioForm } from "./StudioForm";
import { Spinner } from "@/components/shared/Loading";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { getStudioById } from "@/lib/api";
import type { Studio } from "@/lib/types";

export function EditStudioForm() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [studio, setStudio] = useState<Studio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!params?.id) return;

    getStudioById(params.id)
      .then(({ data }) => setStudio(data))
      .catch((err) =>
        setError(err?.response?.data?.message || "Could not load this studio listing.")
      )
      .finally(() => setLoading(false));
  }, [params?.id]);

  if (loading) return <Spinner />;

  if (error || !studio) {
    return (
      <EmptyState
        icon={<SearchX className="h-8 w-8" />}
        title="We couldn't load this listing"
        description={error || "The studio may have been deleted."}
        action={
          <Button onClick={() => router.push("/my-listings")}>Back to my listings</Button>
        }
      />
    );
  }

  return <StudioForm mode="edit" initialData={studio} studioId={studio._id} />;
}
