# Agent Labs Portal — Project Overview

Reference site: [https://theagentlabs.ai/portal/](https://theagentlabs.ai/portal/)

This is the learning portal for Agent Labs. Students work through a **40-day challenge**. Access is **tiered** so each view shows different content and encourages upgrades. Content unlocks on a **drip schedule**, with email via Resend.

## Product

Three student views, each a different membership tier:

| Tier           | Purpose                                           |
| -------------- | ------------------------------------------------- |
| **Essentials** | Base access. Enough to start; limited catalog.    |
| **Edit**       | Mid tier. More modules/resources than Essentials. |
| **Studio**     | Full catalog. Highest-access view.                |

Tiers are not just labels they change what the student actually sees.

## Sprint constraints (as of 26 Aug 2026)

- **Deadline:** 29 September 2026 (~3 weeks of hard sprint).
- **Responsive** (mobile-friendly) from the start.
- **Admin portal** is in scope so content can be managed correctly.
- **Pacing is still open.** Weekly drip vs 40-day challenge cadence needs a decision. Do not hard-code a schedule until that is settled.
- Layout reference: keep the student UI **simple**, in the spirit of a school/LMS platform.

## What this repo is today

A Next.js App Router starter with the Agent Labs DaisyUI theme (`data-theme="agentlabs"`). Auth, schema, drip, and the three portal shells are not built yet. See [architecture.md](./architecture.md) for the target system and [onboarding.md](./onboarding.md) to start work.
