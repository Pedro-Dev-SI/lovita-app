-- Add subscription plan to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS subscription_plan TEXT CHECK (subscription_plan IN ('forever', 'annual', 'none')) DEFAULT 'none',
ADD COLUMN IF NOT EXISTS subscription_start_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS subscription_end_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS max_images INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS has_music BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS has_dynamic_background BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS has_exclusive_animations BOOLEAN DEFAULT false;

-- Update RLS policies to include subscription checks
DROP POLICY IF EXISTS "Users can create couple pages" ON public.couple_pages;
CREATE POLICY "Users can create couple pages" ON public.couple_pages
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND 
    (SELECT subscription_plan FROM public.users WHERE id = auth.uid()) != 'none'
  );

-- Create a function to check subscription limits
CREATE OR REPLACE FUNCTION public.check_subscription_limits()
RETURNS TRIGGER AS $$
DECLARE
  user_subscription TEXT;
  user_max_images INTEGER;
  current_images INTEGER;
BEGIN
  -- Get user subscription info
  SELECT subscription_plan, max_images INTO user_subscription, user_max_images
  FROM public.users
  WHERE id = (SELECT user_id FROM public.couple_pages WHERE id = NEW.couple_page_id);
  
  -- Count current images
  SELECT COUNT(*) INTO current_images
  FROM public.memories
  WHERE couple_page_id = NEW.couple_page_id AND media_type = 'image';
  
  -- Check if adding this image would exceed the limit
  IF NEW.media_type = 'image' AND current_images >= user_max_images THEN
    RAISE EXCEPTION 'Maximum number of images reached for your subscription plan';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for checking limits when adding memories
DROP TRIGGER IF EXISTS check_memory_limits ON public.memories;
CREATE TRIGGER check_memory_limits
  BEFORE INSERT ON public.memories
  FOR EACH ROW EXECUTE FUNCTION public.check_subscription_limits();

-- Update the handle_new_user function to set default subscription to 'none'
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (
    id, 
    email, 
    full_name, 
    subscription_plan, 
    max_images,
    has_music,
    has_dynamic_background,
    has_exclusive_animations
  )
  VALUES (
    NEW.id, 
    NEW.email, 
    NEW.raw_user_meta_data->>'full_name',
    'none',
    0,
    false,
    false,
    false
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Success message
SELECT 'Subscription plan features added successfully! 🎉' as status;
