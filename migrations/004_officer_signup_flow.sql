-- =====================================================
-- JAN-MITRA: Officer Signup & Approval Flow Migration
-- =====================================================

-- 1. Update handle_new_user function to handle role and is_active status
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_role TEXT;
  user_is_active BOOLEAN;
BEGIN
  -- Extract role from metadata, default to 'citizen'
  user_role := COALESCE(NEW.raw_user_meta_data->>'role', 'citizen');
  
  -- Validate role (security check)
  IF user_role NOT IN ('citizen', 'officer') THEN
    user_role := 'citizen';
  END IF;

  -- Set active status based on role
  -- Officers need approval (inactive), Citizens are active immediately
  IF user_role = 'officer' THEN
    user_is_active := FALSE;
  ELSE
    user_is_active := TRUE;
  END IF;

  INSERT INTO public.profiles (id, email, full_name, avatar_url, role, is_active)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url',
    user_role,
    user_is_active
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Create index for faster filtering of pending officers
CREATE INDEX IF NOT EXISTS idx_profiles_role_active ON profiles(role, is_active);

-- 3. Verify the function update
-- (No data changes needed for existing users)
