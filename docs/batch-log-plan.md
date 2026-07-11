# Batch Log Feature Plan

A tool for tracking active fermentation batches — what you started, when, and what happened along the way. Built in three phases so it's useful immediately and scales to multi-user later.

---

## Data Model

```
batches
  id            uuid, primary key
  user_id       text (Clerk user ID, nullable in Phase 1)
  name          text (e.g. "Blackberry Wine 2026")
  type          text (wine | kefir | sourdough | kombucha | other)
  status        text (active | paused | finished | abandoned)
  start_date    date
  notes         text (optional, general notes about the batch)
  created_at    timestamp
  updated_at    timestamp

batch_entries
  id            uuid, primary key
  batch_id      uuid, foreign key → batches.id
  entry_date    date
  observation   text (what you noticed — color, smell, bubbling, taste)
  action_taken  text (optional — what you did: racked, added nutrient, etc.)
  created_at    timestamp
```

---

## Phase 1 — Personal Batch Log (No Auth)

**Goal:** Get the feature working and genuinely useful before adding any multi-user complexity. You are the only user; no login required.

### Stack

- **Neon** (PostgreSQL) — create a project at neon.tech, grab the connection string
- **Drizzle ORM** — TypeScript-first, lightweight, excellent Neon support
- **`@neondatabase/serverless`** — Neon's edge-compatible Postgres driver

### Files to Create

```
src/
  db/
    schema.ts         # Drizzle schema: batches + batch_entries tables
    index.ts          # DB client (neon + drizzle instance)
  app/
    batches/
      page.tsx              # List all batches
      new/
        page.tsx            # Create a new batch
      [id]/
        page.tsx            # Batch detail: timeline of entries
        edit/
          page.tsx          # Edit batch name/status/notes
        entries/
          new/
            page.tsx        # Add a log entry to a batch
    api/
      batches/
        route.ts            # GET all, POST new
        [id]/
          route.ts          # GET one, PATCH, DELETE
          entries/
            route.ts        # GET entries for batch, POST new entry
```

### Steps

1. Create a Neon project; copy the connection string into `.env.local` as `DATABASE_URL`
2. Install dependencies: `npm install drizzle-orm @neondatabase/serverless` and `npm install -D drizzle-kit`
3. Write `src/db/schema.ts` — define `batches` and `batch_entries` tables in Drizzle
4. Add `drizzle.config.ts` at the root for migrations
5. Run `npx drizzle-kit generate` then `npx drizzle-kit migrate` to create tables in Neon
6. Build `src/db/index.ts` — export the drizzle client
7. Build API routes (server actions or route handlers) for batch CRUD and entry creation
8. Build UI pages: list → detail → new batch → add entry
9. Add "Batch Log" link to the site navigation

### Definition of Done

- Can create a new batch with name, type, start date, and optional notes
- Can view all active batches on a dashboard page
- Can add timestamped log entries (observation + optional action) to any batch
- Can mark a batch finished or abandoned
- Data persists in Neon across page reloads

---

## Phase 2 — Open Registration

**Goal:** Let others sign up and maintain their own batch logs. Each user sees only their own data.

### Stack Addition

- **Clerk** — handles registration, login, session management, and user UI. Free tier supports up to 10,000 MAU.

### Changes from Phase 1

1. Install Clerk: `npm install @clerk/nextjs`
2. Add Clerk middleware (`src/middleware.ts`) — protects `/winemaking/batches/**` routes, redirects unauthenticated users to sign-in
3. Wrap `layout.tsx` with `<ClerkProvider>`
4. Add sign-in / sign-up pages (Clerk provides pre-built components)
5. Add a sign-in/out button to the site navigation
6. Update all DB queries to filter by `clerk_user_id` (from `auth()` in Clerk)
7. Set `user_id` to NOT NULL in the schema (migration required)
8. Ensure API routes validate that the requesting user owns the batch before any PATCH/DELETE

### Steps

1. Create a Clerk application at clerk.com; copy API keys into `.env.local`
2. Add and configure `src/middleware.ts`
3. Update `src/app/layout.tsx` to wrap with `<ClerkProvider>`
4. Add sign-in/sign-up routes using Clerk's Next.js integration
5. Update `src/db/schema.ts` — make `user_id` NOT NULL, run migration
6. Update all API route handlers to call `auth()` and scope queries to current user
7. Test: create two accounts, verify data isolation

### Definition of Done

- Unauthenticated users are redirected to sign-in when accessing `/winemaking/batches`
- New users can register with email/password (or OAuth if configured in Clerk)
- Each user's batch list and entries are private to them
- No user can read or modify another user's batches via the API

---

## Phase 3 — Monetization (Optional)

**Goal:** Offer a free tier with limits and a paid tier for power users, if usage warrants it.

### Approach

Keep it simple: a free tier capped at a small number of active batches, a paid tier for unlimited. Add Stripe for payment processing.

### Stack Addition

- **Stripe** — subscription billing
- A `subscription_tier` column on a `user_profiles` table (or directly on a Clerk user metadata field)

### Suggested Tier Structure

| Tier | Active Batches | Price |
|------|---------------|-------|
| Free | 3 | $0 |
| Brewer | Unlimited | $3–5/month |

### Steps

1. Decide on tier limits and pricing
2. Create a Stripe account; set up a subscription product and price
3. Add a `user_profiles` table: `(clerk_user_id, stripe_customer_id, subscription_tier)`
4. Build a `/account` page with subscription status and upgrade/manage buttons
5. Add a Stripe webhook handler (`/api/webhooks/stripe`) to update `subscription_tier` on payment events
6. Add a gate in the batch creation API route: check tier before allowing a 4th active batch
7. Show upgrade prompts in the UI when a free user hits the limit

### Neon Free Tier Headroom

Neon's free tier provides 512 MB storage and 191.9 compute hours/month. A batch log row is tiny — at ~1 KB per entry, you could store ~500,000 entries before hitting storage limits. The free tier is comfortable through early growth; only revisit if you have thousands of active daily users.

### Definition of Done

- Free users are blocked from creating more than 3 active batches with an upgrade prompt
- Paid users can create unlimited batches
- Stripe handles billing; webhook keeps `subscription_tier` current
- Users can manage or cancel their subscription from the `/account` page

---

## Environment Variables

```bash
# Phase 1
DATABASE_URL=          # Neon connection string

# Phase 2
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Phase 3
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```
