# Developer onboarding

Read this, then [overview.md](./overview.md) and [architecture.md](./architecture.md). The live map of the same system sits in the architecture canvas beside chat.

## What you are building

A **responsive** student portal plus a small **admin** portal for **The Agent Labs** and **Time Rich** — same layout, different branding and content context.

- Brand from **Host** (`resolveBrand`); shared `auth.users` / `profiles`; brand-scoped memberships and catalog.
- Three student views per brand: **Essentials**, **Edit**, **Studio** (upgrade-oriented; not a single page with three labels).
- **40-day challenge** content tree: Challenge → Cohort → Module → Lesson → Content (challenge owns `brand_id`).
- **Drip emails** via Resend (cron + `email_events` with `brand_id`). Unlock pacing is still a product question.
- Admin access via **`brand_admins`**, not a global profile role.
- Deadline: **29 September 2026**.

Reference UX: [theagentlabs.ai/portal](https://theagentlabs.ai/portal/). Keep the student layout simple (school/LMS, not a marketing site).

## Stack

| Layer             | Choice                                                              |
| ----------------- | ------------------------------------------------------------------- |
| App               | Next.js App Router (this repo already uses Next 16)                 |
| UI                | React 19, Tailwind 4, DaisyUI themes `agentlabs` \| `timerich`      |
| Hosting           | Vercel (one deploy; brand from Host)                                |
| Auth / DB / files | Supabase (Auth, Postgres, Storage)                                  |
| ORM               | Drizzle — schema in `src/db/schema/`, camelCase TS / snake_case SQL |
| Email             | Resend (from-address / templates per brand)                         |
| Video             | Vimeo (later)                                                       |

Cursor rules in `.cursor/rules/` are the coding contract: architecture (SRP, domain free of UI/DB), Next.js App Router, Drizzle, TypeScript, React, state, styling, domain (multi-brand).

## Run the app

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Local default brand is `agentlabs` unless you set a host map (see below).

## Environment (add when you wire services)

Do not commit secrets. Typical names:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DATABASE_URL=                 # Postgres URI for Drizzle
RESEND_API_KEY=
# Optional local brand routing (JSON Host → brand id)
# BRAND_HOST_MAP={"localhost:3000":"agentlabs","timerich.local:3000":"timerich"}
# VIMEO_*                     # not needed until video work starts
```

## Where to put code

| Kind                   | Place                                                                    |
| ---------------------- | ------------------------------------------------------------------------ |
| Routes / layouts       | `app/` with `(public)`, `(student)`, `(admin)` groups — see architecture |
| Brand resolve          | `src/brand/` — Host → `brands` row; never trust client `brand_id`        |
| Schema                 | `src/db/schema/<domain>.ts`, re-export from `src/db/schema/index.ts`     |
| Gating, drip, progress | `src/domain/` — pure functions, injected deps; always filter by brand    |
| Auth helpers           | `src/auth/` — session + `brand_admins`                                   |
| Email send + event log | `src/email/` — Resend + `email_events` (brand-scoped)                    |
| Brand tokens           | `app/globals.css` — DaisyUI themes `agentlabs` and `timerich`            |

Do not query Postgres from client components. Use server actions or loaders, then pass data down.

## Conventions

- **Theme:** `agentlabs` or `timerich` from resolved brand (`data-theme={brand.theme}`). Use DaisyUI semantic utilities (`btn-primary`, `bg-base-100`, `text-base-content`). No raw hex in components.
- **Brand scope:** every catalog/membership/email query includes the current brand. Storage keys: `/{brand_id}/...`.
- **Components:** named-export arrow functions, props as `interface`.
- **Drizzle:** one schema file per domain; `notNull()` and keys explicit; put `brand_id` on `brands`-owned tables listed in architecture.
- **State:** keep UI state local; server/cache state is not `useState`.
- **Simplest thing that works.** Brand resolve + three portal shells + schema beat a polished video player.

## First slice (suggested)

1. Route groups and empty layouts for public / student / admin (brand-aware root layout theme).
2. Drizzle schema: `brands`, `brand_admins`, profiles, brand-scoped tiers/memberships, challenge tree (`challenges.brand_id`), progress, `email_events.brand_id`. Seed `agentlabs` and `timerich`.
3. `resolveBrand(Host)` + local `BRAND_HOST_MAP` / localhost default.
4. Supabase Auth + `profiles` row on signup (global profile).
5. Membership-aware student dashboard for **current brand** (three catalogs, placeholder lessons).
6. Admin CRUD gated by `brand_admins` for modules / lessons / content (text + link is enough).
7. Drip job that writes brand-scoped `email_events` and sends via Resend — after pacing is decided.
