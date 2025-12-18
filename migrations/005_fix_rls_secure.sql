-- =====================================================
-- JAN-MITRA: Fix RLS Infinite Recursion (Securely)
-- =====================================================

-- 1. Create a helper function to get the current user's role
-- This function uses SECURITY DEFINER to bypass RLS on the profiles table
-- preventing the infinite recursion loop.
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS TEXT AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role
  FROM public.profiles
  WHERE id = auth.uid();
  
  RETURN user_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Drop existing problematic policies
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Officers can view department profiles" ON profiles;

-- 3. Re-create policies using the helper function

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (id = auth.uid());

-- Admins can view all profiles
-- Uses get_my_role() which is safe and non-recursive
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (get_my_role() = 'admin');

-- Officers can view profiles in their department
CREATE POLICY "Officers can view department profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    get_my_role() = 'officer' 
    AND department_id = (SELECT department_id FROM profiles WHERE id = auth.uid())
  );

-- 4. Update Grievance Policies to use the helper too (for consistency)
DROP POLICY IF EXISTS "Admins view all grievances" ON grievances;
DROP POLICY IF EXISTS "Officers view department grievances" ON grievances;

CREATE POLICY "Admins view all grievances"
  ON grievances FOR SELECT
  TO authenticated
  USING (get_my_role() = 'admin');

CREATE POLICY "Officers view department grievances"
  ON grievances FOR SELECT
  TO authenticated
  USING (
    get_my_role() = 'officer'
    AND department_id = (SELECT department_id FROM profiles WHERE id = auth.uid())
  );

-- 5. Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_my_role TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_my_role TO service_role;
