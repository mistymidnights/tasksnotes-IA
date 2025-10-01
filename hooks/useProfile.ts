import { useEffect } from "react";
import { useUserStore } from "@/stores/useStore";

export function useProfile() {
  const userId = useUserStore((state) => state.profile?.id);
  const { profile, loading, fetchProfile } = useUserStore();

  useEffect(() => {
    if (userId) {
      fetchProfile(userId);
    } else {
      useUserStore.getState().clearProfile();
    }
  }, [userId, fetchProfile]);

  return { profile, loading };
}
