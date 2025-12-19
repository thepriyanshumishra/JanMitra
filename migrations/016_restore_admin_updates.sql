-- RESTORE ADMIN UPDATE PERMISSIONS
-- The emergency fix removed the ability for Admins to update other users.
-- We need to add that back, but SAFELY (using the helper function to avoid recursion).

-- 1. Ensure the helper function exists (it should, but good to be safe)
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS TEXT AS $$
BEGIN
  RETURN (SELECT role FROM public.profiles WHERE id = user_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Add Policy: Admins can update ALL profiles
CREATE POLICY "Admins can update all profiles"
  ON profiles FOR UPDATE
  TO authenticated
  USING (public.get_user_role(auth.uid()) = 'admin');

-- 3. Add Policy: Admins can view ALL profiles (if not already present)
-- (The emergency fix might have removed this too)
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (public.get_user_role(auth.uid()) = 'admin');
