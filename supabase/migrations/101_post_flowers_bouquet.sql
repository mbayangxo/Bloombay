-- Avenue / post flowers: flower (1) or bouquet (12)

alter table public.post_flowers
  add column if not exists gift_kind text not null default 'flower'
    check (gift_kind in ('flower', 'bouquet'));

alter table public.post_flowers
  add column if not exists units int not null default 1;

update public.post_flowers
set units = case when gift_kind = 'bouquet' then 12 else 1 end
where units is distinct from case when gift_kind = 'bouquet' then 12 else 1 end;

drop policy if exists "post_flowers_update_own" on public.post_flowers;
create policy "post_flowers_update_own"
  on public.post_flowers for update using (auth.uid() = user_id);
