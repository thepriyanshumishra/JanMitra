-- Fix missing foreign key relationship for grievances table
-- This resolves the PGRST200 error: "Could not find a relationship between 'grievances' and 'user_id'"

-- 1. Add explicit foreign key constraint to profiles table
ALTER TABLE public.grievances
DROP CONSTRAINT IF EXISTS grievances_user_id_fkey;

ALTER TABLE public.grievances
ADD CONSTRAINT grievances_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES public.profiles(id)
ON DELETE CASCADE;

-- 2. Refresh the schema cache (Supabase usually does this automatically, but good to be safe)
NOTIFY pgrst, 'reload config';
