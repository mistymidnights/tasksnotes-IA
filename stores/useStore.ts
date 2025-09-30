import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase } from "@/lib/supabaseClient";
import { addToast } from "@heroui/toast";

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
/* ----------------TASKS--------------------- */

export interface Task {
  id: string;
  user_id: string;
  task: string;
  is_complete: boolean;
  created_at?: string;
}

interface TaskState {
  tasks: Task[];
  loading: boolean;
  fetchTask: (userId: string) => Promise<void>;
  clearTask: () => void;
  addTaskLocally: (newTask: Task) => void;
  updateTaskLocally: (taskId: string, updates: Partial<Task>) => void;
  deleteTaskLocally: (taskId: string) => void;
  toggleTaskCompletion: (
    taskId: string,
    currentStatus: boolean
  ) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
}

export const useTaskStore = create(
  persist<TaskState>(
    (set, get) => ({
      tasks: [],
      loading: true,

      fetchTask: async (userId) => {
        set({ loading: true });
        try {
          const { data, error } = await supabase
            .from("todos")
            .select("*")
            .eq("user_id", userId)
            .order("created_at", { ascending: false });

          if (error) {
            addToast({
              title: "Error obteniendo tareas",
              color: "danger",
            });
            console.error("Error fetching tasks:", error);
            set({ tasks: [], loading: false });
          } else {
            set({ tasks: data as Task[], loading: false });
          }
        } catch (error) {
          console.error("Error in fetchTask:", error);
          set({ tasks: [], loading: false });
        }
      },

      clearTask: () => set({ tasks: [], loading: false }),

      addTaskLocally: (newTask) => {
        set((state) => ({
          tasks: [newTask, ...state.tasks],
        }));
      },

      updateTaskLocally: (taskId, updates) => {
        set((state) => ({
          tasks: state.tasks.map((task) => {
            if (task.id === taskId) {
              return { ...task, ...updates };
            }
            return task;
          }),
        }));
      },

      deleteTaskLocally: (taskId) => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== taskId),
        }));
      },

      toggleTaskCompletion: async (taskId, currentStatus) => {
        const newStatus = !currentStatus;
        const taskToUpdate = get().tasks.find((t) => t.id === taskId);

        get().updateTaskLocally(taskId, { is_complete: newStatus });

        try {
          const { error } = await supabase
            .from("todos")
            .update({ is_complete: newStatus })
            .eq("id", taskId);

          if (error) {
            addToast({
              title: "Error al actualizar en la base de datos",
              color: "danger",
            });
            console.error("Error Supabase al actualizar:", error);

            if (taskToUpdate) {
              get().updateTaskLocally(taskId, { is_complete: currentStatus });
            }
            throw new Error(error.message);
          }
        } catch (error) {
          console.error("Fallo la actualización de tarea:", error);
        }
      },
      deleteTask: async (taskId) => {
        const taskToDelete = get().tasks.find((t) => t.id === taskId);
        if (!taskToDelete) return;

        get().deleteTaskLocally(taskId);

        try {
          const { error } = await supabase
            .from("todos")
            .delete()
            .eq("id", taskId);

          if (error) {
            addToast({
              title: "Error al eliminar",
              description: "Error al eliminar tareas en la base de datos.",
              color: "danger",
            });
            console.error("Error Supabase al eliminar:", error);
            get().addTaskLocally(taskToDelete);
            throw new Error(error.message);
          }
        } catch (error) {
          console.error("Fallo la eliminación de tarea:", error);
        }
      },
    }),

    {
      name: "task-profile-storage",
    }
  )
);
