"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ShieldAlert } from "lucide-react";

import { useAuth } from "@/providers/AuthProvider";
import { Spinner } from "./Loading";
import { Button } from "@/components/ui/button";

/**
 * Wraps every private page.
 * Waits for the /api/auth/me round-trip before deciding, so a logged-in user
 * is NEVER redirected to /login when reloading a protected route.
 */
export function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [loading, user, router, pathname]);

  if (loading) return <Spinner />;

  if (!user) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center gap-5 text-center">
        <div className="grid h-16 w-16 place-items-center rounded-2xl bg-primary/10 text-primary">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <h2 className="font-display text-2xl font-bold">This area is members only</h2>
        <p className="text-sm text-muted-foreground">
          Log in to manage your studios, listings and bookings.
        </p>
        <Button asChild>
          <a href={`/login?redirect=${encodeURIComponent(pathname)}`}>Go to Login</a>
        </Button>
      </div>
    );
  }

  return <>{children}</>;
}
