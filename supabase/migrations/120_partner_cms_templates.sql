-- Partner CMS "Brand Templates" / "Page Style" / "Menu Highlights" / "Menu
-- Display" tabs let a partner pick templates and edit menu items, but none
-- of it had backing columns — handleSave() silently dropped all of it on
-- every save. Add real columns so nothing a partner fills out gets lost.
alter table public.restaurant_partners
  add column if not exists poster_template text,
  add column if not exists page_style      text not null default 'bloom'
    check (page_style in ('bloom', 'fabmag')),
  add column if not exists menu_items      jsonb not null default '[]'::jsonb,
  add column if not exists menu_template   text not null default 'cafe_board'
    check (menu_template in ('chalkboard', 'bistro', 'cafe_board', 'weekly_schedule', 'daily_specials')),
  add column if not exists menu_accent     text not null default '#FF1F7D',
  add column if not exists menu_font       text not null default 'var(--font-playfair)';
