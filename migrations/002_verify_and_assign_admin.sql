-- =====================================================
-- VERIFICATION SCRIPT
-- Run these queries to verify migration success
-- =====================================================

-- 1. Check profiles table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'profiles'
ORDER BY ordinal_position;

-- 2. Check if profiles exist (should auto-create on user signup)
SELECT id, email, role, department_id, is_active, created_at
FROM profiles;

-- 3. Check all departments
SELECT * FROM departments ORDER BY name;

-- 4. Check grievances table structure (new columns)
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'grievances' 
  AND column_name IN ('department_id', 'assigned_officer_id', 'internal_notes', 'status_history');

-- 5. Check if auto-department assignment works
SELECT id, summary, category, department_id, 
       (SELECT name FROM departments WHERE id = grievances.department_id) as department_name
FROM grievances
LIMIT 10;

-- =====================================================
-- MANUAL ROLE ASSIGNMENT
-- =====================================================
-- Replace 'YOUR_EMAIL_HERE' with your actual email

-- Make yourself an ADMIN:
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'YOUR_EMAIL_HERE';

-- Verify the change:
SELECT email, role FROM profiles WHERE email = 'YOUR_EMAIL_HERE';

-- Create a test OFFICER (optional):
-- UPDATE profiles 
-- SET role = 'officer', 
--     department_id = (SELECT id FROM departments WHERE name = 'PWD' LIMIT 1)
-- WHERE email = 'officer@example.com';
