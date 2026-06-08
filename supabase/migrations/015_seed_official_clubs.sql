-- Seed the two real BloomBay-operated clubs (idempotent)

insert into public.clubs (
  slug,
  name,
  tagline,
  description,
  welcome_line,
  primary_color,
  accent_color
)
values
  (
    'founding-mothers-nyc',
    'Founding Mothers NYC',
    'The first women who said yes to BloomBay.',
    'Our founding circle in New York — the women building BloomBay from the inside.',
    'You helped build this. Welcome home.',
    '#FF1F7D',
    '#7F0030'
  ),
  (
    'bloombay-gatherings',
    'BloomBay Gatherings',
    'Official dinners, walks, and city plans — hosted by us.',
    'When BloomBay hosts a happening directly, it lives here.',
    'See what''s on this week in Happenings.',
    '#FF69B4',
    '#C51B7A'
  )
on conflict (slug) do update set
  name = excluded.name,
  tagline = excluded.tagline,
  description = excluded.description,
  welcome_line = excluded.welcome_line,
  updated_at = now();
