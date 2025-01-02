import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/useAuthStore';

export function useAdminCheck() {
  const { user } = useAuthStore();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkIsAdmin() {
      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .maybeSingle();

        // Consider user as non-admin if query fails or no role found
        setIsAdmin(!error && data?.role === 'admin');
      } catch (error) {
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    }

    checkIsAdmin();
  }, [user]);

  return { isAdmin, loading };
}
