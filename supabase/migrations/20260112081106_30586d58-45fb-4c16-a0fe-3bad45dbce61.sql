-- Add chat_messages column to user_roadmaps table
ALTER TABLE public.user_roadmaps 
ADD COLUMN chat_messages JSONB DEFAULT '[]'::jsonb;