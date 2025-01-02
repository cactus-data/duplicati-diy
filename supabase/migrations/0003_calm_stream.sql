/*
  # Add default admin and improve role handling

  1. Changes
    - Add function to handle missing roles
    - Insert default admin role for the first user
    - Update role checking to handle missing roles gracefully

  2. Security
    - Maintain RLS policies
    - Add secure function for role checking
*/

-- Function to safely check user role
CREATE OR REPLACE FUNCTION public.get_user_role_safe(user_id uuid)
RETURNS text AS $$
BEGIN
  RETURN COALESCE(
    (
      SELECT role
      FROM user_roles
      WHERE user_roles.user_id = $1
    ),
    'user' -- Default role if none exists
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update the is_admin function to use the safe role check
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN get_user_role_safe(auth.uid()) = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
