"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import * as api from "@/lib/api";
import type { User } from "@/lib/types";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  register: (payload: {
    name: string;
    email: string;
    photoURL?: string;
    password: string;
  }) => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  /**
   * Runs on every full page reload. Because the JWT is stored in an HTTPOnly
   * cookie, this call silently restores the session — so a logged-in user is
   * never bounced to /login when refreshing a private route.
   */
  const refreshUser = useCallback(async () => {
    try {
      const { data } = await api.getMe();
      setUser(data);
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    refreshUser().finally(() => setLoading(false));
  }, [refreshUser]);

  /**
   * Google sign-in (better-auth). Clicking the button redirects the browser
   * to Google; better-auth validates the OAuth round trip and returns the
   * browser to this same page with `?google=1`.
   */
  const loginWithGoogle: AuthContextType["loginWithGoogle"] = async () => {
    try {
      const callbackUrl = new URL(window.location.href);
      callbackUrl.searchParams.set("google", "1");
      await authClient.signIn.social({
        provider: "google",
        callbackURL: callbackUrl.toString(),
      });
      return true;
    } catch {
      toast.error("Google sign-in could not start. Try again.");
      return false;
    }
  };

  /**
   * On every reload, if the URL carries our `?google=1` flag, better-auth
   * has already finished (or failed) the OAuth round trip. Sync the Google
   * identity into Express (upsert user + set HTTPOnly JWT cookie), then
   * strip the flag from the URL.
   */
  useEffect(() => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    if (url.searchParams.get("google") !== "1") return;

    (async () => {
      try {
        const { data: session } = await authClient.getSession();
        const sessionUser = session?.user as
          | { name?: string | null; email?: string | null; image?: string | null }
          | null
          | undefined;

        if (!sessionUser?.email) {
          toast.error("Google sign-in did not finish. Please try again.");
        } else {
          const { data } = await api.googleLogin({
            name: sessionUser.name ?? sessionUser.email,
            email: sessionUser.email,
            photoURL: sessionUser.image ?? undefined,
          });
          setUser(data.user);
          toast.success(`Signed in as ${data.user.name}`);
        }
      } catch (error: any) {
        toast.error(
          error?.response?.data?.message || "Google sign-in failed. Try again."
        );
      } finally {
        url.searchParams.delete("google");
        window.history.replaceState(null, "", url.toString());
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const register: AuthContextType["register"] = async (payload) => {
    try {
      const { data } = await api.registerUser(payload);
      toast.success(data.message || "Registration successful! Please log in.");
      return true;
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Registration failed. Try again.");
      return false;
    }
  };

  const login: AuthContextType["login"] = async (email, password) => {
    try {
      const { data } = await api.loginUser({ email, password });
      setUser(data.user);
      toast.success(`Welcome back, ${data.user.name.split(" ")[0]}!`);
      return true;
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Login failed. Check your credentials.");
      return false;
    }
  };

  const logout = async () => {
    try {
      await api.logoutUser();
    } finally {
      setUser(null);
      toast.success("You have been logged out.");
      router.push("/");
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, register, login, loginWithGoogle, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
};
