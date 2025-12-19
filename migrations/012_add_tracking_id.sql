-- Add tracking_id column
ALTER TABLE grievances 
ADD COLUMN IF NOT EXISTS tracking_id TEXT UNIQUE;

-- Function to generate random tracking ID
CREATE OR REPLACE FUNCTION generate_tracking_id()
RETURNS TRIGGER AS $$
DECLARE
  chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  result TEXT := 'JM-';
  i INTEGER;
BEGIN
  -- Only generate if not already provided
  IF NEW.tracking_id IS NULL THEN
    FOR i IN 1..6 LOOP
      result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
    END LOOP;
    
    -- Ensure uniqueness (simple retry logic could be added but collision is rare for 6 chars)
    -- For now, we assume uniqueness.
    NEW.tracking_id := result;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to assign tracking_id on insert
DROP TRIGGER IF EXISTS set_tracking_id ON grievances;
CREATE TRIGGER set_tracking_id
BEFORE INSERT ON grievances
FOR EACH ROW
EXECUTE FUNCTION generate_tracking_id();

-- Backfill existing records
UPDATE grievances
SET tracking_id = 'JM-' || upper(substr(md5(random()::text), 1, 6))
WHERE tracking_id IS NULL;
