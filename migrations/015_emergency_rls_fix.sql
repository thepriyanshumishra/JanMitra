-- EMERGENCY RLS FIX
-- Purpose: Strip policies to bare minimum to fix login/timeout issues.

-- 1. Reset RLS on profiles
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 2. Drop ALL existing policies on profiles (Clean Slate)
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Officers can view department profiles" ON profiles;

-- 3. Add ONLY the "Self Access" policies (Guaranteed No Recursion)
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (id = auth.uid());

-- 4. Verify your role (Optional - just to be sure)
-- UPDATE profiles SET role = 'admin' WHERE email = 'your-email@example.com';
