# AGENTS.md

Next.js 16 (App Router) + React 19 client for StudioSpace, a peer-to-peer studio rental platform. Backend is a **separate Express/MongoDB repo** (`studiospace-server`) — this repo has no database or server code.

## Commands

- `npm run dev` — dev server on `0.0.0.0:3000` (bind is intentional for sandbox previews).
- `npm run build` / `npm start` — production build / serve.
- There is **no test, lint, or typecheck script**. Verify changes with `npx tsc --noEmit`, then `npm run build`.

## Env & API wiring (easy to get wrong)

- Copy `.env.local.example` → `.env.local`. `.env.local` holds git-ignored secrets: `MONGODB_URI` (same Atlas DB as the backend), `BETTER_AUTH_SECRET`, and `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET` (Google Cloud Console Web OAuth client; redirect URI is `http://localhost:3000/api/better-auth/callback/google`).
- **Leave `NEXT_PUBLIC_API_URL` empty in dev.** Empty → axios uses relative paths and `next.config.ts` rewrites `/api/:path*` to the Express server (`SERVER_URL` env, default `http://localhost:8000` — note: README says 5000, config says 8000; trust `next.config.ts` and the `SERVER_URL` env). Set it only to call a deployed backend directly.
- Never call the backend from components via its own URL or `fetch` to it. Always go through `src/lib/axios.ts` (the single instance) and helpers in `src/lib/api.ts`. The instance is `withCredentials: true` because auth relies on an HTTPOnly JWT cookie named `token` — CORS breaks if you bypass it.
- All REST endpoints live in `src/lib/api.ts` with course-style paths (`/api/studio/:id`, `/api/add-studio`, `/api/add-booking`). Read it before guessing endpoint names.

## Auth: three layers, don't touch the layering

1. `src/proxy.ts` — **this is Next 16's rename of `middleware.ts`** (do not create `middleware.ts`). It only checks the `token` cookie exists, for fast redirects; it does NOT verify the JWT.
2. `PrivateRoute` (client) — calls `GET /api/auth/me`, so logged-in users survive reloads of protected routes.
3. The Express server verifies the JWT signature server-side. Never "fix" redirects by adding signature checks to the proxy.

When adding a private page: add the route to `PROTECTED_ROUTES` in `src/proxy.ts` **and** wrap the page in `<PrivateRoute>`. Both are required.

### Google sign-in runs on Better Auth — never via `/api/auth/*`

- `POST /api/auth/*` proxies to Express (JWT cookie via `withCredentials`). Google OAuth round-trip does **not** go there.
- Better Auth is mounted in this Next app at `/api/better-auth/*` (`src/app/api/better-auth/[...all]/route.ts`, config in `src/lib/better-auth.ts`, browser client in `src/lib/auth-client.ts`). The path must stay different from `/api/auth/*` — otherwise Express would never see the callbacks. Google's authorized redirect URI is `http://localhost:3000/api/better-auth/callback/google`.
- Google sign-in does a **full-page redirect**: AuthProvider appends `?google=1` to the callback URL; back on the app, `AuthProvider`'s mount effect calls Express `POST /api/auth/google` to upsert the users-collection row and receive the HTTPOnly JWT cookie, then strips the flag. Without the env values above the Google button toasts "connection refused / misconfigured", it does not crash.
- Two separate auth stores exist (better-auth collections vs Express `users`) by design; keep `POST /api/auth/google` as the single sync point.

## Conventions

- Tailwind CSS **v4** (no `tailwind.config.*`; theme tokens live in CSS via `src/app/globals.css`) + shadcn/ui "new-york" style. Add primitives with `npx shadcn@latest add <name>`; they land in `src/components/ui`. Never hand-edit ui primitives gratuitously.
- Path alias `@/*` → `src/*`.
- Toasts via `sonner`; icons via `lucide-react`; theme via `next-themes` (`ThemeProvider`).
- Auth state: `useAuth()` from `src/providers/AuthProvider` — it throws outside `<AuthProvider>`.

## Testing logins

Seeded accounts: `examiner@studiospace.com` / `host@studiospace.com`, password `Exam@1234` (min 6 chars, 1 upper, 1 lower). Useful when no test suite exists to exercise auth flows manually.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
