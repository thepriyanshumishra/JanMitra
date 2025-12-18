-- Force a schema cache reload for PostgREST
-- Run this if you see errors like "Could not find a relationship between X and Y"
NOTIFY pgrst, 'reload config';
