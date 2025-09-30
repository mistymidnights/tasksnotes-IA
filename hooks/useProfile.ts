import { useEffect } from 'react';
import { useAuth } from './useAuth';
import { useUserStore } from '@/stores/useStore';

export function useProfile() {
  const { user } = useAuth();
  const { profile, loading, fetchProfile } = useUserStore();

  useEffect(() => {
    if (user) {
      fetchProfile(user.id);
    } else {
      useUserStore.getState().clearProfile();
    }
  }, [user, fetchProfile]);

  return { profile, loading };
}
