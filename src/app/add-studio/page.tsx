import { PlusCircle } from "lucide-react";

import { StudioForm } from "@/components/studios/StudioForm";
import { PrivateRoute } from "@/components/shared/PrivateRoute";

export const metadata = { title: "Add New Studio — StudioSpace" };

export default function AddStudioPage() {
  return (
    <PrivateRoute>
      <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-10">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary">
            <PlusCircle className="h-3.5 w-3.5" /> Host
          </span>
          <h1 className="font-display text-4xl font-extrabold tracking-tight">
            Add a new studio
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
            List a spare room, a full sound stage, or anything in between. You control the
            rate, the amenities and who gets to book.
          </p>
        </div>

        <StudioForm mode="create" />
      </section>
    </PrivateRoute>
  );
}
