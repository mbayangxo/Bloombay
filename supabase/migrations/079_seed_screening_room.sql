-- ── Screening Room: Editorial Seed Data ──────────────────────────────────────
-- 4 real film picks curated by the BloomBay Screening Room editor.
-- Inserted via service role (bypasses RLS). Status = 'approved' so they
-- appear immediately to members via the read_approved policy.

insert into public.avenue_content
  (room, content_type, title, body, source, meta, yande_note, badge, week_of, rank_order, status)
values

  -- 1. New This Week: I Saw the TV Glow
  (
    'screening',
    'film_rec',
    'I Saw the TV Glow',
    'Jane Schoenbrun made something genuinely disquieting here — a film about identity, suburban numbness, and the longing to be someone else that gets under your skin and stays there. It''s hypnotic and strange and probably not for everyone. It is, however, for you specifically. Watch it alone, at night, with no distractions.',
    'Curator',
    '{"where_to_watch": "A24 Channel / MUBI", "genre": "Surreal horror", "runtime": "100 min", "director": "Jane Schoenbrun", "year": 2024, "studio": "A24", "author_name": "BloomBay Screening Room", "author_initial": "B", "author_color": "#E8B84B", "poster_a": "#4A148C", "poster_b": "#880E4F", "rating": 5}'::jsonb,
    'The film that will make you question everything you thought you were comfortable with.',
    'NEW THIS WEEK',
    current_date,
    1,
    'approved'
  ),

  -- 2. International/Arthouse: Mami Wata
  (
    'screening',
    'film_rec',
    'Mami Wata',
    'C.J. ''Fiery'' Obasi shot this Nigerian film in stunning black and white — two sisters fighting to protect their coastal community after a stranger arrives claiming the water spirit has abandoned them. It''s mythic, visually arresting, and made with a precision that puts most Western arthouse cinema to shame. Shot like a dream you don''t want to wake up from.',
    'Curator',
    '{"where_to_watch": "MUBI", "genre": "Drama / Fantasy", "runtime": "110 min", "director": "C.J. ''Fiery'' Obasi", "year": 2023, "country": "Nigeria", "author_name": "BloomBay Screening Room", "author_initial": "B", "author_color": "#E8B84B", "poster_a": "#1A1A1A", "poster_b": "#37474F", "rating": 5}'::jsonb,
    'Nigerian cinema doing things Hollywood cannot imagine.',
    'INTERNATIONAL PICK',
    current_date,
    2,
    'approved'
  ),

  -- 3. Series Pick: The Regime
  (
    'screening',
    'film_rec',
    'The Regime',
    'Kate Winslet plays an unhinged, paranoid European autocrat in this dark political satire that genuinely gets better with every episode. Don''t sleep on it just because the premise sounds dry — this is one of the sharpest pieces of television about power and delusion in years. Six episodes. Watch them all in a weekend. Thank us later.',
    'Curator',
    '{"where_to_watch": "Max", "genre": "Political satire", "runtime": "6 episodes", "network": "HBO", "year": 2024, "starring": "Kate Winslet", "author_name": "BloomBay Screening Room", "author_initial": "B", "author_color": "#E8B84B", "poster_a": "#B71C1C", "poster_b": "#D32F2F", "rating": 5}'::jsonb,
    'Kate Winslet unraveling in real time. You''re welcome.',
    'SERIES PICK',
    current_date,
    3,
    'approved'
  ),

  -- 4. Throwback: Rocks
  (
    'screening',
    'film_rec',
    'Rocks',
    'A 15-year-old Black British girl suddenly responsible for her little brother. Sarah Gavron made this with non-professional actors from East London — real teenagers, real lives, real friendships — and the result is one of the most tender and devastating films of the last decade. If you haven''t seen it, stop what you''re doing. If you have, you know exactly why it''s on this list.',
    'Curator',
    '{"where_to_watch": "Netflix UK / MUBI", "genre": "Drama", "runtime": "93 min", "director": "Sarah Gavron", "year": 2019, "country": "UK", "author_name": "BloomBay Screening Room", "author_initial": "B", "author_color": "#E8B84B", "poster_a": "#E65100", "poster_b": "#BF360C", "rating": 5}'::jsonb,
    'The most real film about girlhood you will ever see.',
    'THROWBACK',
    current_date,
    4,
    'approved'
  );
