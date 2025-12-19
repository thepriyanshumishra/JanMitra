-- CREATE BROADCASTS TABLE

CREATE TABLE IF NOT EXISTS broadcasts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message TEXT NOT NULL,
  type TEXT CHECK (type IN ('info', 'warning', 'error')) DEFAULT 'info',
  is_active BOOLEAN DEFAULT TRUE,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE broadcasts ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Everyone can view active broadcasts"
  ON broadcasts FOR SELECT
  TO authenticated, anon
  USING (is_active = true);

CREATE POLICY "Admins can manage broadcasts"
  ON broadcasts FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

NOTIFY pgrst, 'reload config';
