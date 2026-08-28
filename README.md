# Learning Hub

Multi-brand learning portal for **[The Agent Labs](https://theagentlabs.ai/portal/)** and **Time Rich**: same layout, brand from Host, shared auth, brand-scoped catalog. **40-day challenge**, three student views (**Essentials**, **Edit**, **Studio**), drip via Resend, and an admin portal (`brand_admins`).

This repo is the Next.js app (App Router, DaisyUI themes `agentlabs` | `timerich`). Target backend: **Supabase + Drizzle + Resend + Vimeo** (video is not v1).

## Docs

- [Project overview](./docs/overview.md) — brands, tiers, sprint constraints
- [Architecture](./docs/architecture.md) — stack, multi-brand schema, gating, DB-fit verdict
- [Developer onboarding](./docs/onboarding.md) — how to run, brand resolve, first slice

Diagrams: [system](./docs/diagrams/agent-labs-system-architecture.png) · [data model](./docs/diagrams/agent-labs-data-model.png) (mermaid in architecture.md is source of truth for multi-brand)

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Full setup and conventions are in the onboarding doc.
