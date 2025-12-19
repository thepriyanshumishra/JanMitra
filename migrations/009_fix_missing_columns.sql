-- Fix missing columns in grievances table
-- The error "Could not find the 'description' column" indicates these are missing.

ALTER TABLE grievances 
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS category TEXT,
ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'Medium';

-- Ensure draft columns are also present (just in case)
ALTER TABLE grievances 
ADD COLUMN IF NOT EXISTS chat_history JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS extracted_data JSONB DEFAULT '{}'::jsonb;

-- Ensure status check allows 'draft'
ALTER TABLE grievances DROP CONSTRAINT IF EXISTS grievances_status_check;
ALTER TABLE grievances ADD CONSTRAINT grievances_status_check 
    CHECK (status IN ('draft', 'pending', 'in_progress', 'resolved', 'rejected'));
