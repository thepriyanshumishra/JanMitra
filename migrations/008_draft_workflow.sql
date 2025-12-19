-- Add draft support to grievances table

-- 1. Add new columns for chat history and extracted data
ALTER TABLE grievances 
ADD COLUMN IF NOT EXISTS chat_history JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS extracted_data JSONB DEFAULT '{}'::jsonb;

-- 2. Update status check constraint or enum
-- Assuming status is a text column with a check constraint, we drop and re-add it.
-- If it's an enum, we alter the type.
-- Let's try to handle both or just the check constraint if that's what we used.

-- Safely attempt to add 'draft' to the enum if it exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'grievance_status') THEN
        ALTER TYPE grievance_status ADD VALUE IF NOT EXISTS 'draft';
    END IF;
END$$;

-- If it's a check constraint on a text column (common in simple setups)
ALTER TABLE grievances DROP CONSTRAINT IF EXISTS grievances_status_check;
ALTER TABLE grievances ADD CONSTRAINT grievances_status_check 
    CHECK (status IN ('draft', 'pending', 'in_progress', 'resolved', 'rejected'));
