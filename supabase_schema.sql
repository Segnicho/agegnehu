-- Posts Table
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('lost', 'found')),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  location TEXT NOT NULL,
  event_date DATE NOT NULL,
  image_url TEXT,
  contact_phone TEXT,
  whatsapp_phone TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'reported', 'hidden')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Reports Table
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Policies for Posts
-- Anyone can read active posts
CREATE POLICY "Public Read Active Posts" ON public.posts
  FOR SELECT USING (status = 'active');

-- Anyone can create a post (anonymous posting)
CREATE POLICY "Anonymous Create Post" ON public.posts
  FOR INSERT WITH CHECK (true);

-- Policies for Reports
-- Anyone can report a post
CREATE POLICY "Anonymous Create Report" ON public.reports
  FOR INSERT WITH CHECK (true);

-- Only authenticated admins can see reports (In MVP we don't have admins, so we keep it restricted)
-- For now, no select policy means nobody can read reports via the API without service role

-- Storage Policies for post-images bucket
-- Anyone can upload an image
CREATE POLICY "Public Upload" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'post-images');

-- Anyone can view an image
CREATE POLICY "Public View" ON storage.objects
  FOR SELECT USING (bucket_id = 'post-images');
