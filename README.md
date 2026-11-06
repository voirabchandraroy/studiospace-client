# StudioSpace â€” Client

**Peer-to-Peer Creative Workspace & Production Studio Sharing Platform**

> Live site: **https://studiospace.vercel.app** _(replace with your deployed Vercel URL)_
>
> Server repo: [`studiospace-server`](https://github.com/your-username/studiospace-server)
> API base: `https://studiospace-server.onrender.com`

---

## Website features

- **Hero slider built with Swiper.js** â€” three cinematic slides with punchy headlines and primary CTAs (`Explore Studios` / `Host Your Space`) that deep-link straight into `/studios`.
- **Dynamic featured studios** â€” the six top-rated spaces are fetched from MongoDB with `.limit(6)`, each card showing a category badge, hourly rate, rating badge, location and a *View Details* button.
- **Full CRUD for studio listings** â€” create, read, update and delete workspaces through a private `/add-studio` form, `/my-listings` table, `/studios/edit/[id]` pre-filled editor, plus a custom confirmation modal before every delete.
- **Booking engine with double-booking prevention** â€” pick a date and time range, see live availability, and get rejected with a clear message if the slot overlaps an already-confirmed reservation.
- **JWT authentication with HTTPOnly cookies** â€” register, login and Google sign-in, with protected routes that keep you signed in even after a full page reload on a private URL.
- **Polished UX everywhere** â€” light/dark theme toggle, branded skeleton loaders, Sonner toast notifications, a custom illustrated 404 page, friendly empty states, and a downloadable **PDF booking invoice**.

---

## Tech stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 16 (App Router), React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + shadcn/ui (Radix primitives) |
| Components | Lucide React icons, Radix UI (dialog, dropdown, select) |
| Notifications | Sonner |
| Slider / Carousel | Swiper.js |
| Theme | `next-themes` (light â‡„ dark) |
| Auth | Better Auth (Google sign-in) + JWT in an HTTPOnly cookie |
| Data fetching | Axios (single instance, `withCredentials: true`) |
| Forms & validation | React Hook Formâ€“style controlled inputs + Zod-ready validators |
| PDF | jsPDF |
| Hosting | Vercel |

---

## Local setup

```bash
# 1. Go into the client folder
cd studiospace-client

# 2. Install dependencies
npm install

# 3. Create your environment file, then fill in the values
cp .env.local.example .env.local

# 4. Start the dev server
npm run dev
```

Open **http://localhost:3000**.

### Environment variables (`.env.local`)

| Variable | Required | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | production only | Leave **empty** locally â€” Next.js proxies `/api/*` to `http://localhost:5000`. Set it to your Render URL when you deploy. |
| `GOOGLE_CLIENT_ID` | for Google sign-in | Google Cloud Console → Credentials → Web OAuth client |
| `GOOGLE_CLIENT_SECRET` | for Google sign-in | Same OAuth client — server-side only, never NEXT_PUBLIC |
| `MONGODB_URI` | for Google sign-in | Same Atlas URI as the backend (Better Auth stores its own collections) |
| `BETTER_AUTH_SECRET` | for Google sign-in | Random 32+ char hex — `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |

> Google sign-in runs inside this Next app at `/api/better-auth/*` (registered as a separate path, so `/api/auth/*` still reaches Express). In Google Cloud Console create a **Web OAuth 2.0 client** with Authorized JS origin `http://localhost:3000` and Authorized redirect URI `http://localhost:3000/api/better-auth/callback/google`. Until that client ID/secret are set in `.env.local` the Google button shows a friendly 500 message instead of crashing.

### Build & run

```bash
npm run build     # production build
npm run start     # serve the production build
```

---

## Examiner test credentials

| Role | Email | Password |
| --- | --- | --- |
| Creator / guest | `examiner@studiospace.com` | `Exam@1234` |
| Studio host | `host@studiospace.com` | `Exam@1234` |

Both accounts can log in with email + password. Google sign-in also works once Better Auth is configured (see the env table above).

> Password rules enforced on both client and server: minimum 6 characters, at least one uppercase letter, at least one lowercase letter.

---

## Project structure

```
client/
â””â”€â”€ src/
    â”œâ”€â”€ app/                     # App Router pages
    â”‚   â”œâ”€â”€ page.tsx             # Home (hero, featured, categories, how it works, guarantee)
    â”‚   â”œâ”€â”€ studios/             # Explore + details + edit
    â”‚   â”œâ”€â”€ login/  register/    # Authentication
    â”‚   â”œâ”€â”€ add-studio/          # Create listing (private)
    â”‚   â”œâ”€â”€ my-listings/         # Host CRUD table (private)
    â”‚   â”œâ”€â”€ my-bookings/         # Guest bookings + PDF invoice (private)
    â”‚   â”œâ”€â”€ dashboard/           # Stats + booking requests (private)
    â”‚   â”œâ”€â”€ wishlist/            # Saved studios (private)
    â”‚   â”œâ”€â”€ about/  how-it-works/  terms/  privacy/
    â”‚   â””â”€â”€ not-found.tsx        # Custom illustrated 404
    â”œâ”€â”€ components/
    â”‚   â”œâ”€â”€ ui/                  # shadcn/ui primitives
    â”‚   â”œâ”€â”€ shared/              # Navbar, Footer, StudioCard, modals, loaders
    â”‚   â”œâ”€â”€ home/                # Hero slider, featured, categories, guarantee
    â”‚   â””â”€â”€ studios/             # StudioForm, BookingModal, details, explorer
    â”œâ”€â”€ app/api/                # Better Auth handler (/api/better-auth/*)
    â”œâ”€â”€ lib/                     # axios instance, API calls, Better Auth config, invoice, utils
    â””â”€â”€ providers/               # ThemeProvider, AuthProvider, Providers
```

