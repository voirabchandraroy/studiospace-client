"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Avoid a hydration mismatch on the server render
  if (!mounted) {
    return <div className="h-10 w-10 rounded-xl border border-border" aria-hidden />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      variant="outline"
      size="icon"
      aria-label="Toggle theme"
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative overflow-hidden"
    >
      <Sun
        className={
          "h-[1.2rem] w-[1.2rem] transition-all " +
          (isDark ? "rotate-90 scale-0" : "rotate-0 scale-100")
        }
      />
      <Moon
        className={
          "absolute h-[1.2rem] w-[1.2rem] transition-all " +
          (isDark ? "rotate-0 scale-100" : "-rotate-90 scale-0")
        }
      />
    </Button>
  );
}
