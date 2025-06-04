-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create couple_pages table
CREATE TABLE public.couple_pages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  partner1_name TEXT NOT NULL,
  partner2_name TEXT NOT NULL,
  relationship_start_date DATE NOT NULL,
  qr_code_url TEXT,
  page_slug TEXT UNIQUE NOT NULL,
  theme_color TEXT DEFAULT '#B61862',
  background_animation TEXT DEFAULT 'hearts',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create memories table
CREATE TABLE public.memories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  couple_page_id UUID REFERENCES public.couple_pages(id) ON DELETE CASCADE NOT NULL,
  title TEXT,
  description TEXT,
  media_url TEXT,
  media_type TEXT CHECK (media_type IN ('image', 'video')),
  memory_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create music table
CREATE TABLE public.music (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  couple_page_id UUID REFERENCES public.couple_pages(id) ON DELETE CASCADE NOT NULL,
  song_title TEXT NOT NULL,
  artist TEXT,
  spotify_url TEXT,
  youtube_url TEXT,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  couple_page_id UUID REFERENCES public.couple_pages(id) ON DELETE CASCADE NOT NULL,
  notification_type TEXT CHECK (notification_type IN ('monthly', 'yearly')) NOT NULL,
  last_sent_date DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.couple_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.music ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own couple pages" ON public.couple_pages
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create couple pages" ON public.couple_pages
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own couple pages" ON public.couple_pages
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view active couple pages by slug" ON public.couple_pages
  FOR SELECT USING (is_active = true);

CREATE POLICY "Users can manage own memories" ON public.memories
  FOR ALL USING (
    couple_page_id IN (
      SELECT id FROM public.couple_pages WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage own music" ON public.music
  FOR ALL USING (
    couple_page_id IN (
      SELECT id FROM public.couple_pages WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage own notifications" ON public.notifications
  FOR ALL USING (
    couple_page_id IN (
      SELECT id FROM public.couple_pages WHERE user_id = auth.uid()
    )
  );

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
