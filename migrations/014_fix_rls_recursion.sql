-- Fix RLS Infinite Recursion by using SECURITY DEFINER function

-- 1. Ensure the helper function exists and is SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS TEXT AS $$
BEGIN
  RETURN (SELECT role FROM public.profiles WHERE id = user_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Drop problematic policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Officers can view department profiles" ON profiles;
DROP POLICY IF EXISTS "Admins view all grievances" ON grievances;
DROP POLICY IF EXISTS "Officers view department grievances" ON grievances;
DROP POLICY IF EXISTS "Admins update all grievances" ON grievances;
DROP POLICY IF EXISTS "Officers update department grievances" ON grievances;
DROP POLICY IF EXISTS "Admins can manage departments" ON departments;

-- 3. Re-create policies using the helper function

-- PROFILES
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (public.get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Officers can view department profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    public.get_user_role(auth.uid()) = 'officer' 
    AND department_id = (SELECT department_id FROM profiles WHERE id = auth.uid())
  );

-- GRIEVANCES
CREATE POLICY "Admins view all grievances"
  ON grievances FOR SELECT
  TO authenticated
  USING (public.get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Officers view department grievances"
  ON grievances FOR SELECT
  TO authenticated
  USING (
    public.get_user_role(auth.uid()) = 'officer'
    AND department_id = (SELECT department_id FROM profiles WHERE id = auth.uid())
  );

CREATE POLICY "Admins update all grievances"
  ON grievances FOR UPDATE
  TO authenticated
  USING (public.get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Officers update department grievances"
  ON grievances FOR UPDATE
  TO authenticated
  USING (
    public.get_user_role(auth.uid()) = 'officer'
    AND department_id = (SELECT department_id FROM profiles WHERE id = auth.uid())
  );

-- DEPARTMENTS
CREATE POLICY "Admins can manage departments"
  ON departments FOR ALL
  TO authenticated
  USING (public.get_user_role(auth.uid()) = 'admin');
