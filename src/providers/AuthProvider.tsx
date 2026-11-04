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
import { signInWithPopup, signOut as firebaseSignOut } from "firebase/auth";

import { auth, googleProvider, isFirebaseReady } from "@/lib/firebase";
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

  const loginWithGoogle = async () => {
    if (!isFirebaseReady || !auth || !googleProvider) {
      toast.error("Google sign-in is not configured yet. Add your Firebase keys to .env.local");
      return false;
    }

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;

      const { data } = await api.googleLogin({
        name: fbUser.displayName,
        email: fbUser.email!,
        photoURL: fbUser.photoURL,
      });

      setUser(data.user);
      toast.success(`Signed in as ${data.user.name}`);
      return true;
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Google sign-in was cancelled.");
      return false;
    }
  };

  const logout = async () => {
    try {
      if (isFirebaseReady && auth) await firebaseSignOut(auth).catch(() => {});
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
