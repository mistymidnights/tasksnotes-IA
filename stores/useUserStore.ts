import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase } from "@/lib/supabaseClient";
import { addToast } from "@heroui/toast";

// ----------------- TIPOS DE DATOS -----------------
export interface UserProfile {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  date_of_birth: string | null;
  created_at: string;
  updated_at: string;
}

type ProfileUpdates = Partial<UserProfile>;

interface UserState {
  profile: UserProfile | null;
  loading: boolean;
  fetchProfile: (userId: string) => Promise<void>;
  clearProfile: () => void;
  updateProfile: (updates: any) => Promise<void>;
}

// ----------------- LA STORE -----------------

export const useUserStore = create(
  persist<UserState>(
    (set, get) => ({
      profile: null,
      loading: true,

      fetchProfile: async (userId) => {
        set({ loading: true });
        try {
          const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", userId)
            .single();

          if (error) {
            console.error("Error fetching profile:", error);
            set({ profile: null, loading: false });
          } else {
            set({ profile: data, loading: false });
          }
        } catch (error) {
          console.error("Error in fetchProfile:", error);
          set({ profile: null, loading: false });
        }
      },

      clearProfile: () => set({ profile: null, loading: false }),

      updateProfile: async (updates: any) => {
        set({ loading: true });
        try {
          const { profile } = get();
          if (!profile) throw new Error("No hay un perfil para actualizar.");

          const { error } = await supabase
            .from("profiles")
            .update(updates)
            .eq("id", profile.id);

          if (error) {
            addToast({
              title: "Error inesperado",
              description: "Ocurrió un problema desconocido.",
              color: "danger",
            });
            console.error("Error updating profile:", error);
          } else {
            set((state) => ({
              profile: { ...state.profile, ...updates },
              loading: false,
            }));
          }
        } catch (error) {
          console.error("Error in updateProfile:", error);
          set({ loading: false });
        }
      },
    }),

    {
      name: "user-profile-storage",
    }
  )
);
