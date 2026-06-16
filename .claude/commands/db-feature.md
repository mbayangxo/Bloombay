# /db-feature

Scaffolds a complete database feature: migration + server actions + TypeScript types.

## Usage
/db-feature [feature-name] [description]

Example: `/db-feature bloom-journal Personal daily journal entries for each member`

## What I create
1. **`supabase/migrations/[next-number]_[feature-name].sql`**
   - `create table if not exists` with uuid primary key
   - Foreign key to `public.profiles(id) on delete cascade`
   - `created_at timestamptz not null default now()`
   - `alter table ... enable row level security`
   - RLS policies: read own, write own, delete own (adjust per feature)
   - Indexes for common query patterns

2. **`lib/actions/[feature-name].ts`**
   - TypeScript interface for the row type
   - `get[Feature](userId)` — fetch with Supabase server client
   - `create[Feature](data)` — insert
   - `update[Feature](id, data)` — update own
   - `delete[Feature](id)` — delete own
   - All functions use `@/lib/supabase/server`

3. **Types** — exported from the actions file so components can import them

## Rules
- Migration number = highest existing migration number + 1
- All tables are in `public` schema
- Service role key is NEVER used in lib/actions — use the regular server client
- RLS policies are the security layer — trust them, don't re-check auth in actions
- `if not exists` on all creates so migrations are idempotent
