# /rls-add

Generates correct RLS policies for a Supabase table.

## Usage
/rls-add [table-name] [access-pattern]

Access patterns:
- `own` — user can only see/edit their own rows (user_id = auth.uid())
- `public-read` — anyone can read, owner can write
- `participants` — visible to a set of participant user_ids (like conversations)
- `admin-write` — only admin/founder role can insert/update

## What I output

```sql
-- Enable RLS (safe to run if already enabled)
alter table public.[table] enable row level security;

-- [Pattern-appropriate policies]
create policy "[table]_read_[scope]"
  on public.[table] for select
  using (...);

create policy "[table]_insert_own"
  on public.[table] for insert
  with check (auth.uid() = user_id);

create policy "[table]_update_own"
  on public.[table] for update
  using (auth.uid() = user_id);

create policy "[table]_delete_own"
  on public.[table] for delete
  using (auth.uid() = user_id);
```

## Rules
- Always use `create policy if not exists` to avoid errors on re-run
- `select using` checks visibility
- `insert with check` checks permission to create
- `update using` checks permission to modify
- Admin role check: `exists (select 1 from public.profiles where id = auth.uid() and role in ('admin','founder'))`
- NEVER use `security definer` functions unless absolutely necessary — they bypass RLS
