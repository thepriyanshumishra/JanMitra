-- =====================================================
-- JAN-MITRA: RBAC Database Schema Migration (FIXED)
-- =====================================================
-- Execute this script in Supabase SQL Editor
-- Order: Run sections sequentially from top to bottom

-- =====================================================
-- 0. CREATE PROFILES TABLE (If it doesn't exist)
-- =====================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'citizen' CHECK (role IN ('citizen', 'officer', 'admin')),
  department_id UUID,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create trigger to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- 1. CREATE DEPARTMENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default departments
INSERT INTO departments (name, description) VALUES
  ('PWD', 'Public Works Department - Roads, Bridges, Infrastructure'),
  ('Water Supply', 'Jal Board - Water Supply & Distribution'),
  ('Electricity', 'Power Distribution Corporation'),
  ('Sanitation', 'Municipal Corporation - Waste Management'),
  ('Traffic Police', 'Road Safety & Traffic Management')
ON CONFLICT (name) DO NOTHING;

-- Add foreign key constraint to profiles after departments table is created
ALTER TABLE profiles 
  DROP CONSTRAINT IF EXISTS profiles_department_id_fkey;

ALTER TABLE profiles
  ADD CONSTRAINT profiles_department_id_fkey 
  FOREIGN KEY (department_id) REFERENCES departments(id);

-- =====================================================
-- 2. UPDATE GRIEVANCES TABLE
-- =====================================================
-- Add department assignment
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'grievances' AND column_name = 'department_id'
  ) THEN
    ALTER TABLE grievances ADD COLUMN department_id UUID REFERENCES departments(id);
  END IF;
END $$;

-- Add assigned officer
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'grievances' AND column_name = 'assigned_officer_id'
  ) THEN
    ALTER TABLE grievances ADD COLUMN assigned_officer_id UUID REFERENCES profiles(id);
  END IF;
END $$;

-- Add internal notes (visible only to officers/admin)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'grievances' AND column_name = 'internal_notes'
  ) THEN
    ALTER TABLE grievances ADD COLUMN internal_notes TEXT[];
  END IF;
END $$;

-- Add status history (track all status changes)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'grievances' AND column_name = 'status_history'
  ) THEN
    ALTER TABLE grievances ADD COLUMN status_history JSONB DEFAULT '[]'::jsonb;
  END IF;
END $$;

-- =====================================================
-- 3. ROW-LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE grievances ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for clean slate)
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Officers can view department profiles" ON profiles;

DROP POLICY IF EXISTS "Citizens view own grievances" ON grievances;
DROP POLICY IF EXISTS "Officers view department grievances" ON grievances;
DROP POLICY IF EXISTS "Admins view all grievances" ON grievances;
DROP POLICY IF EXISTS "Citizens insert own grievances" ON grievances;
DROP POLICY IF EXISTS "Officers update department grievances" ON grievances;
DROP POLICY IF EXISTS "Admins update all grievances" ON grievances;

DROP POLICY IF EXISTS "Everyone can view departments" ON departments;
DROP POLICY IF EXISTS "Admins can manage departments" ON departments;

-- =====================================================
-- PROFILES TABLE POLICIES
-- =====================================================

-- Users can insert their own profile (for trigger)
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (id = auth.uid());

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (id = auth.uid());

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (id = auth.uid());

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

-- Officers can view profiles in their department
CREATE POLICY "Officers can view department profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'officer' 
    AND department_id = (SELECT department_id FROM profiles WHERE id = auth.uid())
  );

-- =====================================================
-- GRIEVANCES TABLE POLICIES
-- =====================================================

-- Citizens: View only their own grievances
CREATE POLICY "Citizens view own grievances"
  ON grievances FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() 
    OR (SELECT role FROM profiles WHERE id = auth.uid()) IN ('officer', 'admin')
  );

-- Officers: View grievances assigned to their department
CREATE POLICY "Officers view department grievances"
  ON grievances FOR SELECT
  TO authenticated
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'officer'
    AND department_id = (SELECT department_id FROM profiles WHERE id = auth.uid())
  );

-- Admins: View all grievances
CREATE POLICY "Admins view all grievances"
  ON grievances FOR SELECT
  TO authenticated
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

-- Citizens: Insert their own grievances
CREATE POLICY "Citizens insert own grievances"
  ON grievances FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Officers: Update grievances in their department
CREATE POLICY "Officers update department grievances"
  ON grievances FOR UPDATE
  TO authenticated
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'officer'
    AND department_id = (SELECT department_id FROM profiles WHERE id = auth.uid())
  );

-- Admins: Update any grievance
CREATE POLICY "Admins update all grievances"
  ON grievances FOR UPDATE
  TO authenticated
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

-- =====================================================
-- DEPARTMENTS TABLE POLICIES
-- =====================================================

-- Everyone can view departments
CREATE POLICY "Everyone can view departments"
  ON departments FOR SELECT
  TO authenticated
  USING (true);

-- Only admins can manage departments
CREATE POLICY "Admins can manage departments"
  ON departments FOR ALL
  TO authenticated
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

-- =====================================================
-- 4. CREATE HELPER FUNCTIONS
-- =====================================================

-- Function to get user role
CREATE OR REPLACE FUNCTION get_user_role(user_id UUID)
RETURNS TEXT AS $$
  SELECT role FROM profiles WHERE id = user_id;
$$ LANGUAGE SQL SECURITY DEFINER;

-- Function to auto-assign department based on category
CREATE OR REPLACE FUNCTION auto_assign_department()
RETURNS TRIGGER AS $$
BEGIN
  -- Auto-assign department based on category
  NEW.department_id := CASE 
    WHEN NEW.category ILIKE '%road%' OR NEW.category ILIKE '%pothole%' THEN 
      (SELECT id FROM departments WHERE name = 'PWD' LIMIT 1)
    WHEN NEW.category ILIKE '%water%' THEN 
      (SELECT id FROM departments WHERE name = 'Water Supply' LIMIT 1)
    WHEN NEW.category ILIKE '%electric%' OR NEW.category ILIKE '%power%' THEN 
      (SELECT id FROM departments WHERE name = 'Electricity' LIMIT 1)
    WHEN NEW.category ILIKE '%garbage%' OR NEW.category ILIKE '%sanitation%' THEN 
      (SELECT id FROM departments WHERE name = 'Sanitation' LIMIT 1)
    WHEN NEW.category ILIKE '%traffic%' THEN 
      (SELECT id FROM departments WHERE name = 'Traffic Police' LIMIT 1)
    ELSE NULL
  END;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-assign department on grievance insert
DROP TRIGGER IF EXISTS auto_assign_department_trigger ON grievances;
CREATE TRIGGER auto_assign_department_trigger
  BEFORE INSERT ON grievances
  FOR EACH ROW
  EXECUTE FUNCTION auto_assign_department();

-- =====================================================
-- 5. BACKFILL EXISTING USERS (If any exist)
-- =====================================================
-- Create profiles for existing auth.users who don't have one
INSERT INTO profiles (id, email, full_name, avatar_url)
SELECT 
  au.id,
  au.email,
  au.raw_user_meta_data->>'full_name',
  au.raw_user_meta_data->>'avatar_url'
FROM auth.users au
WHERE NOT EXISTS (
  SELECT 1 FROM profiles p WHERE p.id = au.id
);

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================
-- Run these to verify setup:

-- 1. Check if profiles table exists and has data
SELECT * FROM profiles;

-- 2. Check departments
SELECT * FROM departments;

-- 3. Check profiles with roles
SELECT id, email, role, department_id, is_active FROM profiles;

-- 4. Check grievances with department assignments
SELECT id, summary, category, department_id, assigned_officer_id FROM grievances LIMIT 10;

-- 5. Test that trigger works (this should fail if trigger doesn't work)
-- Sign up a new user via your app and check if profile is auto-created

-- =====================================================
-- MANUAL ROLE ASSIGNMENT (For Testing)
-- =====================================================
-- After running this migration, manually assign roles:

-- Make yourself an admin (replace with your email):
-- UPDATE profiles SET role = 'admin' WHERE email = 'your-email@example.com';

-- Create an officer (replace with actual email):
-- UPDATE profiles SET role = 'officer', department_id = (SELECT id FROM departments WHERE name = 'PWD' LIMIT 1) WHERE email = 'officer@example.com';

-- =====================================================
-- MIGRATION COMPLETE  ✓
-- =====================================================
-- Next Steps:
-- 1. Run this entire script in Supabase SQL Editor
-- 2. Verify all queries return expected results
-- 3. Assign yourself as admin using the manual commands above
-- 4. Proceed to Phase 2: Auth Context Enhancement
