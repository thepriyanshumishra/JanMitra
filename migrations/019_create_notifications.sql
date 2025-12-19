-- CREATE NOTIFICATIONS TABLE

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('info', 'success', 'warning', 'error')) DEFAULT 'info',
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Trigger to auto-create notification on Grievance Status Change
CREATE OR REPLACE FUNCTION notify_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status <> NEW.status THEN
    INSERT INTO notifications (user_id, type, message)
    VALUES (
      NEW.user_id,
      'info',
      'Your grievance #' || substring(NEW.id::text, 1, 8) || ' status updated to ' || NEW.status
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_grievance_status_change ON grievances;
CREATE TRIGGER on_grievance_status_change
  AFTER UPDATE ON grievances
  FOR EACH ROW
  EXECUTE FUNCTION notify_status_change();

NOTIFY pgrst, 'reload config';
