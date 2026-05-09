# Stackform

Define AI agent workflows. Run them against your codebase. Get logs and audit trails.

Stackform is a workflow runner for engineering teams that want their AI agents to be observable. You describe a task, Stackform picks the right agents, runs them, and writes everything to durable logs you can come back to.

## Status

Pre-1.0. Used internally and by a small number of design partners. Things break.

## Stack

- Next.js 15 (App Router)
- TypeScript (strict)
- Convex for state, queries, mutations, and realtime
- Tailwind for styling
- Stripe for billing
- OpenAI for agent execution

No Redux, no tRPC, no Prisma. Convex is the single source of truth.

## Setup

```bash
pnpm install
cp .env.example .env.local
npx convex dev
pnpm dev
```

You will need:

- `OPENAI_API_KEY`
- `STRIPE_SECRET_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `CONVEX_DEPLOYMENT` (set by `npx convex dev`)

## Tiers

| | Free | Pro ($49/mo) |
|---|---|---|
| Workflows | 3 | Unlimited |
| Runs / month | 100 | Higher cap, see pricing |
| Log retention | 7 days | 90 days |
| Team sharing | No | Yes |
| Audit logs | No | Yes |

Caps are enforced server-side in `convex/workflows.ts` and `convex/runs.ts`. Do not enforce them on the client.

## Layout

```
app/            Next.js App Router pages
components/     Shared React components
convex/         Convex schema + functions (the backend)
lib/            Stripe config, helpers, types
```

## Conventions

- Strict TypeScript. No `any`. If you need an escape hatch, use `unknown` and narrow.
- Tailwind only. No CSS modules, no styled-components, no inline `style` unless dynamic.
- Dark terminal aesthetic. `bg-zinc-950`, monospace, minimal chrome.
- Stripe price IDs live in `lib/stripe/config.ts`. Do not inline them in components. See the April 3 post-mortem.
- Analytics events live in `convex/analytics.ts`. Add properties to existing events instead of forking new ones unless you have a reason.

## Deploys

Vercel for the Next app. Convex prod deployment is `stackform-prod`. Stripe webhooks point at `/api/stripe/webhook`.

## Open issues

See `experiment-log.md` for active experiments and `post-mortem-checkout-incident.md` for the April 3 incident write-up.

— Dan
