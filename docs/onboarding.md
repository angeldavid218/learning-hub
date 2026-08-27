# Developer onboarding

Read this, then [overview.md](./overview.md) and [architecture.md](./architecture.md). The live map of the same system sits in the architecture canvas beside chat.

## What you are building

A **responsive** student portal plus a small **admin** portal for Agent Labs.

- Three student views: **Essentials**, **Edit**, **Studio** (upgrade-oriented; not a single page with three labels).
- **40-day challenge** content tree: Challenge → Cohort → Module → Lesson → Content.
- **Drip emails** via Resend (cron + `email_events`). Unlock pacing is still a product question.
- Deadline: **29 September 2026**.

Reference UX: [theagentlabs.ai/portal](https://theagentlabs.ai/portal/). Keep the student layout simple (school/LMS, not a marketing site).

## Stack

| Layer             | Choice                                                              |
| ----------------- | ------------------------------------------------------------------- |
| App               | Next.js App Router (this repo already uses Next 16)                 |
| UI                | React 19, Tailwind 4, DaisyUI theme `agentlabs`                     |
| Hosting           | Vercel                                                              |
| Auth / DB / files | Supabase (Auth, Postgres, Storage)                                  |
| ORM               | Drizzle — schema in `src/db/schema/`, camelCase TS / snake_case SQL |
| Email             | Resend                                                              |
| Video             | Vimeo (later)                                                       |

Cursor rules in `.cursor/rules/` are the coding contract: architecture (SRP, domain free of UI/DB), Next.js App Router, Drizzle, TypeScript, React, state, styling.

## Run the app

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). You should see the starter page with `data-theme="agentlabs"` on `<html>`.

## Environment (add when you wire services)

Do not commit secrets. Typical names:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DATABASE_URL=                 # Postgres URI for Drizzle
RESEND_API_KEY=
# VIMEO_*                     # not needed until video work starts
```

## Where to put code

| Kind                   | Place                                                                    |
| ---------------------- | ------------------------------------------------------------------------ |
| Routes / layouts       | `app/` with `(public)`, `(student)`, `(admin)` groups — see architecture |
| Schema                 | `src/db/schema/<domain>.ts`, re-export from `src/db/schema/index.ts`     |
| Gating, drip, progress | `src/domain/` — pure functions, injected deps                            |
| Auth helpers           | `src/auth/`                                                              |
| Email send + event log | `src/email/`                                                             |
| Brand tokens           | `app/globals.css` (`--brand-*`, DaisyUI `agentlabs`)                     |

Do not query Postgres from client components. Use server actions or loaders, then pass data down.

## Conventions

- **Theme:** only `agentlabs`. Use `btn-primary`, `bg-base-100`, `text-base-content`. No raw `#d4ff4f` in components.
- **Components:** named-export arrow functions, props as `interface`.
- **Drizzle:** one schema file per domain; `notNull()` and keys explicit.
- **State:** keep UI state local; server/cache state is not `useState`.
- **Simplest thing that works.** Three portal shells + schema beat a polished video player.

## First slice (suggested)

1. Route groups and empty layouts for public / student / admin.
2. Drizzle schema for profiles, tiers, memberships, challenge tree, progress, email_events.
3. Supabase Auth + `profiles` row on signup.
4. Membership-aware student dashboard (three catalogs, placeholder lessons).
5. Admin CRUD for modules / lessons / content (text + link is enough).
6. Drip job that writes `email_events` and sends via Resend — after pacing is decided.
