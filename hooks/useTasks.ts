import { useEffect } from "react";
import { useAuth } from "./useAuth";
import { useTaskStore } from "@/stores/useStore";

export function useTasks() {
  const { user } = useAuth();
  const { tasks, loading, fetchTask } = useTaskStore();

  useEffect(() => {
    if (user) {
      fetchTask(user.id);
    } else {
      useTaskStore.getState().clearTask();
    }
  }, [user, fetchTask]);

  return { tasks, loading };
}
