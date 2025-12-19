-- CREATE FEEDBACK TABLE

CREATE TABLE IF NOT EXISTS feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  grievance_id UUID REFERENCES grievances(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(grievance_id) -- One feedback per grievance
);

-- Enable RLS
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can create feedback for own grievances"
  ON feedback FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM grievances
      WHERE id = grievance_id AND user_id = auth.uid() AND status = 'resolved'
    )
  );

CREATE POLICY "Users can view own feedback"
  ON feedback FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all feedback"
  ON feedback FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

NOTIFY pgrst, 'reload config';
