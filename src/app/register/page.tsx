"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Aperture, UserPlus, Mail, Lock, User, Image as ImageIcon, Check, X, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/providers/AuthProvider";
import { cn } from "@/lib/utils";

const rules = [
  { id: "length", label: "At least 6 characters", test: (v: string) => v.length >= 6 },
  { id: "upper", label: "One uppercase letter", test: (v: string) => /[A-Z]/.test(v) },
  { id: "lower", label: "One lowercase letter", test: (v: string) => /[a-z]/.test(v) },
];

export default function RegisterPage() {
  const router = useRouter();
  const { register, loginWithGoogle, user } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Already signed in? Skip the form entirely. Redirect is a side effect —
  // it belongs in an effect, never during render (setState-in-render pattern).
  useEffect(() => {
    if (user) router.replace("/");
  }, [user, router]);

  if (user) return null;

  const validatePassword = (value: string) => {
    if (!value) return "Password is required.";
    if (value.length < 6) return "Password must be at least 6 characters long.";
    if (!/[A-Z]/.test(value)) return "Password must contain at least one uppercase letter.";
    if (!/[a-z]/.test(value)) return "Password must contain at least one lowercase letter.";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) return toast.error("Please enter your full name.");
    if (!email.trim()) return toast.error("Please enter your email address.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      return toast.error("Please enter a valid email address.");

    const error = validatePassword(password);
    setPasswordError(error);
    if (error) {
      toast.error(error);
      return;
    }

    setSubmitting(true);
    const ok = await register({
      name: name.trim(),
      email: email.trim(),
      photoURL: photoURL.trim(),
      password,
    });
    setSubmitting(false);

    // Requirement: redirect to the Login page after a successful registration
    if (ok) router.push("/login");
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    // Redirects the browser to Google OAuth; returns to this page with ?google=1.
    await loginWithGoogle();
    setGoogleLoading(false);
  };

  return (
    <section className="flex min-h-[80vh] items-center justify-center px-4 py-16">
      <Card className="w-full max-w-md border-border shadow-xl">
        <CardContent className="p-8">
          <div className="mb-7 text-center">
            <span className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary">
              <Aperture className="h-7 w-7" />
            </span>
            <h1 className="font-display text-3xl font-extrabold tracking-tight">
              Create your account
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Join StudioSpace to book spaces or list your own.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ava Rahman"
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@studio.com"
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="photoURL">Photo URL</Label>
              <div className="relative">
                <ImageIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="photoURL"
                  value={photoURL}
                  onChange={(e) => setPhotoURL(e.target.value)}
                  placeholder="https://…/avatar.jpg"
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (passwordError) setPasswordError(validatePassword(e.target.value));
                  }}
                  onBlur={(e) => setPasswordError(validatePassword(e.target.value))}
                  placeholder="••••••••"
                  className="px-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {/* Live password checklist */}
              <ul className="mt-3 space-y-1.5">
                {rules.map((rule) => {
                  const passed = rule.test(password);
                  return (
                    <li
                      key={rule.id}
                      className={cn(
                        "flex items-center gap-2 text-xs font-medium transition-colors",
                        !password
                          ? "text-muted-foreground"
                          : passed
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-red-500"
                      )}
                    >
                      {passed ? (
                        <Check className="h-3.5 w-3.5" />
                      ) : (
                        <X className="h-3.5 w-3.5" />
                      )}
                      {rule.label}
                    </li>
                  );
                })}
              </ul>

              {passwordError && (
                <p className="mt-2 text-xs font-semibold text-destructive">
                  {passwordError}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={submitting}>
              {submitting ? "Creating account…" : <>Register <UserPlus /></>}
            </Button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <span className="h-px flex-1 bg-border" />
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              or
            </span>
            <span className="h-px flex-1 bg-border" />
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            size="lg"
            onClick={handleGoogle}
            disabled={googleLoading}
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.65l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.15-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
              />
              <path
                fill="#FBBC05"
                d="M5.85 14.11a6.6 6.6 0 0 1 0-4.22V7.05H2.18a11 11 0 0 0 0 9.9l3.67-2.84Z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.05l3.67 2.84c.86-2.6 3.29-4.51 6.15-4.51Z"
              />
            </svg>
            {googleLoading ? "Connecting…" : "Continue with Google"}
          </Button>

          <p className="mt-7 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-primary hover:underline">
              Login here
            </Link>
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
