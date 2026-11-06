import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow the sandboxed preview host to talk to the dev server
  allowedDevOrigins: ["*.e2b.app", "*.e2b.dev", "*.arena.ai"],
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },

  /**
   * Proxy /api/* to the Express backend — EXCEPT /api/better-auth/*, which
   * is handled by this Next app's own route handler (Google OAuth flow).
   * Note: `afterFiles` rewrites match BEFORE dynamic routes (see
   * rewrites.md), so the exclusion must be expressed in the source regex:
   * everything under /api/ that doesn't start with "better-auth" goes to
   * Express; anything under /api/better-auth/ falls through to the
   * app/api/better-auth/[...all]/route.ts handler.
   */
  async rewrites() {
    const api = process.env.SERVER_URL || "http://localhost:8000";
    return [{ source: "/api/:path((?!better-auth(?:/|$)).*)", destination: `${api}/api/:path*` }];
  },
};

export default nextConfig;
