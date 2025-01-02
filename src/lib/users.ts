import { supabase } from './supabase';

interface AppUser {
  id: string;
  email: string;
  role?: string;
  created_at: string;
}

export async function getUsers(): Promise<AppUser[]> {
  // Get users from user_roles table with auth.users data
  const { data: usersWithRoles, error: usersError } = await supabase
    .from('user_roles')
    .select('*');
  
  if (usersError) throw usersError;

  // Get user details from auth.getUser for each role
  const users = await Promise.all(
    usersWithRoles.map(async (userRole) => {
      const { data: { user }, error } = await supabase.auth.admin.getUserById(userRole.user_id);
      if (error || !user) return null;
      
      return {
        id: user.id,
        email: user.email!,
        role: userRole.role,
        created_at: user.created_at,
      };
    })
  );

  return users.filter((user): user is AppUser => user !== null);
}

export async function createUser(email: string, password: string): Promise<void> {
  const { data: { user }, error: createError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (createError) throw createError;
  if (!user) throw new Error('Failed to create user');

  // Set default role
  const { error: roleError } = await supabase
    .from('user_roles')
    .insert({ user_id: user.id, role: 'user' });

  if (roleError) throw roleError;
}

export async function deleteUser(userId: string): Promise<void> {
  const { error } = await supabase.auth.admin.deleteUser(userId);
  if (error) throw error;
}

export async function toggleUserRole(userId: string, newRole: 'admin' | 'user'): Promise<void> {
  const { error } = await supabase
    .rpc('set_user_role', {
      target_user_id: userId,
      new_role: newRole,
    });

  if (error) throw error;
}
