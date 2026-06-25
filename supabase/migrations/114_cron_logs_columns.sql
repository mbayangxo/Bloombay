-- Cron logs schema upgrade — Migration 114
-- Adds structured columns for run duration, record counts, and error messages.
-- Previously only had: id, job, result, details (jsonb), ran_at

alter table public.cron_logs
  add column if not exists records_processed integer,
  add column if not exists error_message     text,
  add column if not exists started_at        timestamptz,
  add column if not exists finished_at       timestamptz;

-- Index for quick failure queries
create index if not exists cron_logs_result_idx
  on public.cron_logs(result, ran_at desc)
  where result = 'error';
