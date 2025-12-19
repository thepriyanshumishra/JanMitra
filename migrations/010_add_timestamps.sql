-- Fix missing timestamp columns
-- The error "Could not find the 'updated_at' column" indicates this is missing.

ALTER TABLE grievances 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

-- Optional: Add a trigger to automatically update 'updated_at'
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_grievances_updated_at ON grievances;
CREATE TRIGGER update_grievances_updated_at
    BEFORE UPDATE ON grievances
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
