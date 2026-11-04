# StudioSpace — Client

**Peer-to-Peer Creative Workspace & Production Studio Sharing Platform**

> Live site: **https://studiospace.vercel.app** _(replace with your deployed Vercel URL)_
>
> Server repo: [`studiospace-server`](https://github.com/your-username/studiospace-server)
> API base: `https://studiospace-server.onrender.com`

---

## Website features

- **Hero slider built with Swiper.js** — three cinematic slides with punchy headlines and primary CTAs (`Explore Studios` / `Host Your Space`) that deep-link straight into `/studios`.
- **Dynamic featured studios** — the six top-rated spaces are fetched from MongoDB with `.limit(6)`, each card showing a category badge, hourly rate, rating badge, location and a *View Details* button.
- **Full CRUD for studio listings** — create, read, update and delete workspaces through a private `/add-studio` form, `/my-listings` table, `/studios/edit/[id]` pre-filled editor, plus a custom confirmation modal before every delete.
- **Booking engine with double-booking prevention** — pick a date and time range, see live availability, and get rejected with a clear message if the slot overlaps an already-confirmed reservation.
- **JWT authentication with HTTPOnly cookies** — register, login and Google sign-in, with protected routes that keep you signed in even after a full page reload on a private URL.
- **Polished UX everywhere** — light/dark theme toggle, branded skeleton loaders, Sonner toast notifications, a custom illustrated 404 page, friendly empty states, and a downloadable **PDF booking invoice**.

---

## Tech stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 15 (App Router), React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + shadcn/ui (Radix primitives) |
| Components | Lucide React icons, Radix UI (dialog, dropdown, select) |
| Notifications | Sonner |
| Slider / Carousel | Swiper.js |
| Theme | `next-themes` (light ⇄ dark) |
| Auth | Firebase (Google sign-in) + JWT in an HTTPOnly cookie |
| Data fetching | Axios (single instance, `withCredentials: true`) |
| Forms & validation | React Hook Form–style controlled inputs + Zod-ready validators |
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
| `NEXT_PUBLIC_API_URL` | production only | Leave **empty** locally — Next.js proxies `/api/*` to `http://localhost:5000`. Set it to your Render URL when you deploy. |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | for Google login | Firebase Console → Project settings → Web app |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | for Google login | `your-project.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | for Google login | |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | for Google login | |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | for Google login | |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | for Google login | |
| `NEXT_PUBLIC_IMGBB_API_KEY` | for image upload | Free key from <https://api.imgbb.com/> |

> Without Firebase keys the app still runs — the Google button simply shows a friendly toast instead of crashing.

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

Both accounts can log in with email + password. Google sign-in also works once Firebase keys are configured.

> Password rules enforced on both client and server: minimum 6 characters, at least one uppercase letter, at least one lowercase letter.

---

## Project structure

```
client/
└── src/
    ├── app/                     # App Router pages
    │   ├── page.tsx             # Home (hero, featured, categories, how it works, guarantee)
    │   ├── studios/             # Explore + details + edit
    │   ├── login/  register/    # Authentication
    │   ├── add-studio/          # Create listing (private)
    │   ├── my-listings/         # Host CRUD table (private)
    │   ├── my-bookings/         # Guest bookings + PDF invoice (private)
    │   ├── dashboard/           # Stats + booking requests (private)
    │   ├── wishlist/            # Saved studios (private)
    │   ├── about/  how-it-works/  terms/  privacy/
    │   └── not-found.tsx        # Custom illustrated 404
    ├── components/
    │   ├── ui/                  # shadcn/ui primitives
    │   ├── shared/              # Navbar, Footer, StudioCard, modals, loaders
    │   ├── home/                # Hero slider, featured, categories, guarantee
    │   └── studios/             # StudioForm, BookingModal, details, explorer
    ├── lib/                     # axios instance, API calls, firebase, invoice, utils
    └── providers/               # ThemeProvider, AuthProvider, Providers
```
