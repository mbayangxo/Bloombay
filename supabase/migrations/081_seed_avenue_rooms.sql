-- Seed avenue_content rows for reading, vanity, health, magazine, column rooms
-- Safe to re-run: insert ... on conflict do nothing

insert into avenue_content (room, content_type, status, title, body, author, meta, published_at)
values

-- ── READING ROOM ─────────────────────────────────────────────────────────────

(
  'reading', 'book_rec', 'approved',
  'Homegoing',
  'Six generations of one family across two continents — Yaa Gyasi writes lineage and loss with a precision that made me sit in silence after the last page.',
  'Fatima K.',
  '{"book_title": "Homegoing", "book_author": "Yaa Gyasi", "category": "afrolit", "rating": 5, "spine_color": "#8B1A4B", "spine_color2": "#C2185B"}',
  now() - interval '1 day'
),

(
  'reading', 'book_rec', 'approved',
  'Giovanni''s Room',
  'Baldwin writes desire and shame with such economy. Every sentence feels like it cost him something to write. One of the most honest books about what it means to want.',
  'Nadia P.',
  '{"book_title": "Giovanni''s Room", "book_author": "James Baldwin", "category": "fiction", "rating": 5, "spine_color": "#1A237E", "spine_color2": "#283593"}',
  now() - interval '2 days'
),

(
  'reading', 'book_rec', 'approved',
  'All About Love',
  'bell hooks dismantles every story we tell ourselves about love and replaces it with something cleaner and harder. I highlighted half the book.',
  'Amara T.',
  '{"book_title": "All About Love", "book_author": "bell hooks", "category": "self-growth", "rating": 5, "spine_color": "#004D40", "spine_color2": "#00695C"}',
  now() - interval '3 days'
),

(
  'reading', 'book_rec', 'approved',
  'Olga Dies Dreaming',
  'Funny, political, devastating. Xochitl Gonzalez writes family and Puerto Rican identity in a way that made me feel seen even as an outsider to that story.',
  'Zara F.',
  '{"book_title": "Olga Dies Dreaming", "book_author": "Xochitl Gonzalez", "category": "fiction", "rating": 4, "spine_color": "#880E4F", "spine_color2": "#AD1457"}',
  now() - interval '4 days'
),

-- ── VANITY ───────────────────────────────────────────────────────────────────

(
  'vanity', 'beauty_rec', 'approved',
  'My pre-wash routine for natural hair',
  'Stopped skipping pre-wash prep and my breakage dropped by half in two months. The order matters more than the products.',
  'Kezia M.',
  '{"category": "haircare", "products": ["Mielle Rosemary Oil", "Briogeo B. Well Scalp Serum", "Camille Rose Algae Renew Deep Conditioner", "Design Essentials Natural Mousse"], "gradient_a": "#4A148C", "gradient_b": "#7B1FA2"}',
  now() - interval '1 day'
),

(
  'vanity', 'beauty_rec', 'approved',
  'The perfumes that make women stop me on the street',
  'I have been stopped mid-crosswalk three times this year. Here are the four culprits.',
  'Zara F.',
  '{"category": "fragrance", "products": ["Maison Margiela Replica — Jazz Club", "Byredo Bal d''Afrique", "Le Labo Santal 33", "Kilian Angels Share"], "gradient_a": "#C62828", "gradient_b": "#E53935"}',
  now() - interval '2 days'
),

(
  'vanity', 'beauty_rec', 'approved',
  'Dark spot treatment that actually worked for me',
  'Six months in. The spots are gone. Not faded — gone. This is the exact protocol.',
  'Sofia W.',
  '{"category": "skincare", "products": ["iS Clinical Active Serum", "SkinBetter Alto Defense Serum", "Differin Gel (the secret)", "Tatcha Dewy Skin Cream"], "gradient_a": "#F57F17", "gradient_b": "#F9A825"}',
  now() - interval '3 days'
),

(
  'vanity', 'beauty_rec', 'approved',
  'The nail routine that keeps my acrylics lasting 4 weeks',
  'My nail tech taught me one thing: prep is the whole game. Everything else is finishing.',
  'Nia B.',
  '{"category": "nails", "products": ["OPI Nail Envy", "CND Solar Speed Spray", "Jessica Phenomen Oil", "Gelish Structure Gel"], "gradient_a": "#880E4F", "gradient_b": "#C2185B"}',
  now() - interval '4 days'
),

-- ── HEALTH ───────────────────────────────────────────────────────────────────

(
  'health', 'wellness_rec', 'approved',
  'High-protein breakfast that keeps me full until 2pm',
  'I stopped eating again at 11am the week I started making this. The black beans are the move.',
  'Kezia M.',
  '{"category": "meal", "ingredients": ["2 eggs", "1/2 cup egg whites", "1/2 cup black beans", "handful spinach", "1/4 avocado", "everything bagel seasoning"], "steps": ["Scramble eggs and egg whites together in a pan over medium heat", "Add spinach and black beans, stir until warmed through", "Plate with sliced avocado and finish with everything bagel seasoning"], "gradient_a": "#BF360C", "gradient_b": "#E64A19"}',
  now() - interval '1 day'
),

(
  'health', 'wellness_rec', 'approved',
  'The 90-second cold exposure ritual',
  'I thought this was for men who post about ice baths. I was wrong. Week three and my mood is genuinely different.',
  'Amara T.',
  '{"category": "tip", "ingredients": ["Cold shower", "Timer", "Towel"], "steps": ["Set water as cold as it goes", "Step in for 30 seconds, breathe through it", "Work up to 90 seconds daily — endorphins are real"], "gradient_a": "#006064", "gradient_b": "#00838F"}',
  now() - interval '2 days'
),

(
  'health', 'wellness_rec', 'approved',
  'The green smoothie that doesn''t taste like grass',
  'My partner who hates vegetables asked for this twice in one week. The mango carries.',
  'Nia B.',
  '{"category": "smoothie", "ingredients": ["2 cups frozen mango", "1 cup spinach", "1 cup coconut water", "1/2 lime juiced", "1 tsp spirulina", "1/2 inch ginger"], "steps": ["Blend mango and coconut water first", "Add greens and ginger, blend again", "Add spirulina last — blend 10 seconds only"], "gradient_a": "#1B5E20", "gradient_b": "#2E7D32"}',
  now() - interval '3 days'
),

(
  'health', 'wellness_rec', 'approved',
  'Liver detox juice (do this on a Monday)',
  'Monday morning, empty stomach, before coffee. The cayenne is non-negotiable. You will feel it working.',
  'Zara F.',
  '{"category": "juice", "ingredients": ["1 beet", "2 carrots", "1 lemon", "1 apple", "1 inch ginger", "1/2 tsp cayenne"], "steps": ["Juice everything except cayenne", "Stir in cayenne", "Drink on empty stomach, wait 30 min before eating"], "gradient_a": "#4A148C", "gradient_b": "#6A1B9A"}',
  now() - interval '4 days'
),

-- ── MAGAZINE ─────────────────────────────────────────────────────────────────

(
  'magazine', 'article', 'approved',
  'Stop Calling It a ''Girl Boss Move'' and Call It What It Is',
  'On the language we use to diminish women''s ambition and what it tells us about who''s watching.',
  'Sofia W.',
  '{"section": "opinion", "dek": "On the language we use to diminish women''s ambition and what it tells us about who''s watching.", "read_time": "5 min read", "cover_a": "#0D47A1", "cover_b": "#1565C0", "featured": true}',
  now() - interval '1 day'
),

(
  'magazine', 'article', 'approved',
  'The Talking Stage Is Not a Relationship',
  'Clarity, boundaries, and why you deserve to know what you are before you''re six months in.',
  'Amara T.',
  '{"section": "love", "dek": "Clarity, boundaries, and why you deserve to know what you are before you''re six months in.", "read_time": "4 min read", "cover_a": "#880E4F", "cover_b": "#C2185B", "featured": false}',
  now() - interval '2 days'
),

(
  'magazine', 'article', 'approved',
  'Negotiating While Black',
  'How to advocate for your salary when the room is watching you differently than everyone else.',
  'Fatima K.',
  '{"section": "career", "dek": "How to advocate for your salary when the room is watching you differently than everyone else.", "read_time": "7 min read", "cover_a": "#212121", "cover_b": "#424242", "featured": false}',
  now() - interval '3 days'
),

(
  'magazine', 'article', 'approved',
  'I Stopped Buying Fast Fashion and My Wardrobe Got Smaller and Better',
  'A six-month experiment in buying less, buying better, and actually loving what I own.',
  'Zara F.',
  '{"section": "style", "dek": "A six-month experiment in buying less, buying better, and actually loving what I own.", "read_time": "6 min read", "cover_a": "#4A148C", "cover_b": "#7B1FA2", "featured": false}',
  now() - interval '4 days'
),

-- ── COLUMN ───────────────────────────────────────────────────────────────────

(
  'column', 'column', 'approved',
  'New York Is Still Worth It (Even When It Isn''t)',
  'This city is expensive, loud, occasionally heartbreaking. It''s also the only place I''ve ever felt entirely like myself. The subway delayed again, my apartment smaller than my college dorm, and still — I would not trade the feeling of walking into a room and knowing I belong to one of the great world cities. There''s a version of me that moved to Austin in 2022. She''s probably thriving. But I don''t think she''s me.',
  'Zara F.',
  '{"theme": "city", "opening": "I almost left three times. Here''s what stopped me.", "body_text": "This city is expensive, loud, occasionally heartbreaking. It''s also the only place I''ve ever felt entirely like myself. The subway delayed again, my apartment smaller than my college dorm, and still — I would not trade the feeling of walking into a room and knowing I belong to one of the great world cities. There''s a version of me that moved to Austin in 2022. She''s probably thriving. But I don''t think she''s me."}',
  now() - interval '1 day'
),

(
  'column', 'column', 'approved',
  'The Credit Card I Was Embarrassed to Not Have at 27',
  'Nobody tells you that financial literacy is also social currency. My first real salary felt enormous and somehow still not enough. The shame of not knowing what an index fund was — sitting at a dinner table where everyone else seemed fluent in money — that shame is something I''ve never heard anyone name out loud. So I''m naming it.',
  'Amara T.',
  '{"theme": "money", "opening": "Everyone around me had the Amex Gold. I had a debit card and a lot of feelings about it.", "body_text": "Nobody tells you that financial literacy is also social currency. My first real salary felt enormous and somehow still not enough. The shame of not knowing what an index fund was — sitting at a dinner table where everyone else seemed fluent in money — that shame is something I''ve never heard anyone name out loud. So I''m naming it."}',
  now() - interval '2 days'
),

(
  'column', 'column', 'approved',
  'The Year I Stopped Apologizing for What I Ate',
  'I spent a decade explaining my food choices to people who weren''t eating them. The juice fast I didn''t want to do. The birthday cake I should have eaten. The lunch I should have finished. It takes an enormous amount of energy to perform eating in a way that makes other people comfortable. At some point I ran out of energy for it.',
  'Kezia M.',
  '{"theme": "body", "opening": "It started with canceling a dinner reservation because I didn''t want to hear the comments.", "body_text": "I spent a decade explaining my food choices to people who weren''t eating them. The juice fast I didn''t want to do. The birthday cake I should have eaten. The lunch I should have finished. It takes an enormous amount of energy to perform eating in a way that makes other people comfortable. At some point I ran out of energy for it."}',
  now() - interval '3 days'
),

(
  'column', 'column', 'approved',
  'The Friendship That Almost Ended When We Both Got Successful',
  'It''s hard to articulate what happens when a friendship grows unevenly — when one of you moves faster, earns more, gets more attention. The comparison is quiet at first, then louder. We never fought about it directly. We just became careful with each other in a way that felt like grief. The work of saving it was the most adult thing I''ve ever done.',
  'Nia B.',
  '{"theme": "friends", "opening": "We had been friends for nine years before success became competitive.", "body_text": "It''s hard to articulate what happens when a friendship grows unevenly — when one of you moves faster, earns more, gets more attention. The comparison is quiet at first, then louder. We never fought about it directly. We just became careful with each other in a way that felt like grief. The work of saving it was the most adult thing I''ve ever done."}',
  now() - interval '4 days'
)

on conflict do nothing;
