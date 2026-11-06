/**
 * Better Auth — Google social sign-in (server-side only; NEVER import from client code).
 *
 * Runs inside the Next.js app at `/api/better-auth/*` (mounted under that
 * path, *not* `/api/auth/*`, because `/api/auth/*` is proxied to the
 * Express backend and Express owns the JWT cookie + all data endpoints).
 *
 * Flow:
 *   1. Browser clicks "Continue with Google" -> redirected to Google.
 *   2. Google redirects back to `/api/better-auth/callback/google`;
 *      better-auth validates the callback, creates/updates a user in its Mongo
 *      collections and sets its session cookie.
 *   3. The client then calls Express `POST /api/auth/google` to upsert the
 *      user in Express' `users` collection and receive the HTTPOnly JWT
 *      cookie the rest of the app relies on. (see AuthProvider)
 *
 * Needs (server-side, NOT NEXT_PUBLIC_*):
 *   GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET  — Google Cloud Console OAuth client
 *   BETTER_AUTH_SECRET                       — any random 32+ char string
 *   MONGODB_URI                              — same Atlas URI as studiospace-server
 *   BETTER_AUTH_URL                          — public origin (default http://localhost:3000)
 *   BETTER_AUTH_TRUSTED_ORIGINS              — optional comma-separated extra origins
 */
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";
import { MongoClient, type Db } from "mongodb";

export const isBetterAuthReady = Boolean(
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.MONGODB_URI
);

const createAuth = () => {
  const client = new MongoClient(process.env.MONGODB_URI as string);
  const db: Db = client.db(process.env.MONGODB_DB || "studiospace");

  return betterAuth({
    appName: "StudioSpace",
    database: mongodbAdapter(db),
    secret: process.env.BETTER_AUTH_SECRET,
    // next dev binds 0.0.0.0, so req.url is "http://0.0.0.0:3000/..." while the
    // browser sends Origin: http://localhost:3000 — deriving the trusted origin
    // from the request would never match. Pin it explicitly.
    // In production set BETTER_AUTH_URL to the public origin.
    // Extra origins (preview URLs, LAN IPs): set BETTER_AUTH_TRUSTED_ORIGINS
    // to a comma-separated list, e.g. "https://xyz.e2b.dev,http://192.168.1.5:3000"
    baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
    basePath: "/api/better-auth",
    plugins: [nextCookies()],
    socialProviders: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      },
    },
  });
};

type Auth = ReturnType<typeof createAuth>;

let cached: Auth | null = null;

/** Lazy-factory so `next build` does not need the env vars, and dev reloads reuse one client. */
export function getAuth(): Auth {
  if (!cached) {
    if (!isBetterAuthReady) {
      throw new Error(
        "Better Auth is not configured. Set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, BETTER_AUTH_SECRET and MONGODB_URI in .env.local and restart the dev server."
      );
    }
    cached = createAuth();
  }
  return cached;
}
