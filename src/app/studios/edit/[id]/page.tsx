import { PencilRuler } from "lucide-react";

import { EditStudioForm } from "@/components/studios/EditStudioForm";
import { PrivateRoute } from "@/components/shared/PrivateRoute";

export const metadata = { title: "Update Studio — StudioSpace" };

export default function EditStudioPage() {
  return (
    <PrivateRoute>
      <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-10">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary">
            <PencilRuler className="h-3.5 w-3.5" /> Edit
          </span>
          <h1 className="font-display text-4xl font-extrabold tracking-tight">
            Update your studio
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
            Keep rates, photos and amenities current — updated listings get noticeably more
            booking requests.
          </p>
        </div>

        <EditStudioForm />
      </section>
    </PrivateRoute>
  );
}
