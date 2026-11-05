import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow the sandboxed preview host to talk to the dev server
  allowedDevOrigins: ["*.e2b.app", "*.e2b.dev", "*.arena.ai"],
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },

  /**
   * Proxy /api/* to the Express backend.
   * The browser only ever talks to one origin, so cookies (HTTPOnly JWT)
   * and CORS stay simple in dev, preview and production alike.
   */
  async rewrites() {
    const api = process.env.SERVER_URL || "http://localhost:8000";
    return [{ source: "/api/:path*", destination: `${api}/api/:path*` }];
  },
};

export default nextConfig;
