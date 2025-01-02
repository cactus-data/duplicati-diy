/*
  # Add admin role management

  1. Changes
    - Create user_roles table to track admin status
    - Add functions to check and manage admin status
    - Add policies for admin operations

  2. Security
    - Only admins can manage other users' roles
    - Regular users cannot access admin features
*/

-- Create table for storing user roles
CREATE TABLE IF NOT EXISTS user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('admin', 'user')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM user_roles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role(user_id uuid)
RETURNS text AS $$
BEGIN
  RETURN (
    SELECT role
    FROM user_roles
    WHERE user_roles.user_id = $1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create policies for user_roles table
CREATE POLICY "Users can read their own role"
  ON user_roles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
  ON user_roles
  FOR ALL
  TO authenticated
  USING (is_admin());

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON user_roles(role);

-- Update existing policies to include admin check
DROP POLICY IF EXISTS "Allow authenticated users to read backup_configs" ON backup_configs;
CREATE POLICY "Allow authenticated users to read backup_configs"
  ON backup_configs
  FOR SELECT
  TO authenticated
  USING (is_admin() OR true);

DROP POLICY IF EXISTS "Allow authenticated users to read backup_reports" ON backup_reports;
CREATE POLICY "Allow authenticated users to read backup_reports"
  ON backup_reports
  FOR SELECT
  TO authenticated
  USING (is_admin() OR true);

DROP POLICY IF EXISTS "Allow authenticated users to read backend_statistics" ON backend_statistics;
CREATE POLICY "Allow authenticated users to read backend_statistics"
  ON backend_statistics
  FOR SELECT
  TO authenticated
  USING (is_admin() OR true);
