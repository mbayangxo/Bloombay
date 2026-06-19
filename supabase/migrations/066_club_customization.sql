-- Migration 066 — Club Customization
-- Adds club_customization table for crest, layout, colors, cover, and tagline.

CREATE TABLE IF NOT EXISTS public.club_customization (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id       uuid REFERENCES public.clubs(id) ON DELETE CASCADE NOT NULL UNIQUE,
  -- Crest
  crest_shape   text DEFAULT 'shield',   -- 'shield', 'circle', 'arch', 'diamond'
  crest_symbol  text DEFAULT 'flower',   -- 'flower', 'star', 'leaf', 'crown', 'book', 'flame', 'moon', 'sun'
  crest_color_primary   text DEFAULT '#FF1F7D',
  crest_color_secondary text DEFAULT '#1C1B1C',
  crest_color_accent    text DEFAULT '#D4A853',
  crest_url     text,                    -- stored SVG URL if saved
  -- Club layout
  layout        text DEFAULT 'editorial', -- 'editorial', 'cozy', 'gallery', 'minimal'
  -- Colors
  accent_color  text DEFAULT '#FF1F7D',
  bg_color      text DEFAULT '#FEFCF7',
  text_color    text DEFAULT '#1C1B1C',
  -- Cover
  cover_url     text,
  cover_position text DEFAULT 'center',  -- 'top', 'center', 'bottom'
  -- Tagline / about
  tagline       text,
  about         text,
  updated_at    timestamptz DEFAULT now()
);

-- ── RLS ──────────────────────────────────────────────────────────────────────

ALTER TABLE public.club_customization ENABLE ROW LEVEL SECURITY;

-- All authenticated users (members) can read club customizations
CREATE POLICY "club_customization_select_members"
  ON public.club_customization
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Only the club owner can insert their customization row
CREATE POLICY "club_customization_insert_owner"
  ON public.club_customization
  FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL AND
    EXISTS (
      SELECT 1 FROM public.clubs
      WHERE clubs.id = club_customization.club_id
        AND clubs.owner_id = auth.uid()
    )
  );

-- Only the club owner can update their customization
CREATE POLICY "club_customization_update_owner"
  ON public.club_customization
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.clubs
      WHERE clubs.id = club_customization.club_id
        AND clubs.owner_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.clubs
      WHERE clubs.id = club_customization.club_id
        AND clubs.owner_id = auth.uid()
    )
  );

-- Only the club owner can delete their customization
CREATE POLICY "club_customization_delete_owner"
  ON public.club_customization
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.clubs
      WHERE clubs.id = club_customization.club_id
        AND clubs.owner_id = auth.uid()
    )
  );

-- ── Index ─────────────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_club_customization_club_id
  ON public.club_customization(club_id);
