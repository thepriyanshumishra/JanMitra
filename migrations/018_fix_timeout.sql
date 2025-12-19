-- FIX TIMEOUT (Revert Admin Policies)
-- The "Admins can view/update all" policies seem to be causing recursion or performance issues.
-- We will remove them to restore login functionality.

-- 1. Drop the heavy policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;

-- 2. Ensure simple "Self-Access" policies exist
-- (These are fast and safe)

DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (id = auth.uid());

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (id = auth.uid());

-- 3. Reload config
NOTIFY pgrst, 'reload config';
