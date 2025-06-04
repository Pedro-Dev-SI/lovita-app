-- Create policies for users table
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create policies for couple_pages table
CREATE POLICY "Users can view own couple pages" ON public.couple_pages
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create couple pages" ON public.couple_pages
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own couple pages" ON public.couple_pages
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view active couple pages by slug" ON public.couple_pages
  FOR SELECT USING (is_active = true);

-- Create policies for memories table
CREATE POLICY "Users can manage own memories" ON public.memories
  FOR ALL USING (
    couple_page_id IN (
      SELECT id FROM public.couple_pages WHERE user_id = auth.uid()
    )
  );

-- Create policies for music table
CREATE POLICY "Users can manage own music" ON public.music
  FOR ALL USING (
    couple_page_id IN (
      SELECT id FROM public.couple_pages WHERE user_id = auth.uid()
    )
  );

-- Create policies for notifications table
CREATE POLICY "Users can manage own notifications" ON public.notifications
  FOR ALL USING (
    couple_page_id IN (
      SELECT id FROM public.couple_pages WHERE user_id = auth.uid()
    )
  );
