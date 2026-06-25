# Wanderlust Trails — Client

Live: https://ai-project-one-ebon.vercel.app

Next.js 14 (App Router) + TypeScript frontend for the Wanderlust Trails travel experience marketplace.

## Tech stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS (custom design system — see `tailwind.config.ts`)
- TanStack Query + Axios for data fetching
- React Hook Form + Zod for the AI Concierge form
- **Firebase Authentication** (client SDK) for sign-in/sign-up, including real Google sign-in
- `use-debounce` for the search bar

## Setup

This client expects the API server (see `../server`) to be running first, with its MongoDB and Firebase Admin credentials configured (see `server/README.md`).

```bash
npm install
cp .env.local.example .env.local
```

Fill in the `NEXT_PUBLIC_FIREBASE_*` values in `.env.local` from the **same** Firebase project you configured for the server (Firebase console > Project settings > General > Your apps > add a Web app if needed > SDK setup and configuration).

```bash
npm run dev
```

Open http://localhost:3000. By default it talks to the API at `http://localhost:4000` — change `NEXT_PUBLIC_API_URL` if your server runs elsewhere.

## What's built

This build focuses on one complete core flow end-to-end, per the project scope, rather than the full multi-role/auth version of the spec:

- **Home** — hero with live search, featured listing grid (skeleton-loaded), category highlights, process section, testimonials, AI concierge teaser, footer.
- **Explore** (`/explore`) — debounced search, filtering by category/price/rating, sorting, pagination, and the AI Trip Concierge.
- **Experience details** (`/experiences/[id]`) — image gallery, overview, included items & highlights, the AI Highlight Generator, reviews, and related trips.
- **Login** (`/login`) — email/password sign-in, one-click demo logins for both the User and Admin accounts, and social login buttons (UI only — see note below).
- **Register** (`/register`) — validated sign-up form; new accounts are always created with the `user` role.
- **Account** (`/account`) — simple per-role landing page for regular users: account details and quick links. Redirects to `/login` if not signed in.
- **Admin** (`/admin`) — simple per-role landing page for admins: live overview cards (listing count, average rating, total reviews, average price) and a category breakdown, all computed from the real catalog. Redirects non-admins to `/account` and signed-out visitors to `/login`.
- **AI features (2, as required):**
  1. **AI Trip Concierge** — natural-language trip recommender (`/explore#concierge`)
  2. **AI Highlight Generator** — personalized "why you'll love this" blurb on each details page
- Light/dark mode with persisted preference, fully responsive layout, keyboard-visible focus states.

## Auth & demo credentials

Auth is real: Firebase Authentication handles sign-in (email/password and Google), and the Express server verifies each Firebase ID token and stores app-specific profile data (like `role`) in MongoDB — see `server/README.md` for the full flow. Two demo accounts exist once you've run `npm run seed:demo` on the server:

| Role | Email | Password |
|---|---|---|
| User | `demo.user@wanderlusttrails.example` | `DemoUser123!` |
| Admin | `demo.admin@wanderlusttrails.example` | `DemoAdmin123!` |

The login page has one-click buttons for both. The **Google** button is fully functional (real Firebase popup sign-in) once you've enabled the Google provider in your Firebase project. The **Facebook** button is present in the UI to match the spec but isn't wired up — that requires registering a separate app with Meta's developer portal, which is outside the scope of a free demo; clicking it shows an explanatory note rather than failing silently.

Not built in this pass (out of scope for the core flow): the multi-page sidebar/charts/data-table dashboards from the full spec, and the additional static pages (About/Contact/Blog/etc.). What's here are simple, real per-role landing pages (`/account`, `/admin`) rather than the full dashboard system — the component structure is set up so those can be added on top without rework.

## Design system

A custom "field journal" aesthetic: warm paper background, deep forest green primary, mustard accent, with `Fraunces` for display type, `Inter` for body, and `JetBrains Mono` for data/meta. The recurring signature element is a dashed "trail line" divider and rotated passport-stamp category badges — see `components/TrailDivider.tsx` and `components/Stamp.tsx`.

## Project structure

```
app/
  layout.tsx              Root layout, fonts, providers
  page.tsx                 Home page
  explore/page.tsx          Search/filter/sort/paginate + AI Concierge
  experiences/[id]/page.tsx  Details page
  not-found.tsx              Themed 404
components/                 All UI components
lib/api.ts                  Axios client + typed API calls
lib/types.ts                 Shared types
providers/                  TanStack Query + Theme providers
```
