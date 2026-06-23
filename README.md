# Wanderlust Trails — Client

Live: https://moonlit-cascaron-b47f4a.netlify.app

Next.js 14 (App Router) + TypeScript frontend for the Wanderlust Trails travel experience marketplace.

## Tech stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS (custom design system — see `tailwind.config.ts`)
- TanStack Query + Axios for data fetching
- React Hook Form + Zod for the AI Concierge form
- `use-debounce` for the search bar

## Setup

This client expects the API server (see `../server`) to be running first.

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

Open http://localhost:3000. By default it talks to the API at `http://localhost:4000` — change `NEXT_PUBLIC_API_URL` in `.env.local` if your server runs elsewhere.

## What's built

This build focuses on one complete core flow end-to-end, per the project scope, rather than the full multi-role/auth version of the spec:

- **Home** — hero with live search, featured listing grid (skeleton-loaded), category highlights, process section, testimonials, AI concierge teaser, footer.
- **Explore** (`/explore`) — debounced search, filtering by category/price/rating, sorting, pagination, and the AI Trip Concierge.
- **Experience details** (`/experiences/[id]`) — image gallery, overview, included items & highlights, the AI Highlight Generator, reviews, and related trips.
- **AI features (2, as required):**
  1. **AI Trip Concierge** — natural-language trip recommender (`/explore#concierge`)
  2. **AI Highlight Generator** — personalized "why you'll love this" blurb on each details page
- Light/dark mode with persisted preference, fully responsive layout, keyboard-visible focus states.

Not built in this pass (out of scope for the core flow): authentication, role-based dashboards, and the additional static pages (About/Contact/Blog/etc.) called for in the full spec. The component structure (Navbar, API layer, design tokens) is set up so these can be added on top without rework.

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
