"use client";

import type { ReactNode } from "react";
import { Toaster } from "sonner";
import { useTheme } from "next-themes";

import { ThemeProvider } from "./ThemeProvider";
import { AuthProvider } from "./AuthProvider";

const SonnerToaster = () => {
  const { resolvedTheme } = useTheme();

  return (
    <Toaster
      richColors
      position="top-right"
      closeButton
      theme={(resolvedTheme as "light" | "dark" | "system") || "dark"}
      toastOptions={{
        style: { fontFamily: "var(--font-sans)" },
        classNames: {
          toast: "rounded-xl border",
        },
      }}
    />
  );
};

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        {children}
        <SonnerToaster />
      </AuthProvider>
    </ThemeProvider>
  );
}
