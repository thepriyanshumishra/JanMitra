-- Check if RLS is blocking your profile query
-- Run this to see what's happening

-- 1. Check current RLS policies on profiles table
SELECT tablename, policyname, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'profiles';

-- 2. Temporarily disable RLS to test (CAUTION: Only for debugging!)
-- Don't run this in production
-- ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- 3. Test the profile query directly as your user
SELECT * FROM profiles WHERE id = (SELECT auth.uid());

-- 4. Better: Add a more permissive policy for users to view their own profile
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (true); -- Allow all authenticated users to see all profiles (we'll refine this later)

-- 5. Verify your profile exists and has admin role
SELECT id, email, role, is_active FROM profiles WHERE email = 'thedarkpcm@gmail.com';

-- 6. After testing, if it works, you can make the policy more restrictive:
-- DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
-- CREATE POLICY "Users can view own profile"
--   ON profiles FOR SELECT
--   TO authenticated
--   USING (id = auth.uid() OR (SELECT role FROM profiles WHERE id = auth.uid()) IN ('officer', 'admin'));
