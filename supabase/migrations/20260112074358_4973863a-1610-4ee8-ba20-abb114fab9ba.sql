-- Add expertise_level column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS expertise_level TEXT CHECK (expertise_level IN ('complete_beginner', 'beginner', 'intermediate', 'advanced'));

-- Create user_roadmaps table for saving generated roadmaps
CREATE TABLE IF NOT EXISTS public.user_roadmaps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  career_path_id UUID REFERENCES public.career_paths(id) ON DELETE CASCADE,
  expertise_level TEXT NOT NULL CHECK (expertise_level IN ('complete_beginner', 'beginner', 'intermediate', 'advanced')),
  roadmap_content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on user_roadmaps
ALTER TABLE public.user_roadmaps ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_roadmaps
CREATE POLICY "Users can view their own roadmaps" 
ON public.user_roadmaps 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own roadmaps" 
ON public.user_roadmaps 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own roadmaps" 
ON public.user_roadmaps 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own roadmaps" 
ON public.user_roadmaps 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_user_roadmaps_updated_at
BEFORE UPDATE ON public.user_roadmaps
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();