-- 101_yande_tables_rls.sql
-- migration 062_yande_memory_agents.sql created member_memory_graph,
-- memory_events, yande_messages, and yande_scientist_reports with NO row
-- level security at all. Any authenticated (or, depending on grants, anon)
-- caller holding the public anon key could read or write any row in any
-- of these tables directly via the Supabase REST API — including reading
-- another member's private Yande messages, or marking them read.
--
-- Everything that legitimately writes to these tables already goes
-- through either a service-role client (the yande-* and memory-keeper cron
-- routes, via lib/supabase/admin-style createClient with
-- SUPABASE_SERVICE_ROLE_KEY) or a SECURITY DEFINER trigger function
-- (yande_emit_memory_event, migration 063) — both bypass RLS entirely, so
-- enabling RLS here only closes the anon/authenticated-key hole and does
-- not break any existing writer.

alter table public.yande_messages enable row level security;

create policy "Yande messages read own or ops"
  on public.yande_messages for select to authenticated
  using (user_id = auth.uid() or public.has_ops_role());

create policy "Yande messages update own or ops"
  on public.yande_messages for update to authenticated
  using (user_id = auth.uid() or public.has_ops_role());

alter table public.member_memory_graph enable row level security;

create policy "Member memory graph read own or ops"
  on public.member_memory_graph for select to authenticated
  using (user_id = auth.uid() or public.has_ops_role());

alter table public.memory_events enable row level security;

create policy "Memory events read own or ops"
  on public.memory_events for select to authenticated
  using (user_id = auth.uid() or public.has_ops_role());

-- Internal weekly platform report — founder/ops only, never member-facing.
alter table public.yande_scientist_reports enable row level security;

create policy "Yande scientist reports ops only"
  on public.yande_scientist_reports for select to authenticated
  using (public.has_ops_role());
