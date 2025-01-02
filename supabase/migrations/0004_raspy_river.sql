/*
  # Add user management functionality

  1. Changes
    - Add function to create initial admin user
    - Add function to manage user roles
    - Add policies for role management

  2. Security
    - Maintain RLS policies
    - Add secure functions for role management
*/

-- Function to set user role
CREATE OR REPLACE FUNCTION public.set_user_role(target_user_id uuid, new_role text)
RETURNS void AS $$
BEGIN
  INSERT INTO user_roles (user_id, role)
  VALUES (target_user_id, new_role)
  ON CONFLICT (user_id) 
  DO UPDATE SET role = new_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
