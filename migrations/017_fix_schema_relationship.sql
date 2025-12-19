-- FIX SCHEMA RELATIONSHIP (AGAIN)
-- The error "Could not find a relationship between 'grievances' and 'user_id'" indicates the FK is missing or not recognized.

-- 1. Explicitly drop and re-add the Foreign Key
ALTER TABLE public.grievances
DROP CONSTRAINT IF EXISTS grievances_user_id_fkey;

ALTER TABLE public.grievances
ADD CONSTRAINT grievances_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES public.profiles(id)
ON DELETE CASCADE;

-- 2. Force PostgREST to reload the schema cache
NOTIFY pgrst, 'reload config';
