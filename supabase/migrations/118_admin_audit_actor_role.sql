-- Migration 118: add actor_role to admin_audit_logs (Migration 115 used actor_id)

alter table public.admin_audit_logs
  add column if not exists actor_role text;

create index if not exists admin_audit_logs_actor_role_idx
  on public.admin_audit_logs (actor_role, created_at desc);
