/**
 * Better Auth browser client — mirrors the mounted `/api/better-auth` base path.
 * Server-side session is only used for the Google OAuth round-trip; the app's
 * real auth cookie is Express' HTTPOnly JWT (`token`).
 */
import { createAuthClient } from "better-auth/client";

// Module scope runs during SSR too, where relative URLs are invalid — and
// no auth calls happen server-side. In the browser we use the real origin.
const baseURL =
  typeof window !== "undefined"
    ? `${window.location.origin}/api/better-auth`
    : "http://localhost:3000/api/better-auth";

export const authClient = createAuthClient({ baseURL });
