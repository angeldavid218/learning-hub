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

# Local admin promotion (optional — used by npm run db:seed)
# SEED_ADMIN_USER_ID=         # profiles.id / auth.users.id UUID after you sign up
# SEED_ADMIN_EMAIL=           # alternative: look up auth.users by email
# SEED_ADMIN_BRAND_IDS=agentlabs,timerich   # default: both brands
```

## Seed reference data + local admin

```bash
npm run db:seed
```

Idempotent. Ensures both brands (`agentlabs`, `timerich`), three membership tiers each (`essentials` / `edit` / `studio`), and — when you set an env var — a `brand_admins` row so you can open the admin portal.

### Promote yourself to brand admin

Admin access is a row in `brand_admins` for the **current brand**, not a global profile flag. Do not hard-code a fake UUID; use a user you can actually sign in as.

1. Sign up / sign in locally once so `ensureProfile` creates your `profiles` row.
2. Put your Auth user id in `.env` (Supabase Dashboard → Authentication → Users, or the `id` on your session):

   ```bash
   SEED_ADMIN_USER_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
   ```

   Or set `SEED_ADMIN_EMAIL=you@example.com` (resolved via `auth.users`).
3. Re-run `npm run db:seed`. You should see a log line confirming `brand_admins` for your profile on `agentlabs` and `timerich` (or the brands in `SEED_ADMIN_BRAND_IDS`).

**Manual SQL** (same effect, if you prefer not to use the env vars):

```sql
-- Replace the UUID with your auth.users / profiles.id
insert into brand_admins (profile_id, brand_id)
values
  ('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', 'agentlabs'),
  ('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', 'timerich')
on conflict do nothing;
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
