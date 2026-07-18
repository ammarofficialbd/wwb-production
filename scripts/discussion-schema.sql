-- Discussion feature tables
-- Run this in the Supabase SQL Editor (project: nntnuzodvshtzysaslhd).

CREATE TABLE IF NOT EXISTS public.channels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL DEFAULT 'private',
  description text,
  created_by text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.channel_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id uuid REFERENCES public.channels(id) ON DELETE CASCADE,
  user_id text NOT NULL,
  username text NOT NULL,
  avatar_id int NOT NULL DEFAULT 0,
  role text NOT NULL DEFAULT 'member',
  joined_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id uuid REFERENCES public.channels(id) ON DELETE CASCADE,
  user_id text NOT NULL,
  username text NOT NULL,
  avatar_id int NOT NULL DEFAULT 0,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.channel_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "disc_read" ON public.channels;
DROP POLICY IF EXISTS "disc_read_members" ON public.channel_members;
DROP POLICY IF EXISTS "disc_read_msgs" ON public.messages;
DROP POLICY IF EXISTS "disc_write" ON public.channels;
DROP POLICY IF EXISTS "disc_write_members" ON public.channel_members;
DROP POLICY IF EXISTS "disc_write_msgs" ON public.messages;

CREATE POLICY "disc_read" ON public.channels FOR SELECT USING (true);
CREATE POLICY "disc_read_members" ON public.channel_members FOR SELECT USING (true);
CREATE POLICY "disc_read_msgs" ON public.messages FOR SELECT USING (true);
CREATE POLICY "disc_write" ON public.channels FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "disc_write_members" ON public.channel_members FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "disc_write_msgs" ON public.messages FOR ALL USING (true) WITH CHECK (true);
