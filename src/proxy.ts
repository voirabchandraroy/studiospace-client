import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_ROUTES = [
  "/dashboard",
  "/add-studio",
  "/my-listings",
  "/my-bookings",
  "/wishlist",
  "/studios/edit",
];

/** Routes a signed-in user has no reason to visit again */
const AUTH_ROUTES = ["/login", "/register"];

const isMatch = (pathname: string, routes: string[]) =>
  routes.some((route) => pathname === route || pathname.startsWith(`${route}/`));

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // The HTTPOnly JWT set by the Express API (Cookie name: "token")
  const hasSession = Boolean(request.cookies.get("token")?.value);

  /* 1. Already signed in? Skip the login / register forms entirely. */
  if (hasSession && isMatch(pathname, AUTH_ROUTES)) {
    const redirectTo = request.nextUrl.searchParams.get("redirect");
    const safeTarget = redirectTo?.startsWith("/") ? redirectTo : "/";
    return NextResponse.redirect(new URL(safeTarget, request.url));
  }

  /* 2. Hitting a private route without a session cookie → send to login,
        remembering where they were headed. */
  if (!hasSession && isMatch(pathname, PROTECTED_ROUTES)) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  /* 3. Lightweight hardening headers on every matched response.
        (X-Frame-Options is deliberately NOT set so the app can still be
        embedded in preview / LMS iframes.) */
  const response = NextResponse.next();
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  return response;
}

export const config = {
  /**
   * Never run on: the /api rewrite to Express, Next internals, or static files —
   * otherwise the redirect logic would break CSS, JS and images.
   */
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?|css|js)$).*)",
  ],
};
