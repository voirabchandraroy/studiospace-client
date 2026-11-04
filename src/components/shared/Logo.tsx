import Link from "next/link";
import { Aperture } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  showText = true,
}: {
  className?: string;
  showText?: boolean;
}) {
  return (
    <Link href="/" className={cn("group inline-flex items-center gap-2.5", className)}>
      <span className="relative grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/30 transition-transform group-hover:scale-105">
        <Aperture className="h-5 w-5 transition-transform duration-500 group-hover:rotate-90" />
      </span>
      {showText && (
        <span className="font-display text-xl font-extrabold tracking-tight">
          Studio<span className="text-primary">Space</span>
        </span>
      )}
    </Link>
  );
}
