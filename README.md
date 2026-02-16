# Alan Runtime - Site and Spark System

Internal Next.js runtime for Alan's assistant surfaces:

- Marketing site: `/`
- Spark Stage 1: `/:slug`
- Spark Stage 2: `/:slug/pitch`
- Dashboard: `/admin`

## Quick Start

```bash
npm install
npm run dev
```

## First-Time Environment Bootstrap (Do This Once)

Before relying on assistant-driven local, GitHub, or Vercel workflows:

```bash
node -v
npm -v
gh --version
vercel --version
```

If missing:

- Install Node.js LTS
- Install GitHub CLI (`gh`)
- Install Vercel CLI (`vercel`)

Authenticate CLI tools:

```bash
gh auth login
gh auth status
vercel login
vercel whoami
```

Then verify runtime launch:

```bash
npm install
npm run dev
```

Dashboard should open at `http://localhost:3000/admin`.

Build and lint:

```bash
npm run lint
npm run build
```

## Internal Operating Structure

Project runtime is split into two layers:

1. **Assistant operating layer**
   - `.cursor/rules/*` for behavior, context loading, domain/gamification protocols
2. **Runtime context/state layer**
   - `.cursor/context/master.md` (durable profile)
   - `.cursor/context/state.md` (active phase + continuity)
   - `.cursor/context/onboarding.md` (first-session and sparse-state flow)
   - `site/lib/data/*` for runtime state data

For final handoff, runtime data should be on blank-slate onboarding baseline (Level 1, no active task/property history, Story Mission 1 available).

Spark demo assets live in:

- `lib/data/sparks/*.json`
- `lib/data/review-evidence/*.reviews.json`

## Spark Workflow (Operator)

Standard sequence:

```bash
npx tsx scripts/create-spark.ts <slug>
npx tsx scripts/import-reviews-manual.ts <slug>
npx tsx scripts/score-spark.ts <slug>
npx tsx scripts/qa-spark.ts <slug>
```

Batch QA (no built-in `--all` flag currently):

```bash
for f in lib/data/sparks/*.json; do
  slug="$(basename "$f" .json)"
  if [ "$slug" != "spark-template" ]; then
    npx tsx scripts/qa-spark.ts "$slug" || exit 1
  fi
done
```

## Demo vs Production Evidence Behavior

- **Current mode (handoff/demo-safe):** file-backed evidence with manual import path.
- **Rule:** no fabricated review content; citations required (`source`, `reviewDate`).
- **If evidence is thin:** keep confidence low/limited rather than forcing strong claims.

## Deferred Integrations (Intentional)

These are intentionally deferred for production assistant setup:

1. Scheduler booking integration (Calendly/HubSpot/Cal.com).
2. Stripe checkout/proposal flow.
3. Invoicing automation.

## Hook Points For Deferred Integrations

- **Scheduler hook:** Stage 1 CTA block in `src/app/[slug]/SparkPage.tsx`.
- **Transition intent hook:** Stage 2 CTA intent capture in `src/app/[slug]/pitch/PitchPage.tsx`.
- **Spark data contract:** `src/types/spark.ts` and `src/lib/sparks.ts`.

## Troubleshooting

- QA fails: run `npx tsx scripts/qa-spark.ts <slug>` and fix reported field/citation issues.
- Build fails: validate Spark JSON shapes and required fields first.
- Missing page data: verify slug file exists under `lib/data/sparks/<slug>.json`.
- Localhost won't open: confirm `npm run dev` is running and port 3000 is free.
- GitHub actions from assistant unavailable: re-check `gh auth status`.
- Vercel deploy actions from assistant unavailable: re-check `vercel whoami`.
