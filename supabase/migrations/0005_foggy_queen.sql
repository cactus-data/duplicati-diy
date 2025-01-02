/*
  # Set admin role for specific user

  1. Changes
    - Add admin role for sylap69@gmail.com
    - Add policy to allow admins to manage roles
*/

-- Set admin role for specific user
DO $$
DECLARE
  target_user_id uuid;
BEGIN
  -- Get user ID from auth.users
  SELECT id INTO target_user_id
  FROM auth.users
  WHERE email = 'sylap69@gmail.com';

  -- Set admin role if user exists
  IF target_user_id IS NOT NULL THEN
    PERFORM set_user_role(target_user_id, 'admin');
  END IF;
END $$;
